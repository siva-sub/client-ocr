import * as ort from 'onnxruntime-web'
import { isPPUModel, loadPPUDictionary } from './ppu-model-handler'

export interface MetaONNXModel {
  session: ort.InferenceSession
  metadata: {
    dictionary?: string[]
    shape?: number[]
    version?: string
    character?: string[]
  }
}

export class MetaONNXLoader {
  /**
   * Load an ONNX model and extract metadata if available
   */
  static async loadModel(modelPath: string): Promise<MetaONNXModel> {
    try {
      // Create session with appropriate providers
      const session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['webgl', 'wasm'],
        graphOptimizationLevel: 'all'
      })
      
      // Extract metadata
      const metadata = await this.extractMetadata(session)
      
      return {
        session,
        metadata
      }
    } catch (error) {
      console.error('Failed to load meta ONNX model:', error)
      throw error
    }
  }

  /**
   * Extract metadata from ONNX model
   */
  private static async extractMetadata(session: ort.InferenceSession): Promise<MetaONNXModel['metadata']> {
    const metadata: MetaONNXModel['metadata'] = {}
    
    try {
      // Try to get custom metadata map (RapidOCR style)
      const customMetadata = (session as any).handler?.artifacts?.onnxModel?.graph?.metadata_props
      
      if (customMetadata) {
        customMetadata.forEach((prop: any) => {
          if (prop.key === 'dictionary' && prop.value) {
            // Split dictionary by newlines and filter empty lines
            metadata.dictionary = prop.value.split('\n').filter((line: string) => line.length > 0)
            metadata.character = metadata.dictionary // Alias for compatibility
          } else if (prop.key === 'shape' && prop.value) {
            try {
              metadata.shape = JSON.parse(prop.value)
            } catch (e) {
              console.warn('Failed to parse shape metadata:', e)
            }
          } else if (prop.key === 'version' && prop.value) {
            metadata.version = prop.value
          }
        })
      }
      
      // Alternative method: Check model metadata
      const modelMetadata = (session as any).metadata
      if (modelMetadata?.customMetadataMap) {
        if (modelMetadata.customMetadataMap.dictionary) {
          metadata.dictionary = modelMetadata.customMetadataMap.dictionary.split('\n').filter((line: string) => line.length > 0)
          metadata.character = metadata.dictionary
        }
        if (modelMetadata.customMetadataMap.character) {
          metadata.character = modelMetadata.customMetadataMap.character.split('\n').filter((line: string) => line.length > 0)
          if (!metadata.dictionary) {
            metadata.dictionary = metadata.character
          }
        }
      }
    } catch (error) {
      console.warn('Failed to extract metadata from model:', error)
    }
    
    return metadata
  }

  /**
   * Check if a model has embedded dictionary
   */
  static hasEmbeddedDictionary(model: MetaONNXModel): boolean {
    return !!(model.metadata.dictionary && model.metadata.dictionary.length > 0)
  }

  /**
   * Get dictionary from model or fallback to external file
   */
  static async getDictionary(model: MetaONNXModel, fallbackDictPath?: string): Promise<string[]> {
    // Check if model has embedded dictionary
    if (this.hasEmbeddedDictionary(model)) {
      console.log('Using embedded dictionary from model metadata')
      return model.metadata.dictionary!
    }
    
    // Fallback to external dictionary file
    if (fallbackDictPath) {
      console.log('Loading external dictionary from:', fallbackDictPath)
      try {
        const response = await fetch(fallbackDictPath)
        const text = await response.text()
        
        // Use PPU-specific dictionary loading if this is a PPU model
        if (isPPUModel(fallbackDictPath)) {
          return loadPPUDictionary(text)
        }
        
        // For non-PPU models, filter empty lines
        return text.split('\n').filter(line => line.length > 0)
      } catch (error) {
        console.error('Failed to load external dictionary:', error)
        throw error
      }
    }
    
    throw new Error('No dictionary available: model has no embedded dictionary and no fallback path provided')
  }
}