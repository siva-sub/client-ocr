import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'
import { MetaONNXLoader, type MetaONNXModel } from '../core/meta-onnx-loader'
import type { OCRConfig } from '../core/ocr-config'
import { isPPUModel, decodePPUOutput } from '../core/ppu-model-handler'

let model: MetaONNXModel | null = null
let charDict: string[] = []
let config: OCRConfig['rec'] | null = null
let isUsingPPUModel = false

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        console.log('Initializing recognition model:', data.modelPath)
        
        // Check if this is a PPU model
        isUsingPPUModel = isPPUModel(data.modelPath)
        console.log('Is PPU model:', isUsingPPUModel)
        
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
          if (isUsingPPUModel) {
            console.log('PPU model - blank token at index 0:', charDict[0] === '' ? 'empty string' : `'${charDict[0]}'`)
          }
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
        console.log(`Recognition received image: ${width}x${height}, boxes: ${boxes.length}`)
        
        // Debug: Check if we received valid image data
        let nonZeroCount = 0
        for (let i = 0; i < Math.min(1000, imageData.length); i += 4) {
          if (imageData[i] > 0 || imageData[i+1] > 0 || imageData[i+2] > 0) {
            nonZeroCount++
          }
        }
        console.log(`Image data check: ${nonZeroCount} non-zero pixels in first 1000 pixels`)
        
        const results = []
        
        // Process in batches
        const batchSize = config.rec_batch_num || 6
        for (let i = 0; i < boxes.length; i += batchSize) {
          const batchBoxes = boxes.slice(i, i + batchSize)
          const batchResults = await processBatch(imageData, width, height, batchBoxes)
          // Avoid spread operator for large arrays
          for (const result of batchResults) {
            results.push(result)
          }
          
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
  
  const results: Array<{ box: BoundingBox; text: string; confidence: number }> = []
  
  if (isUsingPPUModel) {
    // PPU models: process each box individually with dynamic width
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const cropped = cropRegion(imageData, width, height, box)
      const tensor = preprocessForRecognition(cropped.data, cropped.width, cropped.height, 0)
      
      // Run inference for single image
      const inputName = model.session.inputNames[0] || 'input'
      const feeds: Record<string, ort.Tensor> = { [inputName]: tensor }
      
      console.log(`Recognition inference input shape (box ${i}):`, tensor.dims)
      const output = await model.session.run(feeds)
      
      const outputKey = Object.keys(output)[0]
      const logits = output[outputKey]
      
      if (i === 0) {
        console.log('Recognition output key:', outputKey)
        console.log('Recognition output shape:', logits.dims)
        console.log('Recognition output type:', logits.type)
        console.log('Recognition output data length:', logits.data.length)
        console.log('First 20 values of output:', Array.from((logits.data as Float32Array).slice(0, 20)))
      }
      
      const result = decodePPUOutput(logits, charDict, 0)
      console.log(`Box ${i}: text="${result.text}", confidence=${result.confidence}`)
      results.push({ 
        box: box, 
        text: result.text, 
        confidence: result.confidence 
      })
    }
  } else {
    // RapidOCR models: batch processing with fixed width
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
    
    console.log('Recognition inference input shape:', batchTensor.dims)
    const output = await model.session.run(feeds)
    
    // Decode results
    const outputKey = Object.keys(output)[0]
    const logits = output[outputKey]
    
    console.log('Recognition output key:', outputKey)
    console.log('Recognition output shape:', logits.dims)
    console.log('Recognition output type:', logits.type)
    console.log('Recognition output data length:', logits.data.length)
    console.log('First 20 values of output:', Array.from((logits.data as Float32Array).slice(0, 20)))
    
    for (let i = 0; i < batchSize; i++) {
      const result = decodeOutput(logits, i)
      console.log(`Batch ${i}: text="${result.text}", confidence=${result.confidence}`)
      results.push({ 
        box: boxes[sortedIndices[i]], 
        text: result.text, 
        confidence: result.confidence 
      })
    }
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
  height: number, 
  box: BoundingBox
): { data: Uint8ClampedArray; width: number; height: number } {
  // Calculate crop dimensions
  const minX = Math.min(box.topLeft.x, box.bottomLeft.x)
  const maxX = Math.max(box.topRight.x, box.bottomRight.x)
  const minY = Math.min(box.topLeft.y, box.topRight.y)
  const maxY = Math.max(box.bottomLeft.y, box.bottomRight.y)
  
  const cropWidth = Math.round(maxX - minX)
  const cropHeight = Math.round(maxY - minY)
  
  // Debug crop dimensions and boundaries
  console.log(`Crop: box coords [${minX},${minY}]-[${maxX},${maxY}] → ${cropWidth}x${cropHeight} from ${width}x${height}`)
  
  // Check pixels at the boundaries
  const sampleY = Math.floor(minY + cropHeight / 2)
  const samplePixels = []
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(minX + i * 5)
    if (x < width) {
      const idx = (sampleY * width + x) * 4
      samplePixels.push(`(${x},${sampleY}): [${imageData[idx]},${imageData[idx+1]},${imageData[idx+2]}]`)
    }
  }
  console.log('Sample pixels from original:', samplePixels.join(', '))
  
  const cropped = new Uint8ClampedArray(cropWidth * cropHeight * 4)
  
  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      const srcX = Math.round(minX) + x
      const srcY = Math.round(minY) + y
      
      // Bounds check
      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4
        const dstIdx = (y * cropWidth + x) * 4
        
        for (let c = 0; c < 4; c++) {
          cropped[dstIdx + c] = imageData[srcIdx + c]
        }
      }
    }
  }
  
  // Debug: Check if crop has content
  let nonZeroPixels = 0
  let avgPixelValue = 0
  for (let i = 0; i < cropped.length; i += 4) {
    if (cropped[i] > 0 || cropped[i+1] > 0 || cropped[i+2] > 0) {
      nonZeroPixels++
      avgPixelValue += (cropped[i] + cropped[i+1] + cropped[i+2]) / 3
    }
  }
  if (nonZeroPixels > 0) {
    avgPixelValue /= nonZeroPixels
  }
  console.log(`Crop stats: ${nonZeroPixels}/${cropWidth * cropHeight} non-zero pixels, avg value: ${avgPixelValue.toFixed(1)}`)
  
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
  const [channels, targetHeight, modelExpectedWidth] = config.rec_img_shape!
  
  // Calculate actual resize width based on aspect ratio
  const scale = targetHeight / height
  let resizeWidth = Math.round(width * scale)
  resizeWidth = Math.max(resizeWidth, 8) // Minimum width
  
  // For PPU models, use dynamic width without padding
  let tensorWidth = resizeWidth
  if (!isUsingPPUModel) {
    // Only RapidOCR models use fixed width with padding
    const dynamicWidth = Math.round(targetHeight * maxWhRatio)
    resizeWidth = Math.min(resizeWidth, dynamicWidth)
    resizeWidth = Math.min(resizeWidth, modelExpectedWidth)
    tensorWidth = modelExpectedWidth
  } else {
    // PPU models: limit maximum width to prevent memory issues
    const maxPPUWidth = 800 // Reasonable max width for PPU models
    if (resizeWidth > maxPPUWidth) {
      console.warn(`PPU model: limiting width from ${resizeWidth} to ${maxPPUWidth}`)
      resizeWidth = maxPPUWidth
      tensorWidth = maxPPUWidth
    }
  }
  
  console.log(`Recognition preprocessing: input ${width}x${height} → resize ${resizeWidth}x${targetHeight} → tensor ${tensorWidth}x${targetHeight}`)
  
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
  
  // Create tensor with appropriate width (dynamic for PPU, fixed for RapidOCR)
  const normalized = new Float32Array(channels * targetHeight * tensorWidth)
  
  // Apply RapidOCR normalization: (pixel/255 - 0.5) / 0.5
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < resizeWidth; x++) {
      const idx = (y * resizeWidth + x) * 4
      const outIdx = y * tensorWidth + x
      
      // Process each channel
      const r = resizedData[idx]
      const g = resizedData[idx + 1]
      const b = resizedData[idx + 2]
      
      if (isUsingPPUModel) {
        // PPU models: Use only red channel as grayscale (matching PPU implementation)
        const grayValue = r
        const normalizedValue = (grayValue / 255.0 - 0.5) / 0.5
        
        // Fill all three channels with the same normalized gray value
        normalized[outIdx] = normalizedValue // R channel
        normalized[targetHeight * tensorWidth + outIdx] = normalizedValue // G channel
        normalized[2 * targetHeight * tensorWidth + outIdx] = normalizedValue // B channel
        
        // Debug: log some pixel values from middle of image
        if (y === Math.floor(targetHeight/2) && x < 10) {
          console.log(`Pixel x=${x}, y=${Math.floor(targetHeight/2)}: RGB=[${r},${g},${b}], redAsGray=${grayValue}, norm=${normalizedValue.toFixed(3)}`)
        }
      } else {
        // RapidOCR normalization
        const rNorm = r / 255.0
        const gNorm = g / 255.0
        const bNorm = b / 255.0
        normalized[outIdx] = (rNorm - 0.5) / 0.5 // R channel
        normalized[targetHeight * tensorWidth + outIdx] = (gNorm - 0.5) / 0.5 // G channel
        normalized[2 * targetHeight * tensorWidth + outIdx] = (bNorm - 0.5) / 0.5 // B channel
      }
    }
  }
  
  // Padding area (only for RapidOCR models)
  if (!isUsingPPUModel && resizeWidth < tensorWidth) {
    // RapidOCR models use padding with normalized black (-1)
    // The Float32Array is already initialized with zeros,
    // which become -1 after normalization, so no explicit padding needed
  }
  
  // Debug: Log some normalized values for PPU models (but avoid large arrays)
  if (isUsingPPUModel && tensorWidth < 500) {
    console.log('PPU normalized values sample:', normalized.slice(0, 10))
    const nonPaddingPixels = normalized.slice(0, Math.min(10000, resizeWidth * targetHeight * channels))
    
    // For small tensors only, show min/max
    if (nonPaddingPixels.length < 10000) {
      console.log('PPU normalized min/max (non-padding):', Math.min(...nonPaddingPixels), Math.max(...nonPaddingPixels))
      
      // Check if we have actual text pixels (should have values close to -1 for black text)
      const blackPixels = nonPaddingPixels.filter(v => v < -0.5).length
      const whitePixels = nonPaddingPixels.filter(v => v > 0.5).length
      console.log(`PPU pixel distribution: ${blackPixels} black pixels, ${whitePixels} white pixels out of ${nonPaddingPixels.length} total`)
    } else {
      console.log(`PPU large tensor: ${nonPaddingPixels.length} pixels, skipping detailed analysis`)
    }
    
    // Sample some values from different rows - check every 8 rows
    for (let row = 0; row < Math.min(targetHeight, 48); row += 8) {
      const rowStart = row * tensorWidth
      const rowSample = Array.from(normalized.slice(rowStart, rowStart + Math.min(10, tensorWidth)))
      const blackCount = rowSample.filter(v => v < -0.5).length
      const avgValue = rowSample.reduce((a, b) => a + b, 0) / rowSample.length
      console.log(`PPU Row ${row}: ${blackCount} black pixels, avg=${avgValue.toFixed(2)}, sample:`, rowSample.slice(0, 10).map(v => v.toFixed(2)).join(', '))
    }
  } else if (isUsingPPUModel && tensorWidth >= 500) {
    console.log(`PPU large tensor: ${tensorWidth}x${targetHeight}, skipping debug output to prevent stack overflow`)
  }
  
  return new ort.Tensor('float32', normalized, [1, channels, targetHeight, tensorWidth])
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