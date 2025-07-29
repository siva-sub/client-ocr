// Constants and configuration

export const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', models: ['PP-OCRv4', 'PP-OCRv5'] },
  'ch': { name: 'Chinese', models: ['PP-OCRv4', 'PP-OCRv5'] },
  'ja': { name: 'Japanese', models: ['PP-OCRv4', 'PP-OCRv5'] },
  'ko': { name: 'Korean', models: ['PP-OCRv4', 'PP-OCRv5'] },
  'fr': { name: 'French', models: ['PP-OCRv4'] },
  'de': { name: 'German', models: ['PP-OCRv4'] },
  'es': { name: 'Spanish', models: ['PP-OCRv4'] },
  'pt': { name: 'Portuguese', models: ['PP-OCRv4'] },
  'it': { name: 'Italian', models: ['PP-OCRv4'] },
  'ru': { name: 'Russian', models: ['PP-OCRv4'] },
  'ar': { name: 'Arabic', models: ['PP-OCRv4'] },
  'hi': { name: 'Hindi', models: ['PP-OCRv4'] },
  'vi': { name: 'Vietnamese', models: ['PP-OCRv4'] },
  'id': { name: 'Indonesian', models: ['PP-OCRv4'] },
  'fa': { name: 'Persian', models: ['PP-OCRv4'] },
  'ka': { name: 'Kannada', models: ['PP-OCRv4'] }
} as const

export const MODEL_URLS = {
  rapidocr: 'https://modelscope.cn/api/v1/models/liekkas/RapidOCR-Models/repo/files/master',
  ppu: '/models/ppu',
  local: '/models'
} as const

export const DEFAULT_CONFIG = {
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'mobile',
  cacheModels: true,
  preprocessConfig: {
    detectImageNetNorm: true,
    recStandardNorm: true,
    maxSideLen: 960
  },
  postprocessConfig: {
    unclipRatio: 2.0,
    boxThresh: 0.7,
    minBoxSize: 10
  }
} as const

export const PROCESSING_STAGES = {
  DOWNLOAD: 'download',
  INITIALIZE: 'initialize',
  DETECTION: 'detection',
  CLASSIFICATION: 'classification',
  RECOGNITION: 'recognition',
  POSTPROCESS: 'postprocess'
} as const

export const ERROR_CODES = {
  MODEL_DOWNLOAD_FAILED: 'MODEL_DOWNLOAD_FAILED',
  MODEL_LOAD_FAILED: 'MODEL_LOAD_FAILED',
  WORKER_INIT_FAILED: 'WORKER_INIT_FAILED',
  INVALID_IMAGE: 'INVALID_IMAGE',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  TIMEOUT: 'TIMEOUT',
  OUT_OF_MEMORY: 'OUT_OF_MEMORY',
  WEBGL_NOT_SUPPORTED: 'WEBGL_NOT_SUPPORTED',
  WORKER_NOT_SUPPORTED: 'WORKER_NOT_SUPPORTED',
  INVALID_LANGUAGE: 'INVALID_LANGUAGE',
  INVALID_MODEL: 'INVALID_MODEL',
  INVALID_CONFIG: 'INVALID_CONFIG'
} as const