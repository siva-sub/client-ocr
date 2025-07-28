/**
 * Dynamic image loader inspired by RapidOCR's LoadImage implementation
 * Handles multiple input types and formats
 */

export type ImageInputType = File | Blob | ArrayBuffer | Uint8Array | string | HTMLImageElement | ImageData

export interface LoadedImage {
  data: Uint8ClampedArray
  width: number
  height: number
  channels: number
  originalType: string
}

export class ImageLoader {
  private static readonly supportedFormats = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'application/pdf'
  ]

  /**
   * Load and process image from various input types
   */
  static async load(input: ImageInputType): Promise<LoadedImage> {
    const originalType = this.identifyInputType(input)
    
    let imageData: ImageData
    
    switch (originalType) {
      case 'File':
      case 'Blob':
        imageData = await this.loadFromBlob(input as Blob)
        break
        
      case 'ArrayBuffer':
      case 'Uint8Array':
        const blob = new Blob([input as ArrayBuffer])
        imageData = await this.loadFromBlob(blob)
        break
        
      case 'string':
        imageData = await this.loadFromUrl(input as string)
        break
        
      case 'HTMLImageElement':
        imageData = this.loadFromImage(input as HTMLImageElement)
        break
        
      case 'ImageData':
        imageData = input as ImageData
        break
        
      default:
        throw new Error(`Unsupported input type: ${originalType}`)
    }
    
    // Convert to BGR format like RapidOCR
    const processedData = this.convertToBGR(imageData)
    
    return {
      data: processedData.data,
      width: processedData.width,
      height: processedData.height,
      channels: 3,
      originalType
    }
  }
  
  /**
   * Identify the type of input
   */
  private static identifyInputType(input: ImageInputType): string {
    if (input instanceof File) return 'File'
    if (input instanceof Blob) return 'Blob'
    if (input instanceof ArrayBuffer) return 'ArrayBuffer'
    if (input instanceof Uint8Array) return 'Uint8Array'
    if (typeof input === 'string') return 'string'
    if (input instanceof HTMLImageElement) return 'HTMLImageElement'
    if (input instanceof ImageData) return 'ImageData'
    return 'unknown'
  }
  
  /**
   * Load image from Blob or File
   */
  private static async loadFromBlob(blob: Blob): Promise<ImageData> {
    // Check if it's a supported format
    if (!this.supportedFormats.includes(blob.type)) {
      throw new Error(`Unsupported file type: ${blob.type}`)
    }
    
    // Special handling for PDF
    if (blob.type === 'application/pdf') {
      throw new Error('PDF files should be processed with PDFProcessor')
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        const imageData = this.loadFromImage(img)
        resolve(imageData)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }
      
      img.src = url
    })
  }
  
  /**
   * Load image from URL (including base64)
   */
  private static async loadFromUrl(url: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      // Handle CORS for external URLs
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        img.crossOrigin = 'anonymous'
      }
      
      img.onload = () => {
        const imageData = this.loadFromImage(img)
        resolve(imageData)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image from URL'))
      }
      
      img.src = url
    })
  }
  
  /**
   * Load image from HTMLImageElement
   */
  private static loadFromImage(img: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true
    })
    
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }
    
    ctx.drawImage(img, 0, 0)
    return ctx.getImageData(0, 0, img.width, img.height)
  }
  
  /**
   * Convert image data to BGR format (like RapidOCR)
   */
  private static convertToBGR(imageData: ImageData): ImageData {
    const data = imageData.data
    const newData = new Uint8ClampedArray(data.length)
    
    // Handle different channel configurations
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      
      // Convert RGBA to BGR
      if (a === 0) {
        // Transparent pixel - make it white for better OCR
        newData[i] = 255     // B
        newData[i + 1] = 255 // G
        newData[i + 2] = 255 // R
      } else if (a < 255) {
        // Semi-transparent - blend with white
        const alpha = a / 255
        newData[i] = Math.round(b * alpha + 255 * (1 - alpha))     // B
        newData[i + 1] = Math.round(g * alpha + 255 * (1 - alpha)) // G
        newData[i + 2] = Math.round(r * alpha + 255 * (1 - alpha)) // R
      } else {
        // Opaque pixel - swap R and B
        newData[i] = b     // B
        newData[i + 1] = g // G
        newData[i + 2] = r // R
      }
      newData[i + 3] = 255 // Always opaque
    }
    
    return new ImageData(newData, imageData.width, imageData.height)
  }
  
  /**
   * Preprocess image for better OCR (inspired by RapidOCR)
   */
  static preprocessForOCR(imageData: ImageData): ImageData {
    const data = imageData.data
    
    // Convert to grayscale first
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i + 2] + 0.587 * data[i + 1] + 0.114 * data[i]
      
      // Apply adaptive thresholding
      let value: number
      if (gray < 100) {
        value = 0
      } else if (gray > 200) {
        value = 255
      } else {
        // Enhance contrast in mid-range
        value = ((gray - 100) / 100) * 255
      }
      
      data[i] = value     // B
      data[i + 1] = value // G
      data[i + 2] = value // R
    }
    
    return imageData
  }
  
  /**
   * Check if input is likely a PDF
   */
  static isPDF(input: ImageInputType): boolean {
    if (input instanceof File) {
      return input.type === 'application/pdf' || input.name.toLowerCase().endsWith('.pdf')
    }
    
    if (input instanceof Blob) {
      return input.type === 'application/pdf'
    }
    
    if (typeof input === 'string') {
      return input.toLowerCase().endsWith('.pdf')
    }
    
    return false
  }
}