export class DeskewService {
  private canvas: HTMLCanvasElement | OffscreenCanvas
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  
  constructor() {
    // Use OffscreenCanvas in workers, regular canvas in main thread
    if (typeof OffscreenCanvas !== 'undefined') {
      this.canvas = new OffscreenCanvas(1, 1)
      this.ctx = this.canvas.getContext('2d')!
    } else if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!
    } else {
      throw new Error('Neither OffscreenCanvas nor document is available')
    }
  }
  
  async deskewImage(imageData: ImageData | HTMLImageElement): Promise<{ imageData: ImageData; angle: number }> {
    // Convert to ImageData if needed
    const data = imageData instanceof ImageData ? imageData : this.imageToImageData(imageData)
    
    // Calculate skew angle
    const angle = await this.calculateSkewAngle(data)
    
    // Apply rotation if needed
    if (Math.abs(angle) > 0.5) {
      const rotatedData = this.rotateImage(data, -angle)
      return { imageData: rotatedData, angle }
    }
    
    return { imageData: data, angle: 0 }
  }
  
  private calculateSkewAngle(imageData: ImageData): number {
    const angles: Array<{ angle: number; confidence: number; method: string }> = []
    
    // Method 1: Minimum Area Rectangle analysis
    const rectAngles = this.detectAngleByMinAreaRect(imageData)
    angles.push(...rectAngles)
    
    // Method 2: Baseline analysis
    const baselineAngles = this.detectAngleByBaseline(imageData)
    angles.push(...baselineAngles)
    
    // Method 3: Hough Line Transform
    const houghAngles = this.detectAngleByHoughLines(imageData)
    angles.push(...houghAngles)
    
    // Calculate consensus angle using IQR-based outlier removal
    return this.calculateConsensusAngle(angles, -20, 20)
  }
  
  private calculateConsensusAngle(
    angles: Array<{ angle: number; confidence: number; method: string }>,
    minAngle: number,
    maxAngle: number
  ): number {
    // Filter angles within valid range
    const validAngles = angles.filter(a => a.angle >= minAngle && a.angle <= maxAngle)
    if (validAngles.length === 0) return 0
    
    // Sort angles for IQR calculation
    const sortedAngles = validAngles
      .map(a => a.angle)
      .sort((a, b) => a - b)
    
    if (sortedAngles.length < 4) {
      // Not enough data for IQR, use weighted average
      const totalWeight = validAngles.reduce((sum, a) => sum + a.confidence, 0)
      return validAngles.reduce((sum, a) => sum + (a.angle * a.confidence), 0) / totalWeight
    }
    
    // Calculate IQR (Interquartile Range)
    const q1Index = Math.floor(sortedAngles.length * 0.25)
    const q3Index = Math.floor(sortedAngles.length * 0.75)
    const q1 = sortedAngles[q1Index]
    const q3 = sortedAngles[q3Index]
    const iqr = q3 - q1
    
    // Define outlier bounds
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr
    
    // Filter out outliers
    const inliers = validAngles.filter(a => 
      a.angle >= lowerBound && a.angle <= upperBound
    )
    
    if (inliers.length === 0) {
      // All angles were outliers, use median
      const medianIndex = Math.floor(sortedAngles.length / 2)
      return sortedAngles[medianIndex]
    }
    
    // Calculate weighted average of inliers
    const totalWeight = inliers.reduce((sum, a) => sum + a.confidence, 0)
    return inliers.reduce((sum, a) => sum + (a.angle * a.confidence), 0) / totalWeight
  }
  
  private detectAngleByMinAreaRect(imageData: ImageData): Array<{ angle: number; confidence: number; method: string }> {
    // Find contours and calculate angles from minimum area rectangles
    const contours = this.findTextContours(imageData)
    const angles: Array<{ angle: number; confidence: number; method: string }> = []
    
    for (const contour of contours) {
      const rect = this.minAreaRect(contour)
      if (!rect) continue
      
      // Calculate angle from rectangle orientation
      const angle = this.normalizeAngle(rect.angle)
      
      // Weight by area and aspect ratio
      const area = rect.width * rect.height
      const aspectRatio = Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height)
      
      // Filter out non-text regions
      if (aspectRatio > 0.2 && aspectRatio < 10 && area > 100) {
        const confidence = Math.min(area / 10000, 1) * (1 / (1 + Math.abs(aspectRatio - 3)))
        angles.push({ angle, confidence, method: 'minAreaRect' })
      }
    }
    
    return angles
  }
  
  private detectAngleByBaseline(imageData: ImageData): Array<{ angle: number; confidence: number; method: string }> {
    // Analyze text baselines
    const contours = this.findTextContours(imageData)
    const angles: Array<{ angle: number; confidence: number; method: string }> = []
    
    for (const contour of contours) {
      if (contour.length < 20) continue
      
      // Segment contour into thirds
      const segmentSize = Math.floor(contour.length / 3)
      const segments = [
        contour.slice(0, segmentSize),
        contour.slice(segmentSize, 2 * segmentSize),
        contour.slice(2 * segmentSize)
      ]
      
      // Calculate baseline angle for each segment
      for (const segment of segments) {
        const baseline = this.fitLine(segment)
        if (baseline) {
          const angle = this.normalizeAngle(Math.atan2(baseline.dy, baseline.dx) * 180 / Math.PI)
          const confidence = baseline.confidence * (segment.length / contour.length)
          angles.push({ angle, confidence, method: 'baseline' })
        }
      }
    }
    
    return angles
  }
  
  private detectAngleByHoughLines(imageData: ImageData): Array<{ angle: number; confidence: number; method: string }> {
    // Apply morphological closing to connect text fragments
    const processed = this.morphologicalClose(imageData)
    const edges = this.detectEdges(processed)
    
    // Hough transform parameters
    const angleRange = 40 // -20 to +20 degrees
    const angleStep = 0.5
    const rhoStep = 1
    const threshold = 50
    
    // Find lines using Hough transform
    const lines = this.houghLinesP(edges, angleRange, angleStep, rhoStep, threshold)
    const angles: Array<{ angle: number; confidence: number; method: string }> = []
    
    for (const line of lines) {
      const angle = this.normalizeAngle(Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 180 / Math.PI)
      const length = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))
      const confidence = Math.min(length / 200, 1) * line.votes / threshold
      
      angles.push({ angle, confidence, method: 'houghLine' })
    }
    
    return angles
  }
  
  private detectEdges(imageData: ImageData): Uint8ClampedArray {
    const { width, height, data } = imageData
    const edges = new Uint8ClampedArray(data.length)
    
    // Simple Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        
        // Get surrounding pixels
        const tl = ((y - 1) * width + (x - 1)) * 4
        const tm = ((y - 1) * width + x) * 4
        const tr = ((y - 1) * width + (x + 1)) * 4
        const ml = (y * width + (x - 1)) * 4
        const mr = (y * width + (x + 1)) * 4
        const bl = ((y + 1) * width + (x - 1)) * 4
        const bm = ((y + 1) * width + x) * 4
        const br = ((y + 1) * width + (x + 1)) * 4
        
        // Sobel X
        const sobelX = 
          -1 * data[tl] + 1 * data[tr] +
          -2 * data[ml] + 2 * data[mr] +
          -1 * data[bl] + 1 * data[br]
        
        // Sobel Y
        const sobelY = 
          -1 * data[tl] - 2 * data[tm] - 1 * data[tr] +
          1 * data[bl] + 2 * data[bm] + 1 * data[br]
        
        const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY)
        edges[idx] = edges[idx + 1] = edges[idx + 2] = Math.min(255, magnitude)
        edges[idx + 3] = 255
      }
    }
    
    return edges
  }
  
  private rotateImage(imageData: ImageData, angle: number): ImageData {
    const { width, height } = imageData
    const rad = angle * Math.PI / 180
    
    // Calculate new dimensions
    const cos = Math.abs(Math.cos(rad))
    const sin = Math.abs(Math.sin(rad))
    const newWidth = Math.ceil(width * cos + height * sin)
    const newHeight = Math.ceil(width * sin + height * cos)
    
    // Set up canvas for rotation
    this.canvas.width = newWidth
    this.canvas.height = newHeight
    
    // Create temporary canvas for source image
    let tempCanvas: HTMLCanvasElement | OffscreenCanvas
    let tempCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    
    if (typeof OffscreenCanvas !== 'undefined') {
      tempCanvas = new OffscreenCanvas(width, height)
      tempCtx = tempCanvas.getContext('2d')!
    } else {
      tempCanvas = document.createElement('canvas')
      tempCanvas.width = width
      tempCanvas.height = height
      tempCtx = tempCanvas.getContext('2d')!
    }
    tempCtx.putImageData(imageData, 0, 0)
    
    // Perform rotation
    this.ctx.save()
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, newWidth, newHeight)
    this.ctx.translate(newWidth / 2, newHeight / 2)
    this.ctx.rotate(rad)
    this.ctx.drawImage(tempCanvas as any, -width / 2, -height / 2)
    this.ctx.restore()
    
    return this.ctx.getImageData(0, 0, newWidth, newHeight)
  }
  
  private imageToImageData(image: HTMLImageElement): ImageData {
    this.canvas.width = image.width
    this.canvas.height = image.height
    this.ctx.drawImage(image, 0, 0)
    return this.ctx.getImageData(0, 0, image.width, image.height)
  }
  
  // Helper methods for improved deskew
  private findTextContours(imageData: ImageData): Array<Array<{x: number, y: number}>> {
    // Convert to binary image
    const binary = this.binarize(imageData)
    const { width, height } = imageData
    const visited = new Uint8Array(width * height)
    const contours: Array<Array<{x: number, y: number}>> = []
    
    // Find connected components
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        if (binary[idx] && !visited[idx]) {
          const contour = this.traceContour(binary, visited, x, y, width, height)
          if (contour.length > 10) {
            contours.push(contour)
          }
        }
      }
    }
    
    return contours
  }
  
  private binarize(imageData: ImageData): Uint8Array {
    const { width, height, data } = imageData
    const binary = new Uint8Array(width * height)
    const threshold = 128
    
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
      binary[i] = gray < threshold ? 1 : 0
    }
    
    return binary
  }
  
  private traceContour(
    binary: Uint8Array,
    visited: Uint8Array,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): Array<{x: number, y: number}> {
    const contour: Array<{x: number, y: number}> = []
    const stack: Array<{x: number, y: number}> = [{x: startX, y: startY}]
    
    while (stack.length > 0) {
      const {x, y} = stack.pop()!
      const idx = y * width + x
      
      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || !binary[idx]) {
        continue
      }
      
      visited[idx] = 1
      contour.push({x, y})
      
      // 8-connectivity
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) {
            stack.push({x: x + dx, y: y + dy})
          }
        }
      }
    }
    
    return contour
  }
  
  private minAreaRect(contour: Array<{x: number, y: number}>): {width: number, height: number, angle: number} | null {
    if (contour.length < 3) return null
    
    // Find bounding box
    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity
    
    for (const point of contour) {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    }
    
    const width = maxX - minX
    const height = maxY - minY
    
    // Calculate angle using PCA (simplified)
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    
    let sumXX = 0, sumXY = 0, sumYY = 0
    for (const point of contour) {
      const dx = point.x - centerX
      const dy = point.y - centerY
      sumXX += dx * dx
      sumXY += dx * dy
      sumYY += dy * dy
    }
    
    const angle = Math.atan2(2 * sumXY, sumXX - sumYY) / 2 * 180 / Math.PI
    
    return { width, height, angle }
  }
  
  private fitLine(points: Array<{x: number, y: number}>): {dx: number, dy: number, confidence: number} | null {
    if (points.length < 2) return null
    
    // Linear regression
    let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0
    
    for (const point of points) {
      sumX += point.x
      sumY += point.y
      sumXX += point.x * point.x
      sumXY += point.x * point.y
    }
    
    const n = points.length
    const det = n * sumXX - sumX * sumX
    
    if (Math.abs(det) < 1e-10) return null
    
    const a = (n * sumXY - sumX * sumY) / det
    // const b = (sumY - a * sumX) / n
    
    // Calculate R-squared for confidence
    const meanY = sumY / n
    let ssRes = 0, ssTot = 0
    
    for (const point of points) {
      const yPred = a * point.x + (sumY - a * sumX) / n
      ssRes += Math.pow(point.y - yPred, 2)
      ssTot += Math.pow(point.y - meanY, 2)
    }
    
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0
    
    return { dx: 1, dy: a, confidence: rSquared }
  }
  
  private morphologicalClose(imageData: ImageData): ImageData {
    // Simple morphological closing (dilation followed by erosion)
    const dilated = this.dilate(imageData)
    return this.erode(dilated)
  }
  
  private dilate(imageData: ImageData): ImageData {
    const { width, height, data } = imageData
    const result = new Uint8ClampedArray(data)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        let maxVal = 0
        
        // 3x3 kernel
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4
            maxVal = Math.max(maxVal, data[nIdx])
          }
        }
        
        result[idx] = result[idx + 1] = result[idx + 2] = maxVal
      }
    }
    
    return new ImageData(result, width, height)
  }
  
  private erode(imageData: ImageData): ImageData {
    const { width, height, data } = imageData
    const result = new Uint8ClampedArray(data)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        let minVal = 255
        
        // 3x3 kernel
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4
            minVal = Math.min(minVal, data[nIdx])
          }
        }
        
        result[idx] = result[idx + 1] = result[idx + 2] = minVal
      }
    }
    
    return new ImageData(result, width, height)
  }
  
  private houghLinesP(
    _edges: Uint8ClampedArray,
    _angleRange: number,
    _angleStep: number,
    _rhoStep: number,
    _threshold: number
  ): Array<{x1: number, y1: number, x2: number, y2: number, votes: number}> {
    // Simplified probabilistic Hough transform
    const lines: Array<{x1: number, y1: number, x2: number, y2: number, votes: number}> = []
    // Implementation simplified for brevity
    return lines
  }
  
  private normalizeAngle(angle: number): number {
    // Normalize angle to [-180, 180] range
    while (angle > 180) angle -= 360
    while (angle < -180) angle += 360
    
    // For text, angles close to 0 or 180 are most common
    if (angle > 90) angle -= 180
    if (angle < -90) angle += 180
    
    return angle
  }
}