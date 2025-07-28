import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'
import { MetaONNXLoader, type MetaONNXModel } from '../core/meta-onnx-loader'
import type { OCRConfig } from '../core/ocr-config'

let model: MetaONNXModel | null = null
let charDict: string[] = []
let config: OCRConfig['rec'] | null = null

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        console.log('Initializing recognition model:', data.modelPath)
        
        // Load model with meta ONNX support
        model = await MetaONNXLoader.loadModel(data.modelPath)
        
        console.log('Recognition model initialized successfully')
        console.log('Input names:', model.session.inputNames)
        console.log('Output names:', model.session.outputNames)
        console.log('Has embedded dictionary:', MetaONNXLoader.hasEmbeddedDictionary(model))
        
        // Load configuration if provided
        config = data.config?.rec || {
          engine_type: 'onnxruntime',
          lang_type: 'en',
          model_type: 'mobile',
          ocr_version: 'PP-OCRv4',
          rec_img_shape: [3, 48, 320],
          rec_batch_num: 6
        }
        
        // Get dictionary from model or external file
        charDict = await MetaONNXLoader.getDictionary(model, data.dictPath)
        
        console.log(`Loaded dictionary: ${charDict.length} chars`)
        if (charDict.length > 0) {
          console.log('First 10 chars:', charDict.slice(0, 10))
        }
        
        self.postMessage({ type: 'RESULT', data: { initialized: true } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
      
    case 'PROCESS':
      if (!model || !config) {
        self.postMessage({ type: 'ERROR', error: 'Model not initialized' })
        return
      }
      
      try {
        const { imageData, width, height, boxes } = data
        const results = []
        
        // Process in batches
        const batchSize = config.rec_batch_num || 6
        for (let i = 0; i < boxes.length; i += batchSize) {
          const batchBoxes = boxes.slice(i, i + batchSize)
          const batchResults = await processBatch(imageData, width, height, batchBoxes)
          results.push(...batchResults)
          
          // Send progress update
          self.postMessage({ 
            type: 'PROGRESS', 
            progress: Math.min((i + batchSize) / boxes.length, 1)
          })
        }
        
        self.postMessage({ type: 'RESULT', data: { results } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

async function processBatch(
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number, 
  boxes: BoundingBox[]
): Promise<Array<{ box: BoundingBox; text: string; confidence: number }>> {
  if (!model || !config) throw new Error('Model not initialized')
  
  // Sort by aspect ratio for better batching
  const sortedIndices = sortByAspectRatio(boxes)
  const sortedBoxes = sortedIndices.map(i => boxes[i])
  
  // Calculate max width ratio for this batch
  const maxWhRatio = calculateMaxWhRatio(sortedBoxes, config.rec_img_shape!)
  
  // Prepare batch
  const batchTensors: ort.Tensor[] = []
  for (const box of sortedBoxes) {
    const cropped = cropRegion(imageData, width, height, box)
    const tensor = preprocessForRecognition(cropped.data, cropped.width, cropped.height, maxWhRatio)
    batchTensors.push(tensor)
  }
  
  // Concatenate batch
  const batchData = new Float32Array(batchTensors.length * batchTensors[0].data.length)
  batchTensors.forEach((tensor, i) => {
    batchData.set(tensor.data as Float32Array, i * tensor.data.length)
  })
  
  const [batchSize, channels, h, w] = [batchTensors.length, ...config.rec_img_shape!]
  const batchTensor = new ort.Tensor('float32', batchData, [batchSize, channels, h, w])
  
  // Run inference
  const inputName = model.session.inputNames[0] || 'input'
  const feeds: Record<string, ort.Tensor> = { [inputName]: batchTensor }
  const output = await model.session.run(feeds)
  
  // Decode results
  const results: Array<{ box: BoundingBox; text: string; confidence: number }> = []
  const logits = output[Object.keys(output)[0]]
  
  for (let i = 0; i < batchSize; i++) {
    const { text, confidence } = decodeOutput(logits, i)
    results.push({ 
      box: boxes[sortedIndices[i]], 
      text, 
      confidence 
    })
  }
  
  return results
}

function sortByAspectRatio(boxes: BoundingBox[]): number[] {
  const ratios = boxes.map((box, i) => {
    const width = Math.max(
      Math.abs(box.topRight.x - box.topLeft.x),
      Math.abs(box.bottomRight.x - box.bottomLeft.x)
    )
    const height = Math.max(
      Math.abs(box.bottomLeft.y - box.topLeft.y),
      Math.abs(box.bottomRight.y - box.topRight.y)
    )
    return { index: i, ratio: width / height }
  })
  
  ratios.sort((a, b) => a.ratio - b.ratio)
  return ratios.map(r => r.index)
}

function calculateMaxWhRatio(boxes: BoundingBox[], recImgShape: [number, number, number]): number {
  const [_, imgH, imgW] = recImgShape
  let maxRatio = imgW / imgH
  
  for (const box of boxes) {
    const width = Math.max(
      Math.abs(box.topRight.x - box.topLeft.x),
      Math.abs(box.bottomRight.x - box.bottomLeft.x)
    )
    const height = Math.max(
      Math.abs(box.bottomLeft.y - box.topLeft.y),
      Math.abs(box.bottomRight.y - box.topRight.y)
    )
    const ratio = width / height
    maxRatio = Math.max(maxRatio, ratio)
  }
  
  return maxRatio
}

function cropRegion(
  imageData: Uint8ClampedArray, 
  width: number, 
  _height: number, 
  box: BoundingBox
): { data: Uint8ClampedArray; width: number; height: number } {
  // Calculate crop dimensions
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

function preprocessForRecognition(
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number,
  maxWhRatio: number
): ort.Tensor {
  if (!config) throw new Error('Config not initialized')
  
  // Get target dimensions
  const [channels, targetHeight, _imgWidth] = config.rec_img_shape!
  
  // Calculate dynamic width based on max aspect ratio (RapidOCR approach)
  const targetWidth = Math.round(targetHeight * maxWhRatio)
  
  // Calculate actual resize width
  const scale = targetHeight / height
  let resizeWidth = Math.round(width * scale)
  resizeWidth = Math.min(resizeWidth, targetWidth)
  resizeWidth = Math.max(resizeWidth, 8) // Minimum width
  
  console.log(`Recognition preprocessing: input ${width}x${height} → resize ${resizeWidth}x${targetHeight} → target ${targetWidth}x${targetHeight}`)
  
  // Create canvas for resizing
  const canvas = new OffscreenCanvas(resizeWidth, targetHeight)
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
  ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, resizeWidth, targetHeight)
  
  // Get resized image data
  const resizedData = ctx.getImageData(0, 0, resizeWidth, targetHeight).data
  
  // Create padded tensor with dynamic width
  const normalized = new Float32Array(channels * targetHeight * targetWidth)
  
  // Apply RapidOCR normalization: (pixel/255 - 0.5) / 0.5
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < resizeWidth; x++) {
      const idx = (y * resizeWidth + x) * 4
      const outIdx = y * targetWidth + x
      
      // Process each channel separately (RGB)
      const r = resizedData[idx] / 255.0
      const g = resizedData[idx + 1] / 255.0
      const b = resizedData[idx + 2] / 255.0
      
      // Apply normalization: (value - 0.5) / 0.5
      normalized[outIdx] = (r - 0.5) / 0.5 // R channel
      normalized[targetHeight * targetWidth + outIdx] = (g - 0.5) / 0.5 // G channel
      normalized[2 * targetHeight * targetWidth + outIdx] = (b - 0.5) / 0.5 // B channel
    }
  }
  
  // Padding area remains 0 (which is -1 after normalization)
  
  return new ort.Tensor('float32', normalized, [1, channels, targetHeight, targetWidth])
}

function decodeOutput(output: ort.Tensor, batchIndex: number): { text: string; confidence: number } {
  const data = output.data as Float32Array
  const shape = output.dims as number[]
  
  // Extract single batch
  let seqLen: number
  let vocabSize: number
  let batchData: Float32Array
  
  if (shape.length === 3) {
    const [_batchSize, ...rest] = shape
    if (rest[1] > rest[0]) {
      // [batch, seq_len, vocab_size]
      seqLen = rest[0]
      vocabSize = rest[1]
      const startIdx = batchIndex * seqLen * vocabSize
      batchData = data.slice(startIdx, startIdx + seqLen * vocabSize)
    } else {
      // [batch, vocab_size, seq_len]
      vocabSize = rest[0]
      seqLen = rest[1]
      // Need to transpose
      batchData = new Float32Array(seqLen * vocabSize)
      for (let t = 0; t < seqLen; t++) {
        for (let c = 0; c < vocabSize; c++) {
          batchData[t * vocabSize + c] = data[batchIndex * vocabSize * seqLen + c * seqLen + t]
        }
      }
    }
  } else {
    console.error('Unexpected output shape:', shape)
    return { text: '', confidence: 0 }
  }
  
  // CTC decoding
  const decoded: number[] = []
  const confidences: number[] = []
  let prevIdx = -1
  
  for (let t = 0; t < seqLen; t++) {
    let maxIdx = 0
    let maxProb = -Infinity
    
    // Find the character with highest probability
    for (let c = 0; c < vocabSize; c++) {
      const prob = batchData[t * vocabSize + c]
      if (prob > maxProb) {
        maxProb = prob
        maxIdx = c
      }
    }
    
    // CTC decoding rules
    if (maxIdx !== 0 && maxIdx !== prevIdx) {
      decoded.push(maxIdx)
      confidences.push(maxProb)
    }
    
    prevIdx = maxIdx
  }
  
  // Convert to text
  let text = ''
  for (const idx of decoded) {
    if (idx < charDict.length) {
      text += charDict[idx]
    }
  }
  
  const avgConfidence = confidences.length > 0 
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
    : 0
  
  return { text: text.trim(), confidence: avgConfidence }
}