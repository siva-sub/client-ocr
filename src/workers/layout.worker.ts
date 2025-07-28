// Document layout analysis worker
import * as ort from 'onnxruntime-web'
import { LAYOUT_MODELS, type LayoutDetectionConfig, type LayoutDetectionResult } from '../core/layout-models'

interface LayoutWorkerMessage {
  type: 'init' | 'detect'
  config?: LayoutDetectionConfig
  imageData?: ImageData
}

let model: ort.InferenceSession | null = null
let config: LayoutDetectionConfig | null = null
let modelInfo: typeof LAYOUT_MODELS[keyof typeof LAYOUT_MODELS] | null = null

// Initialize ONNX Runtime
ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': '/ort-wasm.wasm',
  'ort-wasm-simd.wasm': '/ort-wasm-simd.wasm',
  'ort-wasm-threaded.wasm': '/ort-wasm-threaded.wasm',
  'ort-wasm-simd-threaded.wasm': '/ort-wasm-simd-threaded.wasm'
}

self.onmessage = async (event: MessageEvent<LayoutWorkerMessage>) => {
  const { type } = event.data

  try {
    switch (type) {
      case 'init':
        await initializeModel(event.data.config!)
        break
      case 'detect':
        const result = await detectLayout(event.data.imageData!)
        self.postMessage({ type: 'result', result })
        break
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

async function initializeModel(cfg: LayoutDetectionConfig) {
  config = cfg
  
  modelInfo = LAYOUT_MODELS[cfg.model]
  if (!modelInfo) {
    throw new Error(`Unknown layout model: ${cfg.model}`)
  }

  console.log(`Initializing layout model: ${modelInfo.description}`)

  // Create session options
  const options: ort.InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all'
  }

  // Load model
  try {
    model = await ort.InferenceSession.create(modelInfo.url, options)
    console.log('Layout model loaded successfully')
    console.log('Input names:', model.inputNames)
    console.log('Output names:', model.outputNames)
    
    self.postMessage({ type: 'initialized' })
  } catch (error) {
    console.error('Failed to load layout model:', error)
    throw error
  }
}

async function detectLayout(imageData: ImageData): Promise<LayoutDetectionResult> {
  if (!model || !config || !modelInfo) {
    throw new Error('Model not initialized')
  }

  const startTime = performance.now()
  
  // Preprocess image based on model type
  const inputTensor = preprocessImage(imageData)
  
  // Run inference
  const feeds = { [model.inputNames[0]]: inputTensor }
  const results = await model.run(feeds)
  
  // Postprocess results based on model type
  const detections = postprocessResults(results, imageData.width, imageData.height)
  
  const elapse = performance.now() - startTime
  
  return {
    ...detections,
    elapse
  }
}

function preprocessImage(imageData: ImageData): ort.Tensor {
  if (!modelInfo) throw new Error('Model info not available')
  
  const { width, height, data } = imageData
  const inputSize = modelInfo.inputSize
  
  // Create canvas for resizing with letterbox
  const canvas = new OffscreenCanvas(inputSize, inputSize)
  const ctx = canvas.getContext('2d')!
  
  // Calculate scale to fit within inputSize while maintaining aspect ratio
  const scale = Math.min(inputSize / width, inputSize / height)
  const newWidth = Math.round(width * scale)
  const newHeight = Math.round(height * scale)
  
  // Fill with gray background (letterbox padding)
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, inputSize, inputSize)
  
  // Draw resized image (centered)
  const tempCanvas = new OffscreenCanvas(width, height)
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(new ImageData(data, width, height), 0, 0)
  
  const offsetX = Math.floor((inputSize - newWidth) / 2)
  const offsetY = Math.floor((inputSize - newHeight) / 2)
  ctx.drawImage(tempCanvas, 0, 0, width, height, offsetX, offsetY, newWidth, newHeight)
  
  // Get resized image data
  const resizedImageData = ctx.getImageData(0, 0, inputSize, inputSize)
  
  // Convert to normalized float array based on model type
  let normalized: Float32Array
  
  if (modelInfo.type === 'pp') {
    // PP models use ImageNet normalization
    normalized = preprocessPPLayout(resizedImageData, inputSize)
  } else {
    // YOLO models use simple 0-1 normalization
    normalized = preprocessYOLOLayout(resizedImageData, inputSize)
  }
  
  return new ort.Tensor('float32', normalized, [1, 3, inputSize, inputSize])
}

function preprocessPPLayout(imageData: ImageData, size: number): Float32Array {
  const normalized = new Float32Array(3 * size * size)
  const mean = [0.485, 0.456, 0.406]
  const std = [0.229, 0.224, 0.225]
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const pixelIdx = y * size + x
      
      normalized[pixelIdx] = (imageData.data[idx] / 255.0 - mean[0]) / std[0]
      normalized[size * size + pixelIdx] = (imageData.data[idx + 1] / 255.0 - mean[1]) / std[1]
      normalized[2 * size * size + pixelIdx] = (imageData.data[idx + 2] / 255.0 - mean[2]) / std[2]
    }
  }
  
  return normalized
}

