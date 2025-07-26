export interface Point {
  x: number
  y: number
}

export interface BoundingBox {
  topLeft: Point
  topRight: Point
  bottomRight: Point
  bottomLeft: Point
}

export interface TextRegion {
  box: BoundingBox
  text: string
  confidence: number
  angle?: number
}

export interface OCRResult {
  regions: TextRegion[]
  fullText: string
  processingTime: number
  method: 'onnx' | 'tesseract'
  metadata?: {
    imageWidth: number
    imageHeight: number
    deskewAngle?: number
  }
}

export interface WorkerMessage {
  type: 'INIT' | 'PROCESS' | 'RESULT' | 'ERROR' | 'PROGRESS'
  data?: any
  error?: string
  progress?: number
}

export interface DeskewResult {
  angle: number
  confidence: number
  method: string
}

export interface ProcessingOptions {
  enableDeskew?: boolean
  enableFallback?: boolean
  confidenceThreshold?: number
  language?: string
}