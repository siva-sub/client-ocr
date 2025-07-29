import type { BoundingBox } from '../types/ocr.types'
import type { OCRConfig, LangType, OCRVersion, ModelType } from './ocr-config'
import { getLanguageConfig } from './ocr-config'
import { getLanguageModelPaths, LANGUAGE_MODELS } from './language-models'
// import { rotateImage180 } from '../workers/classification.worker.v2' // Not needed since recognition handles original image
import { ModelDownloader, type DownloadProgress } from './model-downloader'
import { WordSegmentation } from './word-segmentation'

export interface OCRResult {
  text: string
  confidence: number
  box: BoundingBox
  angle?: number
  words?: Array<{
    text: string
    confidence: number
    box: BoundingBox
  }>
}

export interface OCREngineOptions {
  lang?: LangType
  version?: OCRVersion
  modelType?: ModelType
  config?: Partial<OCRConfig>
  modelBasePath?: string
  enableWordBoxes?: boolean
}

export interface OCRProgress {
  stage: 'detection' | 'classification' | 'recognition'
  progress: number
}

export class RapidOCREngine {
  private config: OCRConfig
  private workers: {
    detection?: Worker
    classification?: Worker
    recognition?: Worker
  } = {}
  private modelPaths: ReturnType<typeof getLanguageModelPaths>
  private onProgress?: (progress: OCRProgress) => void
  private modelDownloader: ModelDownloader
  // private _onDownloadProgress?: (progress: DownloadProgress) => void
  private enableWordBoxes: boolean
  
  constructor(options: OCREngineOptions = {}) {
    const {
      lang = 'en',
      version = 'PP-OCRv4',
      modelType = 'mobile',
      config = {},
      modelBasePath = '/models',
      enableWordBoxes = false
    } = options
    
    // Get base config for language
    const baseConfig = getLanguageConfig(lang)
    
    // Merge with custom config
    this.config = {
      global: { ...baseConfig.global, ...config.global },
      det: { ...baseConfig.det, ...config.det, ocr_version: version, model_type: modelType },
      cls: { ...baseConfig.cls, ...config.cls, ocr_version: version, model_type: modelType },
      rec: { ...baseConfig.rec, ...config.rec, ocr_version: version, model_type: modelType }
    }
    
    // Get model paths
    this.modelPaths = getLanguageModelPaths(lang, version, modelType)
    
    // Process model paths - store original model info for dictionary extraction
    const originalRecModel = this.modelPaths.rec
    
    // Prepend base path only for relative paths
    if (this.modelPaths.det) {
      const detPath = typeof this.modelPaths.det === 'string' ? this.modelPaths.det : this.modelPaths.det.url
      // Only prepend base path if it's not already a full URL
      this.modelPaths.det = detPath.startsWith('http') ? detPath : `${modelBasePath}/${detPath}`
    }
    if (this.modelPaths.rec) {
      const recPath = typeof this.modelPaths.rec === 'string' ? this.modelPaths.rec : this.modelPaths.rec.url
      // Only prepend base path if it's not already a full URL
      this.modelPaths.rec = recPath.startsWith('http') ? recPath : `${modelBasePath}/${recPath}`
    }
    if (this.modelPaths.cls) {
      const clsPath = typeof this.modelPaths.cls === 'string' ? this.modelPaths.cls : this.modelPaths.cls.url
      // Only prepend base path if it's not already a full URL
      this.modelPaths.cls = clsPath.startsWith('http') ? clsPath : `${modelBasePath}/${clsPath}`
    }
    
    // Handle dictionary path - extract from original rec model if available
    if (originalRecModel && typeof originalRecModel === 'object' && originalRecModel.dictUrl) {
      // Use the dictUrl from the model configuration
      this.modelPaths.dict = originalRecModel.dictUrl
    } else if (this.modelPaths.dict) {
      // Fallback to legacy dictionary path
      this.modelPaths.dict = `${modelBasePath}/${this.modelPaths.dict}`
    }
    
    // Initialize model downloader
    this.modelDownloader = new ModelDownloader()
    
    // Store options
    this.enableWordBoxes = enableWordBoxes
  }
  
