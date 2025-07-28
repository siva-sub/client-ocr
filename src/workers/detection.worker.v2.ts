import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'
import { MetaONNXLoader, type MetaONNXModel } from '../core/meta-onnx-loader'
import type { OCRConfig } from '../core/ocr-config'

let model: MetaONNXModel | null = null
let config: OCRConfig['det'] | null = null

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        console.log('Initializing detection model:', data.modelPath)
        
        // Load model
        model = await MetaONNXLoader.loadModel(data.modelPath)
        
        console.log('Detection model initialized successfully')
        console.log('Input names:', model.session.inputNames)
        console.log('Output names:', model.session.outputNames)
        
        // Load configuration
        config = data.config?.det || {
          engine_type: 'onnxruntime',
          lang_type: 'en',
          model_type: 'mobile',
          ocr_version: 'PP-OCRv4',
          limit_side_len: 736,
          limit_type: 'min',
          std: [0.229, 0.224, 0.225],
          mean: [0.485, 0.456, 0.406],
          scale: 0.00392156862745098,
          thresh: 0.3,
          box_thresh: 0.5,
          max_candidates: 1000,
          unclip_ratio: 1.6,
          use_dilation: true,
          score_mode: 'fast'
        }
        
        self.postMessage({ type: 'RESULT', data: { initialized: true } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
      
    case 'DETECT':
      if (!model || !config) {
        self.postMessage({ type: 'ERROR', error: 'Model not initialized' })
        return
      }
      
      try {
        const { imageData, width, height } = data
        
        // Resize image according to config
        const { resizedData, resizedWidth, resizedHeight, ratioH, ratioW } = resizeForDetection(
          imageData, 
          width, 
          height
        )
        
        // Preprocess
        const inputTensor = preprocessForDetection(resizedData, resizedWidth, resizedHeight)
        
        // Run inference
        const inputName = model.session.inputNames[0] || 'input'
        const feeds: Record<string, ort.Tensor> = { [inputName]: inputTensor }
        const output = await model.session.run(feeds)
        
        // Post-process
        const boxes = postprocessDetection(output, resizedWidth, resizedHeight, ratioH, ratioW)
        
        console.log(`Detection found ${boxes.length} text boxes`)
        if (boxes.length > 0) {
          console.log('First box:', boxes[0])
        }
        
        self.postMessage({ type: 'RESULT', data: { boxes } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

function resizeForDetection(
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number
): {
  resizedData: Uint8ClampedArray
  resizedWidth: number
  resizedHeight: number
  ratioH: number
  ratioW: number
} {
  if (!config) throw new Error('Config not initialized')
  
  const limitSideLen = config.limit_side_len
  const limitType = config.limit_type
  
  let ratio = 1.0
  
  if (limitType === 'max') {
    if (Math.max(height, width) > limitSideLen) {
      ratio = height > width 
        ? limitSideLen / height 
        : limitSideLen / width
    }
  } else {
    if (Math.min(height, width) < limitSideLen) {
      ratio = height < width 
        ? limitSideLen / height 
        : limitSideLen / width
    }
  }
  
  let resizeH = Math.round(height * ratio)
  let resizeW = Math.round(width * ratio)
  
  // Make dimensions divisible by 32 (required by detection model)
  resizeH = Math.round(resizeH / 32) * 32
  resizeW = Math.round(resizeW / 32) * 32
  
  // Ensure minimum size
  resizeH = Math.max(resizeH, 32)
  resizeW = Math.max(resizeW, 32)
  
  console.log(`Detection resize: ${width}x${height} → ${resizeW}x${resizeH} (ratio: ${ratio.toFixed(3)})`)
  
  // Create canvas for resizing
  const canvas = new OffscreenCanvas(resizeW, resizeH)
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
  
  // Resize
  ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, resizeW, resizeH)
  
  // Get resized data
  const resizedImageData = ctx.getImageData(0, 0, resizeW, resizeH)
  
  return {
    resizedData: resizedImageData.data,
    resizedWidth: resizeW,
    resizedHeight: resizeH,
    ratioH: resizeH / height,
    ratioW: resizeW / width
  }
}

function preprocessForDetection(
  imageData: Uint8ClampedArray, 
  width: number, 
  height: number
): ort.Tensor {
  if (!config) throw new Error('Config not initialized')
  
  const channels = 3
  const normalized = new Float32Array(channels * height * width)
  
  // Apply simple normalization for detection model
  // RapidOCR/PaddleOCR uses: (img / 255.0 - 0.5) / 0.5 = img / 127.5 - 1.0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const pixelIdx = y * width + x
      
      // Normalize to [-1, 1] range
      normalized[pixelIdx] = imageData[idx] / 127.5 - 1.0  // R
      normalized[height * width + pixelIdx] = imageData[idx + 1] / 127.5 - 1.0  // G
      normalized[2 * height * width + pixelIdx] = imageData[idx + 2] / 127.5 - 1.0  // B
    }
  }
  
  return new ort.Tensor('float32', normalized, [1, channels, height, width])
}

function postprocessDetection(
  output: ort.InferenceSession.OnnxValueMapType,
  resizedWidth: number,
  resizedHeight: number,
  ratioH: number,
  ratioW: number
): BoundingBox[] {
  if (!config) throw new Error('Config not initialized')
  
  // Get output tensor
  const outputName = Object.keys(output)[0]
  const outputTensor = output[outputName]
  const outputData = outputTensor.data as Float32Array
  const shape = outputTensor.dims as number[]
  
  console.log('Detection output shape:', shape)
  console.log('Detection raw output sample:', outputData.slice(0, 10))
  
  // Apply threshold and find contours
  const [_, _channels, h, w] = shape
  const bitmap = new Uint8Array(h * w)
  
  // Create binary map
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      const prob = outputData[idx]
      bitmap[idx] = prob > config.thresh ? 255 : 0
    }
  }
  
  // Apply dilation if enabled
  if (config.use_dilation) {
    dilate(bitmap, w, h)
  }
  
  // Find contours and create boxes
  const boxes = findTextBoxes(bitmap, w, h, resizedWidth, resizedHeight)
  
  // Convert back to original coordinates
  return boxes.map(box => ({
    topLeft: {
      x: Math.round(box.topLeft.x / ratioW),
      y: Math.round(box.topLeft.y / ratioH)
    },
    topRight: {
      x: Math.round(box.topRight.x / ratioW),
      y: Math.round(box.topRight.y / ratioH)
    },
    bottomRight: {
      x: Math.round(box.bottomRight.x / ratioW),
      y: Math.round(box.bottomRight.y / ratioH)
    },
    bottomLeft: {
      x: Math.round(box.bottomLeft.x / ratioW),
      y: Math.round(box.bottomLeft.y / ratioH)
    }
  }))
}