function preprocessYOLOLayout(imageData: ImageData, size: number): Float32Array {
  const normalized = new Float32Array(3 * size * size)
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const pixelIdx = y * size + x
      
      // Simple 0-1 normalization for YOLO
      normalized[pixelIdx] = imageData.data[idx] / 255.0
      normalized[size * size + pixelIdx] = imageData.data[idx + 1] / 255.0
      normalized[2 * size * size + pixelIdx] = imageData.data[idx + 2] / 255.0
    }
  }
  
  return normalized
}

function postprocessResults(
  outputs: ort.InferenceSession.OnnxValueMapType,
  origWidth: number,
  origHeight: number
): { boxes: number[][], classNames: string[], scores: number[] } {
  if (!config || !modelInfo) throw new Error('Config/Model info not initialized')
  
  let boxes: number[][] = []
  let classNames: string[] = []
  let scores: number[] = []
  
  if (modelInfo.type === 'pp') {
    ({ boxes, classNames, scores } = postprocessPPLayout(outputs, origWidth, origHeight))
  } else {
    ({ boxes, classNames, scores } = postprocessYOLOLayout(outputs, origWidth, origHeight))
  }
  
  // Apply NMS (Non-Maximum Suppression)
  const { boxes: nmsBoxes, classNames: nmsClasses, scores: nmsScores } = 
    applyNMS(boxes, classNames, scores, config.iouThresh)
  
  return { boxes: nmsBoxes, classNames: nmsClasses, scores: nmsScores }
}

function postprocessPPLayout(
  outputs: ort.InferenceSession.OnnxValueMapType,
  origWidth: number,
  origHeight: number
): { boxes: number[][], classNames: string[], scores: number[] } {
  if (!modelInfo || !config) throw new Error('Model info/config not initialized')
  
  // PP models output format: [num_boxes, 6] where each row is [label, score, x1, y1, x2, y2]
  const output = outputs[model!.outputNames[0]].data as Float32Array
  const shape = outputs[model!.outputNames[0]].dims as number[]
  
  const boxes: number[][] = []
  const classNames: string[] = []
  const scores: number[] = []
  
  const numBoxes = shape[0]
  const inputSize = modelInfo.inputSize
  
  for (let i = 0; i < numBoxes; i++) {
    const label = Math.round(output[i * 6])
    const score = output[i * 6 + 1]
    
    if (score < config.confThresh) continue
    
    const x1 = output[i * 6 + 2] * origWidth / inputSize
    const y1 = output[i * 6 + 3] * origHeight / inputSize
    const x2 = output[i * 6 + 4] * origWidth / inputSize
    const y2 = output[i * 6 + 5] * origHeight / inputSize
    
    boxes.push([x1, y1, x2, y2])
    classNames.push(modelInfo.classes[label] || 'unknown')
    scores.push(score)
  }
  
  return { boxes, classNames, scores }
}