  /**
   * Initialize the OCR engine
   */
  async initialize(): Promise<void> {
    const initPromises = []
    
    // Initialize detection worker
    if (this.config.global.use_det && this.modelPaths.det) {
      this.workers.detection = new Worker(
        new URL('../workers/detection.worker.v2.ts', import.meta.url),
        { type: 'module' }
      )
      
      initPromises.push(
        this.initWorker(this.workers.detection, {
          type: 'INIT',
          data: {
            modelPath: this.modelPaths.det,
            config: this.config
          }
        })
      )
    }
    
    // Initialize classification worker
    if (this.config.global.use_cls && this.modelPaths.cls) {
      this.workers.classification = new Worker(
        new URL('../workers/classification.worker.v2.ts', import.meta.url),
        { type: 'module' }
      )
      
      initPromises.push(
        this.initWorker(this.workers.classification, {
          type: 'INIT',
          data: {
            modelPath: this.modelPaths.cls,
            config: this.config
          }
        })
      )
    }
    
    // Initialize recognition worker
    if (this.config.global.use_rec && this.modelPaths.rec) {
      this.workers.recognition = new Worker(
        new URL('../workers/recognition.worker.v2.ts', import.meta.url),
        { type: 'module' }
      )
      
      initPromises.push(
        this.initWorker(this.workers.recognition, {
          type: 'INIT',
          data: {
            modelPath: this.modelPaths.rec,
            dictPath: this.modelPaths.dict,
            config: this.config
          }
        })
      )
    }
    
    await Promise.all(initPromises)
  }
  
  /**
   * Process an image through the OCR pipeline
   */
  async process(
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): Promise<OCRResult[]> {
    const results: OCRResult[] = []
    
    // Stage 1: Detection
    let boxes: BoundingBox[] = []
    if (this.config.global.use_det && this.workers.detection) {
      this.reportProgress('detection', 0)
      boxes = await this.detect(imageData, width, height)
      this.reportProgress('detection', 1)
    } else {
      // No detection - treat whole image as one box
      boxes = [{
        topLeft: { x: 0, y: 0 },
        topRight: { x: width, y: 0 },
        bottomRight: { x: width, y: height },
        bottomLeft: { x: 0, y: height }
      }]
    }
    
    if (boxes.length === 0) {
      return results
    }
    
    console.log('Detection boxes:', boxes.map(b => ({
      x: Math.min(b.topLeft.x, b.bottomLeft.x),
      y: Math.min(b.topLeft.y, b.topRight.y),
      w: Math.max(b.topRight.x, b.bottomRight.x) - Math.min(b.topLeft.x, b.bottomLeft.x),
      h: Math.max(b.bottomLeft.y, b.bottomRight.y) - Math.min(b.topLeft.y, b.topRight.y)
    })))
    
    // Stage 2: Classification (rotation detection)
    const angles: number[] = new Array(boxes.length).fill(0)
    
    if (this.config.global.use_cls && this.workers.classification) {
      this.reportProgress('classification', 0)
      // Crop images only for classification
      const croppedImages = boxes.map(box => this.cropImage(imageData, width, height, box))
      const classResults = await this.classify(croppedImages)
      
      // Store rotation angles for each box
      classResults.forEach((result, i) => {
        angles[i] = result.angle
      })
      
      this.reportProgress('classification', 1)
    }
    
    // Stage 3: Recognition
    if (this.config.global.use_rec && this.workers.recognition) {
      this.reportProgress('recognition', 0)
      console.log(`Sending to recognition: image ${width}x${height}, boxes: ${boxes.length}`)
      
      // Debug: Check original image data
      let nonZeroPixels = 0
      for (let i = 0; i < Math.min(4000, imageData.length); i += 4) {
        if (imageData[i] > 0 || imageData[i+1] > 0 || imageData[i+2] > 0) {
          nonZeroPixels++
        }
      }
      console.log(`Original image has ${nonZeroPixels} non-zero pixels in first 1000 pixels`)
      
      const recResults = await this.recognize(imageData, width, height, boxes)
      
      // Combine results
      for (let i = 0; i < boxes.length; i++) {
        const { text, confidence } = recResults[i]
        
        // Filter by text score
        if (confidence >= this.config.global.text_score) {
          const result: OCRResult = {
            text,
            confidence,
            box: boxes[i],
            angle: angles[i]
          }
          
          // Add word boxes if enabled
          if (this.enableWordBoxes && text.includes(' ')) {
            // Approximate character boxes if not available
            const charBoxes = WordSegmentation.approximateCharBoxes(text, boxes[i])
            const wordBoxes = WordSegmentation.getWordBoxes(text, charBoxes, confidence)
            
            result.words = wordBoxes.map(wb => ({
              text: wb.text,
              confidence: wb.confidence,
              box: wb.box
            }))
          }
          
          results.push(result)
        }
      }
      
      this.reportProgress('recognition', 1)
    }
    
    // Sort results by position (top to bottom, left to right)
    return this.sortResults(results)
  }
  
