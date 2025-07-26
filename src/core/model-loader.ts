import * as ort from 'onnxruntime-web'
import { getBasePath } from './config'

// Configure ONNX Runtime for the correct environment
const configureOnnxRuntime = () => {
  // Set the WASM paths to use the correct base URL
  const basePath = getBasePath()
  if (basePath) {
    // For GitHub Pages, we need to set the full URL
    ort.env.wasm.wasmPaths = window.location.origin + basePath + '/'
  }
  
  // Disable SIMD if causing issues
  ort.env.wasm.simd = true
  
  // Set number of threads
  ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 4)
}

// Initialize ONNX Runtime configuration
configureOnnxRuntime()

export interface ModelLoadOptions {
  modelPath: string
  executionProviders?: string[]
  graphOptimizationLevel?: 'disabled' | 'basic' | 'extended' | 'all'
}

export class ModelLoader {
  private sessionCache: Map<string, ort.InferenceSession> = new Map()
  
  async loadModel(options: ModelLoadOptions): Promise<ort.InferenceSession> {
    const { modelPath, executionProviders = ['webgl', 'wasm'], graphOptimizationLevel = 'all' } = options
    
    // Check cache first
    if (this.sessionCache.has(modelPath)) {
      return this.sessionCache.get(modelPath)!
    }
    
    // Try loading with each execution provider
    for (const provider of executionProviders) {
      try {
        const session = await ort.InferenceSession.create(modelPath, {
          executionProviders: [provider],
          graphOptimizationLevel
        })
        
        console.log(`Model loaded successfully with ${provider} backend: ${modelPath}`)
        this.sessionCache.set(modelPath, session)
        return session
      } catch (error) {
        console.warn(`Failed to load model with ${provider} backend:`, error)
      }
    }
    
    throw new Error(`Failed to load model with any backend: ${modelPath}`)
  }
  
  async preloadModels(modelPaths: string[]): Promise<void> {
    const loadPromises = modelPaths.map(path => 
      this.loadModel({ modelPath: path }).catch(error => {
        console.error(`Failed to preload model ${path}:`, error)
      })
    )
    
    await Promise.all(loadPromises)
  }
  
  clearCache(): void {
    this.sessionCache.clear()
  }
  
  getCachedModels(): string[] {
    return Array.from(this.sessionCache.keys())
  }
}