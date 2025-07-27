import * as ort from 'onnxruntime-web'
import type { WorkerMessage, BoundingBox } from '../types/ocr.types'

let session: ort.InferenceSession | null = null

// DB postprocessing parameters - Optimized for document text detection
const DB_THRESH = 0.15  // Further lowered for dense document text detection
const DB_BOX_THRESH = 0.3  // Lower threshold to capture more text regions in documents
const DB_UNCLIP_RATIO = 2.0  // Increased to capture full paragraph boxes
const DB_MIN_SIZE = 3
const DB_MAX_CANDIDATES = 1000  // Maximum number of text candidates to process
const PARAGRAPH_MERGE_THRESHOLD = 50  // Vertical distance to merge text lines into paragraphs

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'INIT':
      try {
        // Try WebGL first for better performance, fall back to WASM
        const executionProviders = ['webgl', 'wasm']
        console.log('Initializing detection model:', data.modelPath)
        
        session = await ort.InferenceSession.create(data.modelPath, {
          executionProviders,
          graphOptimizationLevel: 'all'
        })
        
        console.log('Detection model initialized successfully')
        console.log('Input names:', session.inputNames)
        console.log('Output names:', session.outputNames)
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
        const { imageData, width, height, isDocument = false } = data
        
        // Use document-specific parameters if detected
        if (isDocument) {
          console.log('Using document-optimized detection parameters')
        }
        
        // Calculate resize dimensions (must be multiple of 32)
        const { resizedWidth, resizedHeight, ratioW, ratioH } = calculateResizeDimensions(width, height)
        
        // Preprocess image for detection model
        const inputTensor = preprocessImage(imageData, width, height, resizedWidth, resizedHeight)
        
        // Run inference - dynamically use the input name from the model
        const inputName = session.inputNames[0] || 'x'
        const feeds: Record<string, ort.Tensor> = {}
        feeds[inputName] = inputTensor
        const results = await session.run(feeds)
        
        // Extract bounding boxes from results using DB postprocessing
        const boxes = postprocessDetection(results, resizedWidth, resizedHeight, ratioW, ratioH, isDocument)
        
        self.postMessage({ type: 'RESULT', data: { boxes } })
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})

