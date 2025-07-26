import Tesseract from 'tesseract.js'
import type { OCRResult, TextRegion } from '../types/ocr.types'

export class FallbackSystem {
  private worker: Tesseract.Worker | null = null
  
  async initialize(language: string = 'eng'): Promise<void> {
    this.worker = await Tesseract.createWorker(language, 1, {
      logger: m => console.log('Tesseract:', m),
      cacheMethod: 'refresh',
      gzip: true
    })
    
    await this.worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?-\' '
    })
  }
  
  async performOCR(image: HTMLImageElement | HTMLCanvasElement | File): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize()
    }
    
    const startTime = performance.now()
    
    try {
      const { data } = await this.worker!.recognize(image)
      
      const regions: TextRegion[] = (data as any).words?.map((word: any) => ({
        box: {
          topLeft: { x: word.bbox.x0, y: word.bbox.y0 },
          topRight: { x: word.bbox.x1, y: word.bbox.y0 },
          bottomRight: { x: word.bbox.x1, y: word.bbox.y1 },
          bottomLeft: { x: word.bbox.x0, y: word.bbox.y1 }
        },
        text: word.text,
        confidence: word.confidence / 100
      })) || []
      
      return {
        regions,
        fullText: data.text,
        processingTime: performance.now() - startTime,
        method: 'tesseract',
        metadata: {
          imageWidth: (data as any).imageWidth || 0,
          imageHeight: (data as any).imageHeight || 0
        }
      }
    } catch (error) {
      console.error('Tesseract OCR failed:', error)
      throw error
    }
  }
  
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}