  /**
   * Set progress callback
   */
  setProgressCallback(callback: (progress: OCRProgress) => void): void {
    this.onProgress = callback
  }
  
  /**
   * Set download progress callback
   */
  setDownloadProgressCallback(callback: (progress: DownloadProgress) => void): void {
    // this._onDownloadProgress = callback
    this.modelDownloader.setProgressCallback(callback)
  }
  
  /**
   * Check if models are available
   */
  async areModelsAvailable(): Promise<boolean> {
    const lang = this.config.det.lang_type as LangType
    const version = this.config.det.ocr_version
    const modelType = this.config.det.model_type
    
    return this.modelDownloader.areModelsCached(lang, version, modelType)
  }
  
  /**
   * Download models if not available
   */
  async downloadModels(): Promise<void> {
    const lang = this.config.det.lang_type as LangType
    const version = this.config.det.ocr_version
    const modelType = this.config.det.model_type
    
    // Get model URLs
    const modelUrls = await this.modelDownloader.getModelUrls(lang, version, modelType)
    
    // Download required models
    const downloads: Promise<void>[] = []
    
    if (this.config.global.use_det && modelUrls.det) {
      downloads.push(
        this.modelDownloader.downloadModel(modelUrls.det).then(() => {})
      )
    }
    
    if (this.config.global.use_cls && modelUrls.cls) {
      downloads.push(
        this.modelDownloader.downloadModel(modelUrls.cls).then(() => {})
      )
    }
    
    if (this.config.global.use_rec && modelUrls.rec) {
      downloads.push(
        this.modelDownloader.downloadModel(modelUrls.rec).then(() => {})
      )
    }
    
    if (modelUrls.dict && typeof this.modelPaths.rec === 'string' && !this.modelPaths.rec.includes('meta.onnx')) {
      downloads.push(
        this.modelDownloader.downloadModel(modelUrls.dict).then(() => {})
      )
    }
    
    await Promise.all(downloads)
  }
  
  /**
   * Clean up resources
   */
  dispose(): void {
    Object.values(this.workers).forEach(worker => {
      worker?.terminate()
    })
    this.workers = {}
  }
  
  // Private methods
  
