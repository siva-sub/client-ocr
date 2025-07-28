// Table structure detection worker
import * as ort from 'onnxruntime-web'
import { TABLE_MODELS, TABLE_STRUCTURE_TOKENS, type TableDetectionConfig } from '../core/table-models'

interface TableWorkerMessage {
  type: 'init' | 'detect'
  config?: TableDetectionConfig
  imageData?: ImageData
}

interface TableDetectionResult {
  predHtml: string
  cellBboxes: number[][]
  logicPoints: number[][]
  elapse: number
}

let model: ort.InferenceSession | null = null
let config: TableDetectionConfig | null = null
let charList: string[] = []

// Initialize ONNX Runtime
ort.env.wasm.wasmPaths = '/'

self.onmessage = async (event: MessageEvent<TableWorkerMessage>) => {
  const { type } = event.data

  try {
    switch (type) {
      case 'init':
        await initializeModel(event.data.config!)
        break
      case 'detect':
        const result = await detectTable(event.data.imageData!)
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

async function initializeModel(cfg: TableDetectionConfig) {
  config = cfg
  
  const modelInfo = TABLE_MODELS[cfg.model]
  if (!modelInfo) {
    throw new Error(`Unknown table model: ${cfg.model}`)
  }

  console.log(`Initializing table model: ${modelInfo.description}`)

  // Create session options
  const options: ort.InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all'
  }

  // Load model
  try {
    model = await ort.InferenceSession.create(modelInfo.url, options)
    console.log('Table model loaded successfully')
    console.log('Input names:', model.inputNames)
    console.log('Output names:', model.outputNames)
    
    // Use default structure tokens
    charList = TABLE_STRUCTURE_TOKENS
    
    self.postMessage({ type: 'initialized' })
  } catch (error) {
    console.error('Failed to load table model:', error)
    throw error
  }
}

async function detectTable(imageData: ImageData): Promise<TableDetectionResult> {
  if (!model || !config) {
    throw new Error('Model not initialized')
  }

  const startTime = performance.now()
  
  // Preprocess image
  const { resizedData, scale } = preprocessImage(imageData)
  
  // Create input tensor
  const inputTensor = new ort.Tensor('float32', resizedData, [1, 3, config.maxLen, config.maxLen])
  
  // Run inference
  const feeds = { [model.inputNames[0]]: inputTensor }
  const results = await model.run(feeds)
  
  // Postprocess results
  const output = postprocessResults(results, scale, imageData.width, imageData.height)
  
  const elapse = performance.now() - startTime
  
  return {
    ...output,
    elapse
  }
}

function preprocessImage(imageData: ImageData): { resizedData: Float32Array, scale: number } {
  if (!config) throw new Error('Config not initialized')
  
  const { width, height, data } = imageData
  const maxLen = config.maxLen
  
  // Calculate scale to fit within maxLen while maintaining aspect ratio
  const scale = Math.min(maxLen / width, maxLen / height)
  const newWidth = Math.round(width * scale)
  const newHeight = Math.round(height * scale)
  
  // Create canvas for resizing
  const canvas = new OffscreenCanvas(maxLen, maxLen)
  const ctx = canvas.getContext('2d')!
  
  // Fill with white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, maxLen, maxLen)
  
  // Draw resized image (centered)
  const tempCanvas = new OffscreenCanvas(width, height)
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(new ImageData(data, width, height), 0, 0)
  
  const offsetX = Math.floor((maxLen - newWidth) / 2)
  const offsetY = Math.floor((maxLen - newHeight) / 2)
  ctx.drawImage(tempCanvas, 0, 0, width, height, offsetX, offsetY, newWidth, newHeight)
  
  // Get resized image data
  const resizedImageData = ctx.getImageData(0, 0, maxLen, maxLen)
  
  // Convert to normalized float array in CHW format
  const normalized = new Float32Array(3 * maxLen * maxLen)
  const mean = [0.485, 0.456, 0.406] // ImageNet normalization
  const std = [0.229, 0.224, 0.225]
  
  for (let y = 0; y < maxLen; y++) {
    for (let x = 0; x < maxLen; x++) {
      const idx = (y * maxLen + x) * 4
      const pixelIdx = y * maxLen + x
      
      // Normalize and arrange in CHW format
      normalized[pixelIdx] = (resizedImageData.data[idx] / 255.0 - mean[0]) / std[0] // R
      normalized[maxLen * maxLen + pixelIdx] = (resizedImageData.data[idx + 1] / 255.0 - mean[1]) / std[1] // G
      normalized[2 * maxLen * maxLen + pixelIdx] = (resizedImageData.data[idx + 2] / 255.0 - mean[2]) / std[2] // B
    }
  }
  
  return { resizedData: normalized, scale }
}

function postprocessResults(
  outputs: ort.InferenceSession.OnnxValueMapType,
  scale: number,
  origWidth: number,
  origHeight: number
): { predHtml: string, cellBboxes: number[][], logicPoints: number[][] } {
  if (!config) throw new Error('Config not initialized')
  
  // Get output tensors
  const structureProbs = outputs[model!.outputNames[0]].data as Float32Array
  const cellBboxes = outputs[model!.outputNames[1]].data as Float32Array
  
  // Decode structure tokens
  const structureTokens = decodeStructureTokens(structureProbs)
  
  // Extract and scale bounding boxes
  const bboxes = extractBoundingBoxes(cellBboxes, scale, origWidth, origHeight)
  
  // Build HTML table structure
  const predHtml = buildTableHtml(structureTokens, bboxes)
  
  // Extract logical points (row/col positions)
  const logicPoints = extractLogicPoints(bboxes)
  
  return { predHtml, cellBboxes: bboxes, logicPoints }
}

function decodeStructureTokens(probs: Float32Array): string[] {
  const tokens: string[] = []
  const vocabSize = charList.length
  const seqLen = probs.length / vocabSize
  
  for (let i = 0; i < seqLen; i++) {
    let maxProb = -Infinity
    let maxIdx = 0
    
    for (let j = 0; j < vocabSize; j++) {
      const prob = probs[i * vocabSize + j]
      if (prob > maxProb) {
        maxProb = prob
        maxIdx = j
      }
    }
    
    if (maxIdx > 0 && maxIdx < charList.length) { // Skip padding token
      tokens.push(charList[maxIdx])
    }
  }
  
  return tokens
}

function extractBoundingBoxes(
  bboxData: Float32Array,
  scale: number,
  origWidth: number,
  origHeight: number
): number[][] {
  if (!config) throw new Error('Config not initialized')
  
  const bboxes: number[][] = []
  const numBoxes = bboxData.length / 4
  
  for (let i = 0; i < numBoxes; i++) {
    const x1 = bboxData[i * 4] / scale
    const y1 = bboxData[i * 4 + 1] / scale
    const x2 = bboxData[i * 4 + 2] / scale
    const y2 = bboxData[i * 4 + 3] / scale
    
    // Filter out invalid boxes
    const area = (x2 - x1) * (y2 - y1)
    if (area > config.minAreaThresh && x2 > x1 && y2 > y1) {
      // Clamp to image boundaries
      bboxes.push([
        Math.max(0, Math.min(x1, origWidth)),
        Math.max(0, Math.min(y1, origHeight)),
        Math.max(0, Math.min(x2, origWidth)),
        Math.max(0, Math.min(y2, origHeight))
      ])
    }
  }
  
  return bboxes
}

function buildTableHtml(tokens: string[], bboxes: number[][]): string {
  // Simple HTML table construction from structure tokens
  let html = '<table>'
  let bboxIdx = 0
  
  for (const token of tokens) {
    if (token.includes('colspan=') || token.includes('rowspan=')) {
      // Extract span value
      const match = token.match(/(\w+)=(\d+)/)
      if (match) {
        html += ` ${match[1]}="${match[2]}"`
      }
    } else {
      html += token
    }
    
    // Associate bounding boxes with cells
    if (token === '<td>' || token === '<th>') {
      if (bboxIdx < bboxes.length) {
        // Cell content would be filled by matching OCR results
        bboxIdx++
      }
    }
  }
  
  html += '</table>'
  return html
}

function extractLogicPoints(bboxes: number[][]): number[][] {
  // Extract logical row/column positions from bounding boxes
  const points: number[][] = []
  
  // Sort boxes by y-coordinate (top to bottom) then x-coordinate (left to right)
  const sortedBoxes = [...bboxes].sort((a, b) => {
    const yDiff = a[1] - b[1]
    if (Math.abs(yDiff) > 10) return yDiff
    return a[0] - b[0]
  })
  
  let currentRow = 0
  let lastY = -1
  
  for (const box of sortedBoxes) {
    const [x1, y1] = box
    
    // Check if this is a new row
    if (lastY === -1 || Math.abs(y1 - lastY) > 10) {
      currentRow++
      lastY = y1
    }
    
    // Find column position
    let col = 1
    for (const otherBox of sortedBoxes) {
      if (otherBox[1] === y1 && otherBox[0] < x1) {
        col++
      }
    }
    
    points.push([currentRow, col])
  }
  
  return points
}

export {}