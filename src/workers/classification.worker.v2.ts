import * as ort from 'onnxruntime-web'
import type { WorkerMessage } from '../types/ocr.types'
import { MetaONNXLoader, type MetaONNXModel } from '../core/meta-onnx-loader'
import type { OCRConfig } from '../core/ocr-config'

let model: MetaONNXModel | null = null
let config: OCRConfig['cls'] | null = null

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        console.log('Initializing classification model:', data.modelPath)
        
        // Load model
        model = await MetaONNXLoader.loadModel(data.modelPath)
        
        console.log('Classification model initialized successfully')
        console.log('Input names:', model.session.inputNames)
        console.log('Output names:', model.session.outputNames)
        
        // Load configuration
        config = data.config?.cls || {
          engine_type: 'onnxruntime',
          lang_type: 'en',
          model_type: 'mobile',
          ocr_version: 'PP-OCRv4',
          cls_image_shape: [3, 48, 192],
          cls_batch_num: 6,
          cls_thresh: 0.9,
          label_list: ['0', '180']
        }
        
        self.postMessage({ type: 'RESULT', data: { initialized: true } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
      
    case 'CLASSIFY':
      if (!model || !config) {
        self.postMessage({ type: 'ERROR', error: 'Model not initialized' })
        return
      }
      
      try {
        const { images } = data
        const results = []
        
        // Process in batches
        const batchSize = config.cls_batch_num || 6
        for (let i = 0; i < images.length; i += batchSize) {
          const batchImages = images.slice(i, i + batchSize)
          const batchResults = await classifyBatch(batchImages)
          results.push(...batchResults)
          
          // Send progress update
          self.postMessage({ 
            type: 'PROGRESS', 
            progress: Math.min((i + batchSize) / images.length, 1)
          })
        }
        
        self.postMessage({ type: 'RESULT', data: { results } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

interface ClassifyResult {
  angle: 0 | 180
  confidence: number
  shouldRotate: boolean
}

async function classifyBatch(images: Array<{ data: Uint8ClampedArray; width: number; height: number }>): Promise<ClassifyResult[]> {
  if (!model || !config) throw new Error('Model not initialized')
  
  // Prepare batch
  const batchTensors: ort.Tensor[] = []
  for (const img of images) {
    const tensor = preprocessForClassification(img.data, img.width, img.height)
    batchTensors.push(tensor)
  }
  
  // Concatenate batch
  const batchData = new Float32Array(batchTensors.length * batchTensors[0].data.length)
  batchTensors.forEach((tensor, i) => {
    batchData.set(tensor.data as Float32Array, i * tensor.data.length)
  })
  
  const [batchSize, channels, h, w] = [batchTensors.length, ...config.cls_image_shape]
  const batchTensor = new ort.Tensor('float32', batchData, [batchSize, channels, h, w])
  
  // Run inference
  const inputName = model.session.inputNames[0] || 'input'
  const feeds: Record<string, ort.Tensor> = { [inputName]: batchTensor }
  const output = await model.session.run(feeds)
  
  // Decode results
  const results: ClassifyResult[] = []
  const logits = output[Object.keys(output)[0]]
  const logitsData = logits.data as Float32Array
  
  for (let i = 0; i < batchSize; i++) {
    const result = decodeClassification(logitsData, i)
    results.push(result)
  }
  
  return results
}

function preprocessForClassification(
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number
): ort.Tensor {
  if (!config) throw new Error('Config not initialized')
  
  const [channels, targetHeight, targetWidth] = config.cls_image_shape
  
  // Create canvas for resizing
  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')!
  
  // Create ImageData from input
  const inputImageData = new ImageData(
    new Uint8ClampedArray(imageData),
    width,
    height
  )
  
  // Create temporary canvas with original image
  const tempCanvas = new OffscreenCanvas(width, height)
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(inputImageData, 0, 0)
  
  // Resize to target dimensions
  ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, targetWidth, targetHeight)
  
  // Get resized image data
  const resizedData = ctx.getImageData(0, 0, targetWidth, targetHeight).data
  
  // Normalize (same as recognition)
  const normalized = new Float32Array(channels * targetHeight * targetWidth)
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4
      const pixelIdx = y * targetWidth + x
      
      // Process each channel separately (RGB)
      const r = resizedData[idx] / 255.0
      const g = resizedData[idx + 1] / 255.0
      const b = resizedData[idx + 2] / 255.0
      
      // Apply normalization: (value - 0.5) / 0.5
      normalized[pixelIdx] = (r - 0.5) / 0.5 // R channel
      normalized[targetHeight * targetWidth + pixelIdx] = (g - 0.5) / 0.5 // G channel
      normalized[2 * targetHeight * targetWidth + pixelIdx] = (b - 0.5) / 0.5 // B channel
    }
  }
  
  return new ort.Tensor('float32', normalized, [1, channels, targetHeight, targetWidth])
}

function decodeClassification(data: Float32Array, batchIndex: number): ClassifyResult {
  if (!config) throw new Error('Config not initialized')
  
  // Assume output shape is [batch_size, num_classes]
  const numClasses = config.label_list.length
  const startIdx = batchIndex * numClasses
  
  // Get probabilities for this batch
  const probs = data.slice(startIdx, startIdx + numClasses)
  
  // Apply softmax
  const maxLogit = Math.max(...probs)
  const expProbs = probs.map(p => Math.exp(p - maxLogit))
  const sumExp = expProbs.reduce((a, b) => a + b, 0)
  const softmaxProbs = expProbs.map(p => p / sumExp)
  
  // Find max probability class
  let maxIdx = 0
  let maxProb = softmaxProbs[0]
  for (let i = 1; i < softmaxProbs.length; i++) {
    if (softmaxProbs[i] > maxProb) {
      maxProb = softmaxProbs[i]
      maxIdx = i
    }
  }
  
  // Map to angle
  const angle = config.label_list[maxIdx] === '180' ? 180 : 0
  const shouldRotate = angle === 180 && maxProb >= config.cls_thresh
  
  return {
    angle,
    confidence: maxProb,
    shouldRotate
  }
}

// Helper function to rotate image 180 degrees
export function rotateImage180(imageData: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  const rotated = new Uint8ClampedArray(imageData.length)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4
      const dstIdx = ((height - 1 - y) * width + (width - 1 - x)) * 4
      
      for (let c = 0; c < 4; c++) {
        rotated[dstIdx + c] = imageData[srcIdx + c]
      }
    }
  }
  
  return rotated
}