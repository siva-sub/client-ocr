// React component exports
export { OCRInterface as OCRProcessor } from './ui/OCRInterface'

// Re-export core functionality that React components might need
export { InferenceEngine } from './core/inference-engine'
export { getModelConfig, getDefaultModelId } from './core/model-config'
export type { 
  OCRResult, 
  ProcessingOptions
} from './types/ocr.types'
export type { ModelConfig } from './core/model-config'