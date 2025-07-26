import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'

let session: ort.InferenceSession | null = null

// DB postprocessing parameters
const DB_THRESH = 0.3
const DB_BOX_THRESH = 0.6
const DB_UNCLIP_RATIO = 1.5
const DB_MIN_SIZE = 3

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        session = await ort.InferenceSession.create(data.modelPath, {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        })
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
        const { imageData, width, height } = data
        
        // Calculate resize dimensions (must be multiple of 32)
        const { resizedWidth, resizedHeight, ratioW, ratioH } = calculateResizeDimensions(width, height)
        
        // Preprocess image for detection model
        const inputTensor = preprocessImage(imageData, width, height, resizedWidth, resizedHeight)
        
        // Run inference
        const results = await session.run({ 'x': inputTensor })
        
        // Extract bounding boxes from results using DB postprocessing
        const boxes = postprocessDetection(results, resizedWidth, resizedHeight, ratioW, ratioH)
        
        self.postMessage({ type: 'RESULT', data: { boxes } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

function calculateResizeDimensions(width: number, height: number, limitSideLen: number = 960) {
  let resizedWidth = width
  let resizedHeight = height
  
  // Limit the maximum side length
  if (Math.max(width, height) > limitSideLen) {
    if (width > height) {
      resizedWidth = limitSideLen
      resizedHeight = Math.round(height * limitSideLen / width)
    } else {
      resizedHeight = limitSideLen
      resizedWidth = Math.round(width * limitSideLen / height)
    }
  }
  
  // Make dimensions multiple of 32
  resizedWidth = Math.ceil(resizedWidth / 32) * 32
  resizedHeight = Math.ceil(resizedHeight / 32) * 32
  
  const ratioW = width / resizedWidth
  const ratioH = height / resizedHeight
  
  return { resizedWidth, resizedHeight, ratioW, ratioH }
}

function preprocessImage(
  imageData: Uint8ClampedArray, 
  originalWidth: number, 
  originalHeight: number,
  targetWidth: number,
  targetHeight: number
): ort.Tensor {
  // Create canvas for resizing
  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')!
  
  // Create ImageData from input
  const inputImageData = new ImageData(
    new Uint8ClampedArray(imageData),
    originalWidth,
    originalHeight
  )
  
  // Create temporary canvas with original image
  const tempCanvas = new OffscreenCanvas(originalWidth, originalHeight)
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(inputImageData, 0, 0)
  
  // Resize to target dimensions
  ctx.drawImage(tempCanvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight)
  
  // Get resized image data
  const resizedData = ctx.getImageData(0, 0, targetWidth, targetHeight).data
  
  // Normalize with ImageNet mean and std
  const mean = [0.485, 0.456, 0.406]
  const std = [0.229, 0.224, 0.225]
  const normalized = new Float32Array(3 * targetWidth * targetHeight)
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4
      const pixelIdx = y * targetWidth + x
      
      // Normalize each channel
      normalized[pixelIdx] = (resizedData[idx] / 255.0 - mean[0]) / std[0] // R
      normalized[targetHeight * targetWidth + pixelIdx] = (resizedData[idx + 1] / 255.0 - mean[1]) / std[1] // G
      normalized[2 * targetHeight * targetWidth + pixelIdx] = (resizedData[idx + 2] / 255.0 - mean[2]) / std[2] // B
    }
  }
  
  return new ort.Tensor('float32', normalized, [1, 3, targetHeight, targetWidth])
}

function postprocessDetection(
  results: ort.InferenceSession.OnnxValueMapType, 
  _width: number, 
  _height: number,
  ratioW: number,
  ratioH: number
): BoundingBox[] {
  // Get output tensor - PaddleOCR DB model outputs a probability map
  const output = results['sigmoid_0.tmp_0'] || results['save_infer_model/scale_0.tmp_1'] || 
                 results['output'] || Object.values(results)[0]
  
  if (!output) {
    console.error('No output found in results')
    return []
  }
  
  const probMap = output.data as Float32Array
  const [, , mapHeight, mapWidth] = output.dims as number[]
  
  // Apply threshold to get binary map
  const bitmap = new Uint8Array(mapHeight * mapWidth)
  for (let i = 0; i < probMap.length; i++) {
    bitmap[i] = probMap[i] > DB_THRESH ? 255 : 0
  }
  
  // Find contours using a simple connected components approach
  const contours = findContours(bitmap, mapWidth, mapHeight)
  
  // Convert contours to bounding boxes
  const boxes: BoundingBox[] = []
  
  for (const contour of contours) {
    // Calculate bounding rectangle
    const rect = minAreaRect(contour)
    if (!rect) continue
    
    // Calculate box score
    const score = boxScoreFast(probMap, rect, mapWidth, mapHeight)
    if (score < DB_BOX_THRESH) continue
    
    // Unclip the box (expand it)
    const expandedBox = unclipBox(rect, DB_UNCLIP_RATIO)
    if (!expandedBox) continue
    
    // Check minimum size
    const boxWidth = Math.abs(expandedBox.topRight.x - expandedBox.topLeft.x)
    const boxHeight = Math.abs(expandedBox.bottomLeft.y - expandedBox.topLeft.y)
    if (Math.min(boxWidth, boxHeight) < DB_MIN_SIZE) continue
    
    // Scale back to original image coordinates
    boxes.push({
      topLeft: { 
        x: expandedBox.topLeft.x * ratioW, 
        y: expandedBox.topLeft.y * ratioH 
      },
      topRight: { 
        x: expandedBox.topRight.x * ratioW, 
        y: expandedBox.topRight.y * ratioH 
      },
      bottomRight: { 
        x: expandedBox.bottomRight.x * ratioW, 
        y: expandedBox.bottomRight.y * ratioH 
      },
      bottomLeft: { 
        x: expandedBox.bottomLeft.x * ratioW, 
        y: expandedBox.bottomLeft.y * ratioH 
      }
    })
  }
  
  return boxes
}

