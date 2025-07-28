// Main library exports
export { RapidOCREngine } from './core/rapid-ocr-engine'
import { RapidOCREngine as RapidOCREngineClass } from './core/rapid-ocr-engine'
export { InferenceEngine } from './core/inference-engine'
export { ModelLoader } from './core/model-loader'
export { ModelDownloader } from './core/model-downloader'
export { DeskewService } from './core/deskew.service'
export { FallbackSystem } from './core/fallback-system'
export { ImageLoader } from './core/image-loader'
export { pdfProcessor } from './core/pdf-processor'
export { ImagePreprocessor } from './core/preprocessing/image-preprocessor'

// Preprocessing exports
export { DetPreProcess } from './core/preprocessing/det-preprocess'
export { RecPreProcess } from './core/preprocessing/rec-preprocess'
export { ClsPreProcess } from './core/preprocessing/cls-preprocess'

// Postprocessing exports
export { CTCLabelDecode } from './core/postprocessing/ctc-label-decode'
export { DBPostProcess } from './core/postprocessing/db-postprocess'

// Types
export type {
  OCRResult,
  TextRegion,
  BoundingBox,
  Point,
  ProcessingOptions,
  WorkerMessage,
  OCRProgress
} from './types/ocr.types'

export type { 
  PreprocessingOptions 
} from './core/preprocessing/image-preprocessor'

export type {
  ImageInputType,
  LoadedImage
} from './core/image-loader'

// Configuration exports
import type { LangType as LT, OCRVersion as OV, ModelType as MT } from './core/ocr-config'
export {
  LANGUAGE_CONFIGS,
  type LangType,
  type OCRVersion,
  type ModelType
} from './core/ocr-config'

export { 
  MODEL_CONFIGS,
  getModelConfig,
  getDefaultModelId,
  type ModelConfig 
} from './core/model-config'

// Language models
export {
  getLanguageModels,
  isLanguageSupported,
  getAvailableLanguages
} from './core/language-models'

// Constants
export const VERSION = '1.0.0'

// Factory function for easy initialization
export function createOCREngine(options?: {
  lang?: LT
  version?: OV
  modelType?: MT
}) {
  return new RapidOCREngineClass(options)
}