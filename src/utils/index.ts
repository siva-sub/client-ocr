// Utility function exports

import type { ImageInputType } from '../core/image-loader'
import type { LanguageCode } from '../types/config.types'

/**
 * Preprocess an image with various enhancements
 */
export async function preprocessImage(
  _input: ImageInputType, 
  _config: any
): Promise<ImageData> {
  // Implementation would use OpenCV.js
  throw new Error('preprocessImage: Implementation required - use ImagePreprocessor class instead')
}

/**
 * Resize an image while maintaining quality
 */
export async function resizeImage(
  _input: ImageInputType,
  _options?: {
    maxWidth?: number
    maxHeight?: number
    maintainAspectRatio?: boolean
    format?: 'jpeg' | 'png' | 'webp'
    quality?: number
  }
): Promise<Blob> {
  // Implementation would use canvas
  throw new Error('resizeImage: Implementation required')
}

/**
 * Detect the primary language of text
 */
export async function detectLanguage(
  _input: ImageInputType | string
): Promise<LanguageCode> {
  // Simple implementation - would need actual language detection
  return 'en'
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): Array<{
  code: LanguageCode
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  supportedModels: string[]
}> {
  return [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', supportedModels: ['PP-OCRv4', 'PP-OCRv5'] },
    { code: 'ch', name: 'Chinese', nativeName: '中文', direction: 'ltr', supportedModels: ['PP-OCRv4', 'PP-OCRv5'] },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', supportedModels: ['PP-OCRv4', 'PP-OCRv5'] },
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', supportedModels: ['PP-OCRv4', 'PP-OCRv5'] },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', supportedModels: ['PP-OCRv4'] },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', supportedModels: ['PP-OCRv4'] },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', supportedModels: ['PP-OCRv4'] },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', supportedModels: ['PP-OCRv4'] },
    // Add more languages as needed
  ]
}

/**
 * Extract common patterns from text
 */
export function extractPatterns(text: string): {
  emails: string[]
  phones: string[]
  urls: string[]
  dates: string[]
  numbers: string[]
  currencies: string[]
} {
  return {
    emails: (text.match(/\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/g) || []),
    phones: (text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || []),
    urls: (text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g) || []),
    dates: (text.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g) || []),
    numbers: (text.match(/\b\d+(\.\d+)?\b/g) || []),
    currencies: (text.match(/[$€£¥₹]\s?\d+(\.\d{2})?/g) || [])
  }
}

/**
 * Merge text lines into paragraphs
 */
export function mergeTextLines(
  lines: Array<{ text: string; box: any }>,
  _options?: {
    lineSpacing?: number
    horizontalSpacing?: number
    preserveLayout?: boolean
  }
): string {
  // Simple implementation - join lines
  return lines.map(line => line.text).join('\n')
}