// Simple contour finding algorithm
function findContours(
  bitmap: Uint8Array, 
  width: number, 
  height: number
): Array<Array<{x: number, y: number}>> {
  const visited = new Uint8Array(width * height)
  const contours: Array<Array<{x: number, y: number}>> = []
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      
      if (bitmap[idx] === 255 && !visited[idx]) {
        const contour = traceContour(bitmap, visited, x, y, width, height)
        if (contour.length > 10) { // Minimum contour size
          contours.push(contour)
        }
      }
    }
  }
  
  return contours
}

// Trace a single contour using flood fill
function traceContour(
  bitmap: Uint8Array,
  visited: Uint8Array,
  startX: number,
  startY: number,
  width: number,
  height: number
): Array<{x: number, y: number}> {
  const contour: Array<{x: number, y: number}> = []
  const stack: Array<{x: number, y: number}> = [{x: startX, y: startY}]
  
  // 8-directional neighbors
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1]
  
  while (stack.length > 0) {
    const {x, y} = stack.pop()!
    const idx = y * width + x
    
    if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || bitmap[idx] !== 255) {
      continue
    }
    
    visited[idx] = 1
    contour.push({x, y})
    
    // Add neighbors to stack
    for (let i = 0; i < 8; i++) {
      stack.push({x: x + dx[i], y: y + dy[i]})
    }
  }
  
  return contour
}

// Calculate minimum area rectangle for a contour
function minAreaRect(contour: Array<{x: number, y: number}>): BoundingBox | null {
  if (contour.length < 4) return null
  
  // Find convex hull (simplified - just use bounding box corners)
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity
  
  for (const point of contour) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }
  
  return {
    topLeft: { x: minX, y: minY },
    topRight: { x: maxX, y: minY },
    bottomRight: { x: maxX, y: maxY },
    bottomLeft: { x: minX, y: maxY }
  }
}

// Calculate box score (fast version using bounding box)
function boxScoreFast(
  probMap: Float32Array,
  box: BoundingBox,
  width: number,
  height: number
): number {
  const xMin = Math.floor(Math.min(box.topLeft.x, box.bottomLeft.x))
  const xMax = Math.ceil(Math.max(box.topRight.x, box.bottomRight.x))
  const yMin = Math.floor(Math.min(box.topLeft.y, box.topRight.y))
  const yMax = Math.ceil(Math.max(box.bottomLeft.y, box.bottomRight.y))
  
  let sum = 0
  let count = 0
  
  for (let y = Math.max(0, yMin); y < Math.min(height, yMax); y++) {
    for (let x = Math.max(0, xMin); x < Math.min(width, xMax); x++) {
      sum += probMap[y * width + x]
      count++
    }
  }
  
  return count > 0 ? sum / count : 0
}

// Expand box by unclip ratio
function unclipBox(box: BoundingBox, unclipRatio: number): BoundingBox | null {
  const centerX = (box.topLeft.x + box.topRight.x + box.bottomLeft.x + box.bottomRight.x) / 4
  const centerY = (box.topLeft.y + box.topRight.y + box.bottomLeft.y + box.bottomRight.y) / 4
  
  const width = Math.max(
    Math.abs(box.topRight.x - box.topLeft.x),
    Math.abs(box.bottomRight.x - box.bottomLeft.x)
  )
  const height = Math.max(
    Math.abs(box.bottomLeft.y - box.topLeft.y),
    Math.abs(box.bottomRight.y - box.topRight.y)
  )
  
  const expandedWidth = width * unclipRatio
  const expandedHeight = height * unclipRatio
  
  return {
    topLeft: { 
      x: centerX - expandedWidth / 2, 
      y: centerY - expandedHeight / 2 
    },
    topRight: { 
      x: centerX + expandedWidth / 2, 
      y: centerY - expandedHeight / 2 
    },
    bottomRight: { 
      x: centerX + expandedWidth / 2, 
      y: centerY + expandedHeight / 2 
    },
    bottomLeft: { 
      x: centerX - expandedWidth / 2, 
      y: centerY + expandedHeight / 2 
    }
  }
}