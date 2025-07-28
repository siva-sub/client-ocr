import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

export interface PDFProcessingOptions {
  scale?: number // Rendering scale (default: 2.0 for better OCR accuracy)
  maxPages?: number // Maximum pages to process
  pageRange?: { start: number; end: number } // Specific page range
  preprocess?: boolean // Apply preprocessing to improve OCR
  batchSize?: number // Number of pages to process in parallel
  onProgress?: (progress: PDFProcessingProgress) => void
}

export interface PDFProcessingProgress {
  currentPage: number
  totalPages: number
  pageText?: string
  error?: Error
}

export interface PDFPageData {
  pageNumber: number
  imageData: ImageData
  width: number
  height: number
}

export class PDFProcessor {
  private static instance: PDFProcessor
  
  private constructor() {
    // Initialize PDF.js worker
    this.initializePDFJS()
  }

  static getInstance(): PDFProcessor {
    if (!PDFProcessor.instance) {
      PDFProcessor.instance = new PDFProcessor()
    }
    return PDFProcessor.instance
  }

  private async initializePDFJS() {
    try {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
    } catch (error) {
      console.error('Failed to initialize PDF.js worker:', error)
    }
  }

  async loadPDF(source: ArrayBuffer | Uint8Array | string): Promise<PDFDocumentProxy> {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: source,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/'
      })
      
      return await loadingTask.promise
    } catch (error) {
      throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async extractPages(
    pdf: PDFDocumentProxy,
    options: PDFProcessingOptions = {}
  ): Promise<PDFPageData[]> {
    const {
      scale = 2.0,
      maxPages,
      pageRange,
      batchSize = 3,
      onProgress
    } = options

    const totalPages = pdf.numPages
    const startPage = pageRange?.start || 1
    const endPage = Math.min(
      pageRange?.end || totalPages,
      maxPages ? startPage + maxPages - 1 : totalPages
    )

    const pages: PDFPageData[] = []

    // Process pages in batches
    for (let i = startPage; i <= endPage; i += batchSize) {
      const batchPromises: Promise<PDFPageData>[] = []
      
      for (let j = i; j < Math.min(i + batchSize, endPage + 1); j++) {
        batchPromises.push(this.renderPage(pdf, j, scale))
        
        if (onProgress) {
          onProgress({
            currentPage: j,
            totalPages: endPage - startPage + 1
          })
        }
      }
      
      const batchResults = await Promise.all(batchPromises)
      pages.push(...batchResults)
    }

    return pages
  }

  private async renderPage(
    pdf: PDFDocumentProxy,
    pageNumber: number,
    scale: number
  ): Promise<PDFPageData> {
    try {
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale })

      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      
      const context = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      })
      
      if (!context) {
        throw new Error('Failed to get canvas context')
      }

      // Set white background for better OCR
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Render page
      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'white'
      }).promise

      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Apply preprocessing if requested
      // TODO: Add preprocessing option handling

      return {
        pageNumber,
        imageData,
        width: canvas.width,
        height: canvas.height
      }
    } catch (error) {
      throw new Error(`Failed to render page ${pageNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // TODO: Implement image preprocessing
  /*
  private _preprocessImageData(imageData: ImageData): void {
    const data = imageData.data
    
    // Convert to grayscale and enhance contrast
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      
      // Apply simple threshold for better OCR
      const threshold = 200
      const value = gray > threshold ? 255 : gray < 50 ? 0 : gray
      
      data[i] = value     // R
      data[i + 1] = value // G
      data[i + 2] = value // B
      // Alpha channel (i + 3) remains unchanged
    }
  }
  */

  async extractTextFromPDF(
    file: File | ArrayBuffer,
    options: PDFProcessingOptions = {}
  ): Promise<{ pages: PDFPageData[]; pdf: PDFDocumentProxy }> {
    try {
      // Convert file to ArrayBuffer if needed
      const buffer = file instanceof File ? await file.arrayBuffer() : file
      
      // Load PDF
      const pdf = await this.loadPDF(buffer)
      
      // Extract pages
      const pages = await this.extractPages(pdf, options)
      
      return { pages, pdf }
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Enhanced PDF text extraction with native PDF text layer
  async extractNativeText(pdf: PDFDocumentProxy): Promise<string[]> {
    const textContent: string[] = []
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .trim()
        
        textContent.push(pageText)
      } catch (error) {
        console.warn(`Failed to extract text from page ${i}:`, error)
        textContent.push('') // Add empty string for failed pages
      }
    }
    
    return textContent
  }

  // Check if PDF has selectable text
  async hasSelectableText(pdf: PDFDocumentProxy): Promise<boolean> {
    try {
      const page = await pdf.getPage(1)
      const content = await page.getTextContent()
      return content.items.length > 0 && content.items.some((item: any) => item.str.trim().length > 0)
    } catch {
      return false
    }
  }

  // Get PDF metadata
  async getMetadata(pdf: PDFDocumentProxy): Promise<any> {
    try {
      const metadata = await pdf.getMetadata()
      const info = metadata.info as any
      return {
        title: info.Title || 'Untitled',
        author: info.Author || 'Unknown',
        subject: info.Subject || '',
        keywords: info.Keywords || '',
        creator: info.Creator || '',
        producer: info.Producer || '',
        creationDate: info.CreationDate || '',
        modificationDate: info.ModDate || '',
        numPages: pdf.numPages
      }
    } catch {
      return {
        title: 'Untitled',
        numPages: pdf.numPages
      }
    }
  }

  // Release resources
  destroy(pdf?: PDFDocumentProxy): void {
    if (pdf) {
      pdf.destroy()
    }
  }
}

// Export singleton instance
export const pdfProcessor = PDFProcessor.getInstance()