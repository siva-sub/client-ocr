// Main library exports
export { InferenceEngine } from './core/inference-engine'
export { ModelLoader } from './core/model-loader'
export { DeskewService } from './core/deskew.service'
export { FallbackSystem } from './core/fallback-system'

// Types
export type {
  OCRResult,
  TextRegion,
  BoundingBox,
  Point,
  ProcessingOptions,
  WorkerMessage
} from './types/ocr.types'

// Model configurations
export { 
  MODEL_CONFIGS,
  getModelConfig,
  getDefaultModelId,
  type ModelConfig 
} from './core/model-config'

// Constants
export const VERSION = '1.0.0'
export const DEFAULT_MODELS = {
  mobile: 'ppocrv5-mobile',
  server: 'ppocrv2-server'
}