function postprocessYOLOLayout(
  outputs: ort.InferenceSession.OnnxValueMapType,
  origWidth: number,
  origHeight: number
): { boxes: number[][], classNames: string[], scores: number[] } {
  if (!modelInfo || !config) throw new Error('Model info/config not initialized')
  
  // YOLO models output format varies, but typically:
  // - Output shape: [1, num_classes + 4, num_predictions]
  // - Each prediction: [x_center, y_center, width, height, class_scores...]
  
  const output = outputs[model!.outputNames[0]].data as Float32Array
  const shape = outputs[model!.outputNames[0]].dims as number[]
  
  const boxes: number[][] = []
  const classNames: string[] = []
  const scores: number[] = []
  
  const numClasses = modelInfo.classes.length
  const numPredictions = shape[2]
  const inputSize = modelInfo.inputSize
  
  for (let i = 0; i < numPredictions; i++) {
    // Get class scores
    let maxScore = 0
    let maxClassIdx = 0
    
    for (let c = 0; c < numClasses; c++) {
      const score = output[(4 + c) * numPredictions + i]
      if (score > maxScore) {
        maxScore = score
        maxClassIdx = c
      }
    }
    
    if (maxScore < config.confThresh) continue
    
    // Get box coordinates (convert from center format to corner format)
    const xCenter = output[0 * numPredictions + i] * origWidth / inputSize
    const yCenter = output[1 * numPredictions + i] * origHeight / inputSize
    const width = output[2 * numPredictions + i] * origWidth / inputSize
    const height = output[3 * numPredictions + i] * origHeight / inputSize
    
    const x1 = xCenter - width / 2
    const y1 = yCenter - height / 2
    const x2 = xCenter + width / 2
    const y2 = yCenter + height / 2
    
    boxes.push([x1, y1, x2, y2])
    classNames.push(modelInfo.classes[maxClassIdx])
    scores.push(maxScore)
  }
  
  return { boxes, classNames, scores }
}

function applyNMS(
  boxes: number[][],
  classNames: string[],
  scores: number[],
  iouThresh: number
): { boxes: number[][], classNames: string[], scores: number[] } {
  // Group by class
  const classBuckets: Map<string, { boxes: number[][], scores: number[], indices: number[] }> = new Map()
  
  for (let i = 0; i < boxes.length; i++) {
    const className = classNames[i]
    if (!classBuckets.has(className)) {
      classBuckets.set(className, { boxes: [], scores: [], indices: [] })
    }
    const bucket = classBuckets.get(className)!
    bucket.boxes.push(boxes[i])
    bucket.scores.push(scores[i])
    bucket.indices.push(i)
  }
  
  const keepIndices: number[] = []
  
  // Apply NMS per class
  for (const [_, bucket] of classBuckets) {
    const kept = nmsPerClass(bucket.boxes, bucket.scores, iouThresh)
    for (const idx of kept) {
      keepIndices.push(bucket.indices[idx])
    }
  }
  
  // Sort by original order
  keepIndices.sort((a, b) => a - b)
  
  // Extract kept detections
  const nmsBoxes = keepIndices.map(i => boxes[i])
  const nmsClasses = keepIndices.map(i => classNames[i])
  const nmsScores = keepIndices.map(i => scores[i])
  
  return { boxes: nmsBoxes, classNames: nmsClasses, scores: nmsScores }
}

function nmsPerClass(boxes: number[][], scores: number[], iouThresh: number): number[] {
  // Sort by score (descending)
  const indices = Array.from({ length: scores.length }, (_, i) => i)
  indices.sort((a, b) => scores[b] - scores[a])
  
  const keep: number[] = []
  const suppressed = new Set<number>()
  
  for (const i of indices) {
    if (suppressed.has(i)) continue
    
    keep.push(i)
    
    // Suppress all boxes with high IoU
    for (let j = i + 1; j < indices.length; j++) {
      const idx = indices[j]
      if (suppressed.has(idx)) continue
      
      const iou = calculateIoU(boxes[i], boxes[idx])
      if (iou > iouThresh) {
        suppressed.add(idx)
      }
    }
  }
  
  return keep
}

function calculateIoU(box1: number[], box2: number[]): number {
  const [x1a, y1a, x2a, y2a] = box1
  const [x1b, y1b, x2b, y2b] = box2
  
  const xA = Math.max(x1a, x1b)
  const yA = Math.max(y1a, y1b)
  const xB = Math.min(x2a, x2b)
  const yB = Math.min(y2a, y2b)
  
  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA)
  const box1Area = (x2a - x1a) * (y2a - y1a)
  const box2Area = (x2b - x1b) * (y2b - y1b)
  
  const iou = interArea / (box1Area + box2Area - interArea)
  return iou
}

export {}