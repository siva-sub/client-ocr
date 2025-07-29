import { RapidOCREngine } from './rapid-ocr-engine'
import type { RapidOCRConfig, PPUConfig, OCRConfig } from '../types/config.types'

/**
 * Creates a RapidOCR engine instance
 */
export function createRapidOCREngine(config: RapidOCRConfig): RapidOCREngine {
  return new RapidOCREngine(config)
}

/**
 * Creates a PPU PaddleOCR engine instance
 */
export function createPPUEngine(config: PPUConfig): RapidOCREngine {
  // PPU uses RapidOCREngine with specific configuration
  return new RapidOCREngine({
    language: 'en',
    modelVersion: 'PP-OCRv4',
    modelType: 'mobile',
    baseUrl: config.modelPath,
    cacheModels: config.cacheModels,
    workerConfig: config.workerConfig,
    isPPUModel: true
  } as RapidOCRConfig & { isPPUModel: boolean })
}

/**
 * Generic factory that creates appropriate engine based on config
 */
export function createOCREngine(config: OCRConfig): RapidOCREngine {
  if ('modelPath' in config) {
    return createPPUEngine(config as PPUConfig)
  }
  return createRapidOCREngine(config as RapidOCRConfig)
}