  private async initWorker(worker: Worker, message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'RESULT') {
          worker.removeEventListener('message', handler)
          resolve()
        } else if (event.data.type === 'ERROR') {
          worker.removeEventListener('message', handler)
          reject(new Error(event.data.error))
        }
      }
      worker.addEventListener('message', handler)
      worker.postMessage(message)
    })
  }
  
  private async detect(
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): Promise<BoundingBox[]> {
    if (!this.workers.detection) return []
    
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'RESULT') {
          this.workers.detection!.removeEventListener('message', handler)
          resolve(event.data.data.boxes || [])
        } else if (event.data.type === 'ERROR') {
          this.workers.detection!.removeEventListener('message', handler)
          reject(new Error(event.data.error))
        }
      }
      
      this.workers.detection!.addEventListener('message', handler)
      this.workers.detection!.postMessage({
        type: 'DETECT',
        data: { imageData, width, height }
      })
    })
  }
  
  private async classify(
    images: Array<{ data: Uint8ClampedArray; width: number; height: number }>
  ): Promise<Array<{ angle: number; confidence: number; shouldRotate: boolean }>> {
    if (!this.workers.classification) return images.map(() => ({ angle: 0, confidence: 1, shouldRotate: false }))
    
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'RESULT') {
          this.workers.classification!.removeEventListener('message', handler)
          resolve(event.data.data.results || [])
        } else if (event.data.type === 'ERROR') {
          this.workers.classification!.removeEventListener('message', handler)
          reject(new Error(event.data.error))
        } else if (event.data.type === 'PROGRESS') {
          this.reportProgress('classification', event.data.progress)
        }
      }
      
      this.workers.classification!.addEventListener('message', handler)
      this.workers.classification!.postMessage({
        type: 'CLASSIFY',
        data: { images }
      })
    })
  }
  
  private async recognize(
    originalImageData: Uint8ClampedArray,
    originalWidth: number,
    originalHeight: number,
    boxes: BoundingBox[]
  ): Promise<Array<{ text: string; confidence: number }>> {
    if (!this.workers.recognition) return boxes.map(() => ({ text: '', confidence: 0 }))
    
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'RESULT') {
          this.workers.recognition!.removeEventListener('message', handler)
          const results = event.data.data.results || []
          resolve(results.map((r: any) => ({ text: r.text, confidence: r.confidence })))
        } else if (event.data.type === 'ERROR') {
          this.workers.recognition!.removeEventListener('message', handler)
          reject(new Error(event.data.error))
        } else if (event.data.type === 'PROGRESS') {
          this.reportProgress('recognition', event.data.progress)
        }
      }
      
      this.workers.recognition!.addEventListener('message', handler)
      this.workers.recognition!.postMessage({
        type: 'PROCESS',
        data: {
          imageData: originalImageData,
          width: originalWidth,
          height: originalHeight,
          boxes
        }
      })
    })
  }
  
  private cropImage(
    imageData: Uint8ClampedArray,
    width: number,
    _height: number,
    box: BoundingBox
  ): { data: Uint8ClampedArray; width: number; height: number } {
    const minX = Math.min(box.topLeft.x, box.bottomLeft.x)
    const maxX = Math.max(box.topRight.x, box.bottomRight.x)
    const minY = Math.min(box.topLeft.y, box.topRight.y)
    const maxY = Math.max(box.bottomLeft.y, box.bottomRight.y)
    
    const cropWidth = Math.round(maxX - minX)
    const cropHeight = Math.round(maxY - minY)
    
    const cropped = new Uint8ClampedArray(cropWidth * cropHeight * 4)
    
    for (let y = 0; y < cropHeight; y++) {
      for (let x = 0; x < cropWidth; x++) {
        const srcIdx = ((Math.round(minY) + y) * width + Math.round(minX) + x) * 4
        const dstIdx = (y * cropWidth + x) * 4
        
        for (let c = 0; c < 4; c++) {
          cropped[dstIdx + c] = imageData[srcIdx + c]
        }
      }
    }
    
    return { data: cropped, width: cropWidth, height: cropHeight }
  }
  
  private sortResults(results: OCRResult[]): OCRResult[] {
    return results.sort((a, b) => {
      const aY = Math.min(a.box.topLeft.y, a.box.topRight.y)
      const bY = Math.min(b.box.topLeft.y, b.box.topRight.y)
      
      // If Y difference is small, sort by X
      if (Math.abs(aY - bY) < 10) {
        const aX = Math.min(a.box.topLeft.x, a.box.bottomLeft.x)
        const bX = Math.min(b.box.topLeft.x, b.box.bottomLeft.x)
        return aX - bX
      }
      
      return aY - bY
    })
  }
  
  private reportProgress(stage: OCRProgress['stage'], progress: number): void {
    if (this.onProgress) {
      this.onProgress({ stage, progress })
    }
  }
  
  /**
   * Get available languages
   */
  static getAvailableLanguages(): Array<{ code: LangType; name: string }> {
    return Object.entries(LANGUAGE_MODELS).map(([code, model]) => ({
      code: code as LangType,
      name: model.name
    }))
  }
  
  /**
   * Check if a language is supported
   */
  static isLanguageSupported(lang: LangType, version: OCRVersion = 'PP-OCRv4'): boolean {
    const model = LANGUAGE_MODELS[lang]
    return model && model.models.rec[version] !== undefined
  }
}