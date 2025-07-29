// Client-Side OCR Library Exports v2.0.0

// Main engines
export { RapidOCREngine } from './core/rapid-ocr-engine'
export { createRapidOCREngine, createPPUEngine, createOCREngine } from './core/ocr-factory'

// Core services
export { ModelDownloader } from './core/model-downloader'
export { MetaONNXLoader } from './core/meta-onnx-loader'
export { ImageLoader } from './core/image-loader'
export { pdfProcessor as processPDF } from './core/pdf-processor'

// PPU specific
export { isPPUModel, decodePPUOutput } from './core/ppu-model-handler'

// Types
export type {
  OCRResult,
  TextLine,
  WordBox,
  BoundingBox,
  Point,
  ProcessingOptions,
  ProcessOptions,
  PreprocessConfig,
  PostprocessConfig,
  OCRProgress,
  ProcessingTime,
  DebugInfo
} from './types/ocr.types'

export type {
  RapidOCRConfig,
  PPUConfig,
  OCRConfig,
  LanguageCode,
  ModelVersion,
  ModelType,
  WorkerConfig
} from './types/config.types'

export type {
  ImageInput,
  LoadedImage
} from './core/image-loader'

// Utilities
export { 
  preprocessImage,
  resizeImage,
  detectLanguage,
  getSupportedLanguages,
  extractPatterns,
  mergeTextLines
} from './utils'

// Constants
export { 
  SUPPORTED_LANGUAGES,
  MODEL_URLS,
  DEFAULT_CONFIG
} from './constants'

// Re-export useful types
export type { InferenceSession } from 'onnxruntime-web'