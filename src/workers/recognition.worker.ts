import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'

let session: ort.InferenceSession | null = null
let charDict: string[] = []

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        // Try WebGL first for better performance, fall back to WASM
        const executionProviders = ['webgl', 'wasm']
        console.log('Initializing recognition model:', data.modelPath)
        
        session = await ort.InferenceSession.create(data.modelPath, {
          executionProviders,
          graphOptimizationLevel: 'all'
        })
        
        console.log('Recognition model initialized successfully')
        console.log('Input names:', session.inputNames)
        console.log('Output names:', session.outputNames)
        
        // Load character dictionary from file if provided
        if (data.dictPath) {
          try {
            const response = await fetch(data.dictPath)
            const text = await response.text()
            // PaddleOCR dictionary format:
            // Line 1: blank token (empty line)
            // Line 2+: actual characters
            const lines = text.split('\n').filter(line => line !== undefined)
            
            // Ensure we have the blank token at index 0
            if (lines.length > 0 && lines[0] === '') {
              // Dictionary already has blank token, use as-is
              charDict = lines
            } else {
              // Add blank token if missing
              charDict = ['', ...lines.filter(line => line.trim() !== '')]
            }
            
            console.log(`Loaded dictionary with ${charDict.length} characters (including blank)`)
          } catch (error) {
            console.warn('Failed to load dictionary, using default:', error)
            charDict = generateDefaultCharDict()
          }
        } else {
          charDict = data.charDict || generateDefaultCharDict()
        }
        
        self.postMessage({ type: 'RESULT', data: { initialized: true } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
      
    case 'PROCESS':
      if (!session) {
        self.postMessage({ type: 'ERROR', error: 'Model not initialized' })
        return
      }
      
      try {
        const { imageData, width, height, boxes } = data
        const results = []
        
        for (const box of boxes) {
          // Crop image region
          const cropped = cropRegion(imageData, width, height, box)
          
          // Preprocess for recognition
          const inputTensor = preprocessForRecognition(cropped.data, cropped.width, cropped.height)
          
          // Run inference - dynamically use the input name from the model
          const inputName = session.inputNames[0] || 'input'
          const feeds: Record<string, ort.Tensor> = {}
          feeds[inputName] = inputTensor
          const output = await session.run(feeds)
          
          // Decode text
          const { text, confidence } = decodeOutput(output)
          
          results.push({ box, text, confidence })
          
          // Send progress update
          self.postMessage({ 
            type: 'PROGRESS', 
            progress: results.length / boxes.length 
          })
        }
        
        self.postMessage({ type: 'RESULT', data: { results } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

function generateDefaultCharDict(): string[] {
  const chars = ['<blank>']
  
  // Add numbers
  for (let i = 0; i <= 9; i++) {
    chars.push(i.toString())
  }
  
  // Add uppercase letters
  for (let i = 65; i <= 90; i++) {
    chars.push(String.fromCharCode(i))
  }
  
  // Add lowercase letters
  for (let i = 97; i <= 122; i++) {
    chars.push(String.fromCharCode(i))
  }
  
  // Add common punctuation
  chars.push(...['.', ',', '!', '?', '-', "'", '"', ' '])
  
  return chars
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
  height: number
): ort.Tensor {
  // Standard recognition input height
  const targetHeight = 48
  const scale = targetHeight / height
  
  // Calculate target width while maintaining aspect ratio
  let targetWidth = Math.round(width * scale)
  
  // Ensure width is at least 4 pixels and divisible by 4 for some models
  targetWidth = Math.max(targetWidth, 4)
  targetWidth = Math.ceil(targetWidth / 4) * 4
  
  // Maximum width constraint (optional, depends on model)
  const maxWidth = 320
  if (targetWidth > maxWidth) {
    targetWidth = maxWidth
  }
  
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
  
  // Normalize for recognition model (different from detection!)
  // Recognition uses: (pixel_value / 255.0 - 0.5) / 0.5
  const normalized = new Float32Array(3 * targetHeight * targetWidth)
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4
      const pixelIdx = y * targetWidth + x
      
      // Normalize each channel
      normalized[pixelIdx] = (resizedData[idx] / 255.0 - 0.5) / 0.5 // R
      normalized[targetHeight * targetWidth + pixelIdx] = (resizedData[idx + 1] / 255.0 - 0.5) / 0.5 // G
      normalized[2 * targetHeight * targetWidth + pixelIdx] = (resizedData[idx + 2] / 255.0 - 0.5) / 0.5 // B
    }
  }
  
  return new ort.Tensor('float32', normalized, [1, 3, targetHeight, targetWidth])
}

function decodeOutput(output: ort.InferenceSession.OnnxValueMapType): { text: string; confidence: number } {
  // Get the output tensor - use the first output
  const outputName = Object.keys(output)[0]
  console.log('Recognition output name:', outputName)
  
  const logits = output[outputName]
  
  if (!logits) {
    console.error('No logits found in output. Available outputs:', Object.keys(output))
    return { text: '', confidence: 0 }
  }
  
  const data = logits.data as Float32Array
  const shape = logits.dims as number[]
  
  // Shape should be [batch_size, seq_len, vocab_size] or [batch_size, vocab_size, seq_len]
  let seqLen: number
  let vocabSize: number
  let isTransposed = false
  
  if (shape.length === 3) {
    if (shape[2] > shape[1]) {
      // [batch, seq_len, vocab_size] - standard format
      seqLen = shape[1]
      vocabSize = shape[2]
    } else {
      // [batch, vocab_size, seq_len] - transposed format
      seqLen = shape[2]
      vocabSize = shape[1]
      isTransposed = true
    }
  } else {
    console.error('Unexpected output shape:', shape)
    return { text: '', confidence: 0 }
  }
  
  // CTC decoding with duplicate removal
  const decoded: number[] = []
  const confidences: number[] = []
  let prevIdx = -1
  
  for (let t = 0; t < seqLen; t++) {
    let maxIdx = 0
    let maxProb = -Infinity
    
    // Find the character with highest probability at this time step
    for (let c = 0; c < vocabSize; c++) {
      const idx = isTransposed ? c * seqLen + t : t * vocabSize + c
      const prob = data[idx]
      
      if (prob > maxProb) {
        maxProb = prob
        maxIdx = c
      }
    }
    
    // CTC decoding rules:
    // 1. Skip blank token (index 0)
    // 2. Skip if same as previous token (duplicate removal)
    if (maxIdx !== 0 && maxIdx !== prevIdx) {
      decoded.push(maxIdx)
      confidences.push(maxProb)
    }
    
    prevIdx = maxIdx
  }
  
  // Convert indices to characters
  let text = ''
  let totalConfidence = 0
  
  for (let i = 0; i < decoded.length; i++) {
    const charIdx = decoded[i]
    // Direct index lookup - the dictionary already includes blank at position 0
    if (charIdx >= 0 && charIdx < charDict.length) {
      text += charDict[charIdx]
      // Use softmax probability directly (no need to exp if already softmax)
      totalConfidence += confidences[i]
    }
  }
  
  const avgConfidence = decoded.length > 0 ? totalConfidence / decoded.length : 0
  
  // Post-process to add spaces for better readability
  // This is a simple heuristic for English text
  const processedText = addSpacesIfNeeded(text.trim())
  
  return { text: processedText, confidence: avgConfidence }
}

// Add spaces between words based on common patterns
function addSpacesIfNeeded(text: string): string {
  // If text already has spaces, return as-is
  if (text.includes(' ')) {
    return text
  }
  
  // For text without spaces, try to intelligently add them
  // This is a simple heuristic that works for many cases
  let result = text
  
  // Add space before uppercase letters that follow lowercase letters
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2')
  
  // Add space between letters and numbers
  result = result.replace(/([a-zA-Z])(\d)/g, '$1 $2')
  result = result.replace(/(\d)([a-zA-Z])/g, '$1 $2')
  
  // Common abbreviations that should stay together
  const abbreviations = ['OCR', 'PDF', 'URL', 'API', 'HTML', 'CSS', 'XML', 'JSON']
  for (const abbr of abbreviations) {
    const spaced = abbr.split('').join(' ')
    result = result.replace(new RegExp(spaced, 'g'), abbr)
  }
  
  return result
}