function dilate(bitmap: Uint8Array, width: number, height: number): void {
  // Simple 3x3 dilation
  const temp = new Uint8Array(bitmap)
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      
      // Check if any neighbor is white
      let hasWhite = false
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = (y + dy) * width + (x + dx)
          if (temp[nIdx] === 255) {
            hasWhite = true
            break
          }
        }
        if (hasWhite) break
      }
      
      bitmap[idx] = hasWhite ? 255 : 0
    }
  }
}

function findTextBoxes(
  bitmap: Uint8Array, 
  bitmapWidth: number, 
  bitmapHeight: number,
  targetWidth: number,
  targetHeight: number
): BoundingBox[] {
  if (!config) throw new Error('Config not initialized')
  
  // Simple connected component analysis
  const visited = new Uint8Array(bitmap.length)
  const boxes: BoundingBox[] = []
  let componentsFound = 0
  let componentsAboveMinSize = 0
  
  for (let y = 0; y < bitmapHeight; y++) {
    for (let x = 0; x < bitmapWidth; x++) {
      const idx = y * bitmapWidth + x
      
      if (bitmap[idx] === 255 && !visited[idx]) {
        // Find connected component
        const component = findConnectedComponent(bitmap, visited, x, y, bitmapWidth, bitmapHeight)
        componentsFound++
        
        if (component.pixels > 10) { // Minimum size threshold
          componentsAboveMinSize++
          // Calculate bounding box
          const scaleX = targetWidth / bitmapWidth
          const scaleY = targetHeight / bitmapHeight
          
          // Expand box using unclip ratio
          const expandX = (component.maxX - component.minX) * (config.unclip_ratio - 1) / 2
          const expandY = (component.maxY - component.minY) * (config.unclip_ratio - 1) / 2
          
          const box: BoundingBox = {
            topLeft: {
              x: Math.max(0, (component.minX - expandX) * scaleX),
              y: Math.max(0, (component.minY - expandY) * scaleY)
            },
            topRight: {
              x: Math.min(targetWidth, (component.maxX + expandX) * scaleX),
              y: Math.max(0, (component.minY - expandY) * scaleY)
            },
            bottomRight: {
              x: Math.min(targetWidth, (component.maxX + expandX) * scaleX),
              y: Math.min(targetHeight, (component.maxY + expandY) * scaleY)
            },
            bottomLeft: {
              x: Math.max(0, (component.minX - expandX) * scaleX),
              y: Math.min(targetHeight, (component.maxY + expandY) * scaleY)
            }
          }
          
          // Check box score
          const score = calculateBoxScore(bitmap, component, bitmapWidth)
          if (score > config.box_thresh) {
            boxes.push(box)
          }
        }
      }
    }
  }
  
  console.log(`Connected components: found=${componentsFound}, aboveMinSize=${componentsAboveMinSize}, finalBoxes=${boxes.length}`)
  
  return boxes
}

interface Component {
  minX: number
  maxX: number
  minY: number
  maxY: number
  pixels: number
}

function findConnectedComponent(
  bitmap: Uint8Array,
  visited: Uint8Array,
  startX: number,
  startY: number,
  width: number,
  height: number
): Component {
  const component: Component = {
    minX: startX,
    maxX: startX,
    minY: startY,
    maxY: startY,
    pixels: 0
  }
  
  const stack: Array<[number, number]> = [[startX, startY]]
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!
    const idx = y * width + x
    
    if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || bitmap[idx] !== 255) {
      continue
    }
    
    visited[idx] = 1
    component.pixels++
    component.minX = Math.min(component.minX, x)
    component.maxX = Math.max(component.maxX, x)
    component.minY = Math.min(component.minY, y)
    component.maxY = Math.max(component.maxY, y)
    
    // Add neighbors
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  
  return component
}

function calculateBoxScore(bitmap: Uint8Array, component: Component, width: number): number {
  let sum = 0
  let count = 0
  
  for (let y = component.minY; y <= component.maxY; y++) {
    for (let x = component.minX; x <= component.maxX; x++) {
      sum += bitmap[y * width + x] / 255
      count++
    }
  }
  
  return count > 0 ? sum / count : 0
}