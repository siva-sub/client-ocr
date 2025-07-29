// Configuration type definitions

export type LanguageCode = 
  | 'ch'    // Chinese
  | 'en'    // English  
  | 'ja'    // Japanese
  | 'ko'    // Korean
  | 'fr'    // French
  | 'de'    // German
  | 'es'    // Spanish
  | 'pt'    // Portuguese
  | 'it'    // Italian
  | 'ru'    // Russian
  | 'ar'    // Arabic
  | 'hi'    // Hindi
  | 'vi'    // Vietnamese
  | 'id'    // Indonesian
  | 'fa'    // Persian
  | 'ka'    // Kannada
  | string  // Allow any language code

export type ModelVersion = 'PP-OCRv4' | 'PP-OCRv5'
export type ModelType = 'mobile' | 'server'

export interface WorkerConfig {
  numWorkers?: number
  workerPath?: string
  terminateOnIdle?: boolean
  idleTimeout?: number
  wasmPath?: string
}

export interface RapidOCRConfig {
  language: LanguageCode
  modelVersion?: ModelVersion
  modelType?: ModelType
  baseUrl?: string
  cacheModels?: boolean
  workerConfig?: WorkerConfig
  debug?: boolean
  onProgress?: (progress: any) => void
}

export interface PPUConfig {
  modelPath: string
  cacheModels?: boolean
  workerConfig?: WorkerConfig
  debug?: boolean
}

export type OCRConfig = RapidOCRConfig | PPUConfig