function calculateResizeDimensions(width: number, height: number, limitSideLen: number = 1280) {
  let resizedWidth = width
  let resizedHeight = height
  
  // For documents, use higher resolution limit for better text detection
  // Detect if it's likely a document (portrait orientation with high resolution)
  const isDocument = height > width && Math.min(width, height) > 1000
  const effectiveLimit = isDocument ? 1920 : limitSideLen
  
  // Limit the maximum side length
  if (Math.max(width, height) > effectiveLimit) {
    if (width > height) {
      resizedWidth = effectiveLimit
      resizedHeight = Math.round(height * effectiveLimit / width)
    } else {
      resizedHeight = effectiveLimit
      resizedWidth = Math.round(width * effectiveLimit / height)
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
  ratioH: number,
  isDocument: boolean = false
): BoundingBox[] {
  // Get output tensor - Try common output names first
  const outputName = Object.keys(results)[0]
  console.log('Detection output name:', outputName)
  
  const output = results[outputName]
  
  // Common output names for PaddleOCR detection models:
  // - 'sigmoid_0.tmp_0' (v2/v3)
  // - 'save_infer_model/scale_0.tmp_1' (v4/v5)
  // - 'output' (some exports)
  // - First output if none match
  
  if (!output) {
    console.error('No output found in results. Available outputs:', Object.keys(results))
    return []
  }
  
  console.log('Output shape:', output.dims)
  console.log('Output data length:', (output.data as Float32Array).length)
  
  const probMap = output.data as Float32Array
  const [, , mapHeight, mapWidth] = output.dims as number[]
  
  // Use more aggressive thresholds for documents
  const effectiveThresh = isDocument ? 0.05 : DB_THRESH  // Very low threshold for documents
  const effectiveBoxThresh = isDocument ? 0.15 : DB_BOX_THRESH  // Much lower for documents
  const effectiveUnclipRatio = isDocument ? 3.0 : DB_UNCLIP_RATIO  // Larger expansion for paragraphs
  const effectiveMinSize = isDocument ? 2 : DB_MIN_SIZE  // Smaller minimum size for documents
  
  console.log('Detection parameters:', {
    isDocument,
    threshold: effectiveThresh,
    boxThreshold: effectiveBoxThresh,
    unclipRatio: effectiveUnclipRatio
  })
  
  // Apply threshold to get binary map
  const bitmap = new Uint8Array(mapHeight * mapWidth)
  let pixelsAboveThreshold = 0
  let maxProb = 0
  let minProb = 1
  
  for (let i = 0; i < probMap.length; i++) {
    const prob = probMap[i]
    maxProb = Math.max(maxProb, prob)
    minProb = Math.min(minProb, prob)
    
    if (prob > effectiveThresh) {
      bitmap[i] = 255
      pixelsAboveThreshold++
    } else {
      bitmap[i] = 0
    }
  }
  
  console.log('Detection probability stats:', {
    min: minProb,
    max: maxProb,
    threshold: effectiveThresh,
    pixelsAboveThreshold,
    totalPixels: probMap.length,
    percentageAbove: (pixelsAboveThreshold / probMap.length * 100).toFixed(2) + '%'
  })
  
  // Find contours using a simple connected components approach
  const contours = findContours(bitmap, mapWidth, mapHeight, isDocument)
  console.log(`Found ${contours.length} contours`)
  
  // Convert contours to bounding boxes
  const boxes: BoundingBox[] = []
  const rejectionReasons: Record<string, number> = {
    'no_rect': 0,
    'low_score': 0,
    'no_expanded_box': 0,
    'too_small': 0
  }
  
  for (const contour of contours) {
    // Calculate bounding rectangle
    const rect = minAreaRect(contour)
    if (!rect) {
      rejectionReasons.no_rect++
      continue
    }
    
    // Calculate box score
    const score = boxScoreFast(probMap, rect, mapWidth, mapHeight)
    if (score < effectiveBoxThresh) {
      rejectionReasons.low_score++
      console.log(`Box rejected: score ${score.toFixed(3)} < threshold ${effectiveBoxThresh}`)
      continue
    }
    
    // Unclip the box (expand it)
    const expandedBox = unclipBox(rect, effectiveUnclipRatio)
    if (!expandedBox) {
      rejectionReasons.no_expanded_box++
      continue
    }
    
    // Check minimum size
    const boxWidth = Math.abs(expandedBox.topRight.x - expandedBox.topLeft.x)
    const boxHeight = Math.abs(expandedBox.bottomLeft.y - expandedBox.topLeft.y)
    if (Math.min(boxWidth, boxHeight) < effectiveMinSize) {
      rejectionReasons.too_small++
      console.log(`Box rejected: size ${Math.min(boxWidth, boxHeight).toFixed(1)} < minimum ${effectiveMinSize}`)
      continue
    }
    
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
  
  console.log('Box filtering results:', {
    totalContours: contours.length,
    acceptedBoxes: boxes.length,
    rejectionReasons
  })
  
  // For documents, merge nearby boxes that likely belong to the same paragraph
  if (isDocument && boxes.length > 0) {
    const mergedBoxes = mergeParagraphBoxes(boxes)
    console.log(`Merged ${boxes.length} boxes into ${mergedBoxes.length} paragraph boxes`)
    return mergedBoxes
  }
  
  return boxes
}

// Improved contour finding algorithm for document text
function findContours(
  bitmap: Uint8Array, 
  width: number, 
  height: number,
  isDocument: boolean = false
): Array<Array<{x: number, y: number}>> {
  const visited = new Uint8Array(width * height)
  const contours: Array<Array<{x: number, y: number}>> = []
  
  // Apply morphological operations to connect nearby text regions
  // Use larger kernel for documents to connect text lines in paragraphs
  const kernelSize = isDocument ? 5 : 2
  const dilatedBitmap = morphologicalDilate(bitmap, width, height, kernelSize)
  
  // For documents, apply additional horizontal dilation to connect words in lines
  const finalBitmap = isDocument ? 
    morphologicalDilateHorizontal(dilatedBitmap, width, height, 3) : 
    dilatedBitmap
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      
      if (finalBitmap[idx] === 255 && !visited[idx]) {
        const contour = traceContour(finalBitmap, visited, x, y, width, height)
        if (contour.length > 5) { // Lowered minimum contour size for small text
          contours.push(contour)
        }
      }
    }
  }
  
  // Limit number of contours to prevent excessive processing
  if (contours.length > DB_MAX_CANDIDATES) {
    // Sort by size and keep the largest ones
    contours.sort((a, b) => b.length - a.length)
    return contours.slice(0, DB_MAX_CANDIDATES)
  }
  
  return contours
}

// Morphological dilation to connect nearby text regions
function morphologicalDilate(
  bitmap: Uint8Array,
  width: number,
  height: number,
  kernelSize: number
): Uint8Array {
  const result = new Uint8Array(bitmap)
  const halfKernel = Math.floor(kernelSize / 2)
  
  for (let y = halfKernel; y < height - halfKernel; y++) {
    for (let x = halfKernel; x < width - halfKernel; x++) {
      let maxVal = 0
      
      // Check kernel area
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const idx = (y + ky) * width + (x + kx)
          maxVal = Math.max(maxVal, bitmap[idx])
        }
      }
      
      result[y * width + x] = maxVal
    }
  }
  
  return result
}

