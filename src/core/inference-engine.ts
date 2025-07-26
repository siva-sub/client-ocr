import { ModelLoader } from './model-loader'
import { FallbackSystem } from './fallback-system'
import type { OCRResult, ProcessingOptions, TextRegion, WorkerMessage, BoundingBox } from '../types/ocr.types'

export class InferenceEngine {
  private modelLoader: ModelLoader
  private fallbackSystem: FallbackSystem
  private detectionWorker: Worker | null = null
  private recognitionWorker: Worker | null = null
  private classificationWorker: Worker | null = null
  private deskewWorker: Worker | null = null
  
  constructor() {
    this.modelLoader = new ModelLoader()
    this.fallbackSystem = new FallbackSystem()
  }
  
  async initialize(modelPaths: { detection: string; recognition: string; classification: string; dictionary?: string }, _modelId?: string): Promise<void> {
    // Initialize workers
    this.detectionWorker = new Worker(
      new URL('../workers/detection.worker.ts', import.meta.url),
      { type: 'module' }
    )
    
    this.recognitionWorker = new Worker(
      new URL('../workers/recognition.worker.ts', import.meta.url),
      { type: 'module' }
    )
    
    this.classificationWorker = new Worker(
      new URL('../workers/classification.worker.ts', import.meta.url),
      { type: 'module' }
    )
    
    this.deskewWorker = new Worker(
      new URL('../workers/deskew.worker.ts', import.meta.url),
      { type: 'module' }
    )
    
    // Initialize models in workers
    await Promise.all([
      this.sendToWorker(this.detectionWorker, { type: 'INIT', data: { modelPath: modelPaths.detection } }),
      this.sendToWorker(this.recognitionWorker, { 
        type: 'INIT', 
        data: { 
          modelPath: modelPaths.recognition,
          dictPath: modelPaths.dictionary || '/models/en_dict.txt'
        } 
      }),
      this.sendToWorker(this.classificationWorker, { type: 'INIT', data: { modelPath: modelPaths.classification } })
    ])
    
    // Initialize fallback system
    await this.fallbackSystem.initialize()
  }
  
  async processImage(
    image: HTMLImageElement | HTMLCanvasElement | File,
    options: ProcessingOptions = {}
  ): Promise<OCRResult> {
    const { enableDeskew = true, enableFallback = true } = options
    
    try {
      // Convert image to canvas if needed
      const canvas = await this.imageToCanvas(image)
      const ctx = canvas.getContext('2d')!
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Apply deskew if enabled
      let deskewAngle = 0
      if (enableDeskew) {
        // Clone the buffer to avoid detached ArrayBuffer issues
        const clonedBuffer = imageData.data.buffer.slice(0)
        const deskewResult = await this.sendToWorker(this.deskewWorker!, {
          type: 'PROCESS',
          data: {
            imageData: clonedBuffer,
            width: imageData.width,
            height: imageData.height
          }
        }, [clonedBuffer])
        
        if (deskewResult.angle) {
          deskewAngle = deskewResult.angle
          imageData = new ImageData(
            new Uint8ClampedArray(deskewResult.imageData),
            deskewResult.width,
            deskewResult.height
          )
        }
      }
      
      // Run detection
      const detectionResult = await this.sendToWorker(this.detectionWorker!, {
        type: 'PROCESS',
        data: {
          imageData: imageData.data,
          width: imageData.width,
          height: imageData.height
        }
      })
      
      if (!detectionResult.boxes || detectionResult.boxes.length === 0) {
        throw new Error('No text regions detected')
      }
      
      // Sort boxes by reading order (top to bottom, left to right)
      const sortedBoxes = this.sortBoxesByReadingOrder(detectionResult.boxes)
      
      // Crop regions for classification and recognition
      const croppedRegions = sortedBoxes.map((box: BoundingBox) => 
        this.cropRegion(imageData, box)
      )
      
      // Run classification to detect text orientation
      const classificationResult = await this.sendToWorker(this.classificationWorker!, {
        type: 'PROCESS',
        data: { regions: croppedRegions }
      })
      
      // Rotate regions that need it
      croppedRegions.forEach((region: any, index: number) => {
        const clsResult = classificationResult.results[index]
        if (clsResult.needsRotation) {
          // Note: rotation is handled in recognition worker
          region.needsRotation = true
        }
      })
      
      // Run recognition with properly oriented text
      const recognitionResult = await this.sendToWorker(this.recognitionWorker!, {
        type: 'PROCESS',
        data: {
          imageData: imageData.data,
          width: imageData.width,
          height: imageData.height,
          boxes: sortedBoxes
        }
      })
      
      // Compile results
      const regions: TextRegion[] = recognitionResult.results
      const fullText = regions.map(r => r.text).join(' ')
      
      return {
        regions,
        fullText,
        processingTime: performance.now(),
        method: 'onnx',
        metadata: {
          imageWidth: imageData.width,
          imageHeight: imageData.height,
          deskewAngle
        }
      }
    } catch (error) {
      console.error('ONNX processing failed:', error)
      
      if (enableFallback) {
        console.log('Falling back to Tesseract.js')
        return await this.fallbackSystem.performOCR(image)
      }
      
      throw error
    }
  }
  
