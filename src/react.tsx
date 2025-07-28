// React component exports
export { OCRInterface } from './ui/OCRInterface'
export { RapidOCRInterface } from './ui/RapidOCRInterface'
export { EnhancedOCRInterface } from './ui/EnhancedOCRInterface'
export { OCRApp } from './ui/OCRApp'

// UI Components
export { EnhancedDropzone } from './ui/EnhancedDropzone'
export { ResultViewer } from './ui/ResultViewer'
export { PreprocessingControls } from './ui/PreprocessingControls'
export { EnhancedPerformanceMonitor } from './ui/EnhancedPerformanceMonitor'
export { LanguageSelector } from './ui/LanguageSelector'
export { ModelDownloadProgress } from './ui/ModelDownloadProgress'
export { PwaInstallPrompt } from './ui/PwaInstallPrompt'

// Re-export core functionality that React components might need
export { RapidOCREngine } from './core/rapid-ocr-engine'
export { ImagePreprocessor } from './core/preprocessing/image-preprocessor'
export { ImageLoader } from './core/image-loader'
export { pdfProcessor } from './core/pdf-processor'

// Types
export type { 
  OCRResult,
  TextRegion,
  BoundingBox,
  ProcessingOptions,
  OCRProgress
} from './types/ocr.types'

export type { 
  PreprocessingOptions 
} from './core/preprocessing/image-preprocessor'

export type {
  ImageInputType,
  LoadedImage
} from './core/image-loader'

// Configuration
export {
  LANGUAGE_CONFIGS,
  type LangType,
  type OCRVersion,
  type ModelType
} from './core/ocr-config'

export { 
  getModelConfig,
  getDefaultModelId,
  type ModelConfig 
} from './core/model-config'