// Horizontal morphological dilation to connect words in text lines
function morphologicalDilateHorizontal(
  bitmap: Uint8Array,
  width: number,
  height: number,
  kernelWidth: number
): Uint8Array {
  const result = new Uint8Array(bitmap)
  const halfKernel = Math.floor(kernelWidth / 2)
  
  for (let y = 0; y < height; y++) {
    for (let x = halfKernel; x < width - halfKernel; x++) {
      let maxVal = 0
      
      // Check horizontal kernel area only
      for (let kx = -halfKernel; kx <= halfKernel; kx++) {
        const idx = y * width + (x + kx)
        maxVal = Math.max(maxVal, bitmap[idx])
      }
      
      result[y * width + x] = maxVal
    }
  }
  
  return result
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
  
  // For very thin boxes (likely text lines), ensure minimum height
  const width = maxX - minX
  const height = maxY - minY
  
  // If the box is too thin vertically, expand it
  if (height < 5 && width > 20) {
    const centerY = (minY + maxY) / 2
    minY = centerY - 5
    maxY = centerY + 5
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

// Merge boxes that likely belong to the same paragraph
function mergeParagraphBoxes(boxes: BoundingBox[]): BoundingBox[] {
  if (boxes.length === 0) return boxes
  
  // Sort boxes by vertical position (top to bottom)
  const sortedBoxes = [...boxes].sort((a, b) => {
    const centerYA = (a.topLeft.y + a.bottomLeft.y) / 2
    const centerYB = (b.topLeft.y + b.bottomLeft.y) / 2
    return centerYA - centerYB
  })
  
  const merged: BoundingBox[] = []
  let currentGroup: BoundingBox[] = [sortedBoxes[0]]
  
  for (let i = 1; i < sortedBoxes.length; i++) {
    const currentBox = sortedBoxes[i]
    const lastInGroup = currentGroup[currentGroup.length - 1]
    
    // Calculate vertical distance between boxes
    const verticalGap = currentBox.topLeft.y - lastInGroup.bottomLeft.y
    
    // Check horizontal overlap
    const currentLeft = Math.min(currentBox.topLeft.x, currentBox.bottomLeft.x)
    const currentRight = Math.max(currentBox.topRight.x, currentBox.bottomRight.x)
    const groupLeft = Math.min(...currentGroup.map(b => Math.min(b.topLeft.x, b.bottomLeft.x)))
    const groupRight = Math.max(...currentGroup.map(b => Math.max(b.topRight.x, b.bottomRight.x)))
    
    const hasHorizontalOverlap = !(currentRight < groupLeft || currentLeft > groupRight)
    
    // If boxes are close vertically and have horizontal overlap, add to group
    if (verticalGap < PARAGRAPH_MERGE_THRESHOLD && hasHorizontalOverlap) {
      currentGroup.push(currentBox)
    } else {
      // Create merged box for current group
      if (currentGroup.length > 1) {
        merged.push(createMergedBox(currentGroup))
      } else {
        merged.push(currentGroup[0])
      }
      currentGroup = [currentBox]
    }
  }
  
  // Don't forget the last group
  if (currentGroup.length > 1) {
    merged.push(createMergedBox(currentGroup))
  } else {
    merged.push(currentGroup[0])
  }
  
  return merged
}

// Create a single bounding box that encompasses all boxes in the group
function createMergedBox(group: BoundingBox[]): BoundingBox {
  const minX = Math.min(...group.map(b => Math.min(b.topLeft.x, b.bottomLeft.x)))
  const maxX = Math.max(...group.map(b => Math.max(b.topRight.x, b.bottomRight.x)))
  const minY = Math.min(...group.map(b => Math.min(b.topLeft.y, b.topRight.y)))
  const maxY = Math.max(...group.map(b => Math.max(b.bottomLeft.y, b.bottomRight.y)))
  
  return {
    topLeft: { x: minX, y: minY },
    topRight: { x: maxX, y: minY },
    bottomRight: { x: maxX, y: maxY },
    bottomLeft: { x: minX, y: maxY }
  }
}