  private async imageToCanvas(image: HTMLImageElement | HTMLCanvasElement | File): Promise<HTMLCanvasElement> {
    if (image instanceof HTMLCanvasElement) {
      return image
    }
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    if (image instanceof HTMLImageElement) {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
    } else if (image instanceof File) {
      const img = new Image()
      const url = URL.createObjectURL(image)
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          URL.revokeObjectURL(url)
          resolve()
        }
        img.onerror = reject
        img.src = url
      })
    }
    
    return canvas
  }
  
  private sendToWorker(
    worker: Worker, 
    message: WorkerMessage,
    transfer?: Transferable[]
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent<WorkerMessage>) => {
        if (event.data.type === 'RESULT') {
          worker.removeEventListener('message', handler)
          resolve(event.data.data)
        } else if (event.data.type === 'ERROR') {
          worker.removeEventListener('message', handler)
          reject(new Error(event.data.error))
        }
      }
      
      worker.addEventListener('message', handler)
      
      if (transfer) {
        worker.postMessage(message, transfer)
      } else {
        worker.postMessage(message)
      }
    })
  }
  
  private cropRegion(imageData: ImageData, box: BoundingBox): any {
    // Use perspective transform for accurate text extraction
    const { width, height } = imageData
    
    // Calculate the width and height of the crop
    const cropWidth = Math.max(
      Math.sqrt(Math.pow(box.topRight.x - box.topLeft.x, 2) + Math.pow(box.topRight.y - box.topLeft.y, 2)),
      Math.sqrt(Math.pow(box.bottomRight.x - box.bottomLeft.x, 2) + Math.pow(box.bottomRight.y - box.bottomLeft.y, 2))
    )
    const cropHeight = Math.max(
      Math.sqrt(Math.pow(box.bottomLeft.x - box.topLeft.x, 2) + Math.pow(box.bottomLeft.y - box.topLeft.y, 2)),
      Math.sqrt(Math.pow(box.bottomRight.x - box.topRight.x, 2) + Math.pow(box.bottomRight.y - box.topRight.y, 2))
    )
    
    // Round dimensions
    const finalWidth = Math.round(cropWidth)
    const finalHeight = Math.round(cropHeight)
    
    // Check if text is wider than tall (aspect ratio > 1.5)
    // If so, we might need to rotate it 90 degrees
    const aspectRatio = finalWidth / finalHeight
    const needsRotation = aspectRatio > 1.5
    
    // Create canvas for perspective transform
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    if (needsRotation) {
      canvas.width = finalHeight
      canvas.height = finalWidth
    } else {
      canvas.width = finalWidth
      canvas.height = finalHeight
    }
    
    // Put original image on a temporary canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.putImageData(imageData, 0, 0)
    
    // Save context state
    ctx.save()
    
    if (needsRotation) {
      // Rotate 90 degrees clockwise
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(Math.PI / 2)
      ctx.translate(-canvas.height / 2, -canvas.width / 2)
    }
    
    // Source points are used implicitly in the drawImage calculation below
    
    // Define destination points (rectangle)
    let dstPoints: number[]
    if (needsRotation) {
      dstPoints = [0, 0, finalHeight, 0, finalHeight, finalWidth, 0, finalWidth]
    } else {
      dstPoints = [0, 0, finalWidth, 0, finalWidth, finalHeight, 0, finalHeight]
    }
    
    // Simple bilinear interpolation for perspective transform
    // For a more accurate transform, we'd need to implement full perspective math
    // For now, we'll use a simplified approach
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw transformed image using path clipping
    ctx.beginPath()
    ctx.moveTo(dstPoints[0], dstPoints[1])
    ctx.lineTo(dstPoints[2], dstPoints[3])
    ctx.lineTo(dstPoints[4], dstPoints[5])
    ctx.lineTo(dstPoints[6], dstPoints[7])
    ctx.closePath()
    ctx.clip()
    
    // Calculate transform matrix (simplified)
    const minX = Math.min(box.topLeft.x, box.topRight.x, box.bottomRight.x, box.bottomLeft.x)
    const maxX = Math.max(box.topLeft.x, box.topRight.x, box.bottomRight.x, box.bottomLeft.x)
    const minY = Math.min(box.topLeft.y, box.topRight.y, box.bottomRight.y, box.bottomLeft.y)
    const maxY = Math.max(box.topLeft.y, box.topRight.y, box.bottomRight.y, box.bottomLeft.y)
    
    // Draw the cropped region
    ctx.drawImage(
      tempCanvas,
      minX, minY, maxX - minX, maxY - minY,
      0, 0, needsRotation ? finalHeight : finalWidth, needsRotation ? finalWidth : finalHeight
    )
    
    // Restore context
    ctx.restore()
    
    // Get the transformed image data
    const croppedData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    return {
      imageData: croppedData.data,
      width: canvas.width,
      height: canvas.height,
      box,
      rotated: needsRotation
    }
  }
  
  
  private sortBoxesByReadingOrder(boxes: BoundingBox[]): BoundingBox[] {
    // Sort boxes by reading order: top to bottom, then left to right
    return boxes.sort((a, b) => {
      // Calculate center points
      const centerA = {
        x: (a.topLeft.x + a.topRight.x + a.bottomLeft.x + a.bottomRight.x) / 4,
        y: (a.topLeft.y + a.topRight.y + a.bottomLeft.y + a.bottomRight.y) / 4
      }
      const centerB = {
        x: (b.topLeft.x + b.topRight.x + b.bottomLeft.x + b.bottomRight.x) / 4,
        y: (b.topLeft.y + b.topRight.y + b.bottomLeft.y + b.bottomRight.y) / 4
      }
      
      // Calculate heights for overlap detection
      const heightA = Math.max(
        Math.abs(a.bottomLeft.y - a.topLeft.y),
        Math.abs(a.bottomRight.y - a.topRight.y)
      )
      const heightB = Math.max(
        Math.abs(b.bottomLeft.y - b.topLeft.y),
        Math.abs(b.bottomRight.y - b.topRight.y)
      )
      
      // Check if boxes are on the same line (vertical overlap)
      const minTopA = Math.min(a.topLeft.y, a.topRight.y)
      const maxBottomA = Math.max(a.bottomLeft.y, a.bottomRight.y)
      const minTopB = Math.min(b.topLeft.y, b.topRight.y)
      const maxBottomB = Math.max(b.bottomLeft.y, b.bottomRight.y)
      
      // Calculate vertical overlap
      const overlapStart = Math.max(minTopA, minTopB)
      const overlapEnd = Math.min(maxBottomA, maxBottomB)
      const overlapHeight = Math.max(0, overlapEnd - overlapStart)
      
      // If boxes have significant vertical overlap (more than 50% of smaller height)
      const minHeight = Math.min(heightA, heightB)
      const isOnSameLine = overlapHeight > minHeight * 0.5
      
      if (isOnSameLine) {
        // Same line: sort by x coordinate (left to right)
        return centerA.x - centerB.x
      } else {
        // Different lines: sort by y coordinate (top to bottom)
        return centerA.y - centerB.y
      }
    })
  }
  
  async terminate(): Promise<void> {
    // Terminate workers
    this.detectionWorker?.terminate()
    this.recognitionWorker?.terminate()
    this.classificationWorker?.terminate()
    this.deskewWorker?.terminate()
    
    // Terminate fallback system
    await this.fallbackSystem.terminate()
    
    // Clear model cache
    this.modelLoader.clearCache()
  }
}