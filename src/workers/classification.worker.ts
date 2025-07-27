import * as ort from 'onnxruntime-web'
import type { WorkerMessage } from '../types/ocr.types'

let session: ort.InferenceSession | null = null

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        // Try WebGL first for better performance, fall back to WASM
        const executionProviders = ['webgl', 'wasm']
        console.log('Initializing classification model:', data.modelPath)
        
        session = await ort.InferenceSession.create(data.modelPath, {
          executionProviders,
          graphOptimizationLevel: 'all'
        })
        
        console.log('Classification model initialized successfully')
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
        const { regions } = data
        const results = []
        
        for (let i = 0; i < regions.length; i++) {
          const region = regions[i]
          
          // Preprocess image for classification
          const inputTensor = preprocessForClassification(region.imageData, region.width, region.height)
          
          // Run inference - dynamically use the input name from the model
          const inputName = session.inputNames[0] || 'input'
          const feeds: Record<string, ort.Tensor> = {}
          feeds[inputName] = inputTensor
          const output = await session.run(feeds)
          
          // Get classification result
          const { label, confidence } = postprocessClassification(output)
          
          results.push({
            index: i,
            label,
            confidence,
            needsRotation: label === '180' && confidence > 0.9
          })
        }
        
        self.postMessage({ type: 'RESULT', data: { results } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

function preprocessForClassification(
  imageData: Uint8ClampedArray,
  width: number,
  height: number
): ort.Tensor {
  // CLS model expects shape [3, 48, 192]
  const targetHeight = 48
  const targetWidth = 192
  
  // Calculate resize dimensions maintaining aspect ratio
  const aspectRatio = width / height
  let resizeWidth: number
  let resizeHeight: number
  
  if (Math.ceil(targetHeight * aspectRatio) > targetWidth) {
    resizeWidth = targetWidth
    resizeHeight = Math.round(targetWidth / aspectRatio)
  } else {
    resizeWidth = Math.round(targetHeight * aspectRatio)
    resizeHeight = targetHeight
  }
  
  // Create canvas for resizing
  const resizeCanvas = new OffscreenCanvas(resizeWidth, resizeHeight)
  const resizeCtx = resizeCanvas.getContext('2d')!
  
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
  
  // Resize to intermediate dimensions
  resizeCtx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, resizeWidth, resizeHeight)
  
  // Create final canvas with padding
  const finalCanvas = new OffscreenCanvas(targetWidth, targetHeight)
  const finalCtx = finalCanvas.getContext('2d')!
  
  // Fill with gray background (padding)
  finalCtx.fillStyle = 'rgb(127, 127, 127)'
  finalCtx.fillRect(0, 0, targetWidth, targetHeight)
  
  // Calculate padding to center the image
  const padLeft = Math.floor((targetWidth - resizeWidth) / 2)
  const padTop = Math.floor((targetHeight - resizeHeight) / 2)
  
  // Draw resized image centered
  finalCtx.drawImage(resizeCanvas, padLeft, padTop)
  
  // Get final image data
  const finalData = finalCtx.getImageData(0, 0, targetWidth, targetHeight).data
  
  // Normalize for classification model
  // Classification uses same normalization as recognition: (pixel / 255.0 - 0.5) / 0.5
  const normalized = new Float32Array(3 * targetHeight * targetWidth)
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4
      const pixelIdx = y * targetWidth + x
      
      // Normalize each channel
      normalized[pixelIdx] = (finalData[idx] / 255.0 - 0.5) / 0.5 // R
      normalized[targetHeight * targetWidth + pixelIdx] = (finalData[idx + 1] / 255.0 - 0.5) / 0.5 // G
      normalized[2 * targetHeight * targetWidth + pixelIdx] = (finalData[idx + 2] / 255.0 - 0.5) / 0.5 // B
    }
  }
  
  return new ort.Tensor('float32', normalized, [1, 3, targetHeight, targetWidth])
}

function postprocessClassification(output: ort.InferenceSession.OnnxValueMapType): { label: string; confidence: number } {
  // PaddleOCR CLS model outputs 'softmax_0.tmp_0' or 'save_infer_model/scale_0.tmp_1'
  const logits = output['softmax_0.tmp_0'] || output['save_infer_model/scale_0.tmp_1'] || 
                 output.output || output.logits || Object.values(output)[0]
  
  if (!logits) return { label: '0', confidence: 0 }
  
  const data = logits.data as Float32Array
  
  // CLS model outputs probabilities for [0°, 180°] degree orientations
  // data[0] = probability of 0° (normal orientation)
  // data[1] = probability of 180° (upside down)
  const prob0 = data[0]
  const prob180 = data[1]
  
  if (prob180 > prob0) {
    return { label: '180', confidence: prob180 }
  } else {
    return { label: '0', confidence: prob0 }
  }
}