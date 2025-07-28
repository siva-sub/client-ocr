import type { LangType, OCRVersion, ModelType } from './ocr-config'
import { getLanguageModelPaths, extractModelInfo } from './language-models'

export interface ModelDownloadInfo {
  url: string
  sha256?: string
  size?: number
  localPath: string
  dictUrl?: string
}

export interface DownloadProgress {
  modelName: string
  progress: number
  total: number
  status: 'downloading' | 'verifying' | 'complete' | 'error'
}

export class ModelDownloader {
  private cache: Map<string, ArrayBuffer> = new Map()
  private downloadQueue: Map<string, Promise<ArrayBuffer>> = new Map()
  private onProgress?: (progress: DownloadProgress) => void
  
  constructor() {
    this.initializeCache()
  }
  
  private async initializeCache() {
    // Try to load cached models from IndexedDB
    if ('indexedDB' in window) {
      try {
        const db = await this.openDB()
        const tx = db.transaction(['models'], 'readonly')
        const store = tx.objectStore('models')
        const keys = await new Promise<string[]>((resolve, reject) => {
          const req = store.getAllKeys()
          req.onsuccess = () => resolve(req.result as string[])
          req.onerror = () => reject(req.error)
        })
        
        for (const key of keys) {
          const data = await new Promise<ArrayBuffer>((resolve, reject) => {
            const req = store.get(key)
            req.onsuccess = () => resolve(req.result)
            req.onerror = () => reject(req.error)
          })
          if (data) {
            this.cache.set(key, data)
          }
        }
      } catch (error) {
        console.warn('Failed to load model cache:', error)
      }
    }
  }
  
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('rapidocr-models', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models')
        }
      }
    })
  }
  
  private async saveToCache(key: string, data: ArrayBuffer) {
    // Save to memory cache
    this.cache.set(key, data)
    
    // Try to save to IndexedDB
    if ('indexedDB' in window) {
      try {
        const db = await this.openDB()
        const tx = db.transaction(['models'], 'readwrite')
        const store = tx.objectStore('models')
        await new Promise<void>((resolve, reject) => {
          const req = store.put(data, key)
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
        })
      } catch (error) {
        console.warn('Failed to save model to cache:', error)
      }
    }
  }
  
  async downloadModel(modelInfo: ModelDownloadInfo): Promise<ArrayBuffer> {
    // Check memory cache
    if (this.cache.has(modelInfo.localPath)) {
      return this.cache.get(modelInfo.localPath)!
    }
    
    // Check if already downloading
    if (this.downloadQueue.has(modelInfo.localPath)) {
      return this.downloadQueue.get(modelInfo.localPath)!
    }
    
    // Start download
    const downloadPromise = this.performDownload(modelInfo)
    this.downloadQueue.set(modelInfo.localPath, downloadPromise)
    
    try {
      const data = await downloadPromise
      await this.saveToCache(modelInfo.localPath, data)
      return data
    } finally {
      this.downloadQueue.delete(modelInfo.localPath)
    }
  }
  
  private async performDownload(modelInfo: ModelDownloadInfo): Promise<ArrayBuffer> {
    const modelName = modelInfo.localPath.split('/').pop() || 'model'
    
    try {
      // Try primary URL first
      this.reportProgress({
        modelName,
        progress: 0,
        total: modelInfo.size || 0,
        status: 'downloading'
      })
      
      const response = await fetch(modelInfo.url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Get total size
      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : modelInfo.size || 0
      
      // Read response with progress
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }
      
      const chunks: Uint8Array[] = []
      let received = 0
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        chunks.push(value)
        received += value.length
        
        this.reportProgress({
          modelName,
          progress: received,
          total,
          status: 'downloading'
        })
      }
      
      // Combine chunks
      const data = new Uint8Array(received)
      let position = 0
      for (const chunk of chunks) {
        data.set(chunk, position)
        position += chunk.length
      }
      
      // Verify if SHA256 provided
      if (modelInfo.sha256) {
        this.reportProgress({
          modelName,
          progress: received,
          total,
          status: 'verifying'
        })
        
        const isValid = await this.verifySHA256(data, modelInfo.sha256)
        if (!isValid) {
          throw new Error('SHA256 verification failed')
        }
      }
      
      this.reportProgress({
        modelName,
        progress: received,
        total,
        status: 'complete'
      })
      
      return data.buffer
    } catch (error) {
      this.reportProgress({
        modelName,
        progress: 0,
        total: 0,
        status: 'error'
      })
      throw error
    }
  }
  
  private async verifySHA256(data: Uint8Array, expectedHash: string): Promise<boolean> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex === expectedHash.toLowerCase()
  }
  
  setProgressCallback(callback: (progress: DownloadProgress) => void) {
    this.onProgress = callback
  }
  
  private reportProgress(progress: DownloadProgress) {
    if (this.onProgress) {
      this.onProgress(progress)
    }
  }
  
  // Get model URLs for specific language and configuration
  async getModelUrls(
    lang: LangType,
    version: OCRVersion,
    modelType: ModelType
  ): Promise<{
    det?: ModelDownloadInfo
    rec?: ModelDownloadInfo
    cls?: ModelDownloadInfo
    dict?: ModelDownloadInfo
  }> {
    const paths = getLanguageModelPaths(lang, version, modelType)
    const result: any = {}
    
    if (paths.det) {
      const modelInfo = extractModelInfo(paths.det)
      result.det = {
        url: modelInfo.url,
        sha256: modelInfo.sha256,
        localPath: modelInfo.url.split('/').pop() || 'det.onnx',
        size: this.estimateModelSize('det', modelType)
      }
    }
    
    if (paths.rec) {
      const modelInfo = extractModelInfo(paths.rec)
      result.rec = {
        url: modelInfo.url,
        sha256: modelInfo.sha256,
        dictUrl: modelInfo.dictUrl,
        localPath: modelInfo.url.split('/').pop() || 'rec.onnx',
        size: this.estimateModelSize('rec', modelType)
      }
    }
    
    if (paths.cls) {
      const modelInfo = extractModelInfo(paths.cls)
      result.cls = {
        url: modelInfo.url,
        sha256: modelInfo.sha256,
        localPath: modelInfo.url.split('/').pop() || 'cls.onnx',
        size: this.estimateModelSize('cls', modelType)
      }
    }
    
    if (paths.dict) {
      // Dictionary URLs are typically included with recognition models
      const recInfo = paths.rec ? extractModelInfo(paths.rec) : null
      if (recInfo?.dictUrl) {
        result.dict = {
          url: recInfo.dictUrl,
          localPath: recInfo.dictUrl.split('/').pop() || 'dict.txt',
          size: 100 * 1024 // ~100KB for dictionaries
        }
      }
    }
    
    return result
  }
  
  private estimateModelSize(modelType: 'det' | 'rec' | 'cls', variant: ModelType): number {
    // Rough estimates based on model type
    const sizes = {
      det: {
        mobile: 3 * 1024 * 1024,   // ~3MB
        server: 47 * 1024 * 1024   // ~47MB
      },
      rec: {
        mobile: 12 * 1024 * 1024,  // ~12MB
        server: 100 * 1024 * 1024  // ~100MB
      },
      cls: {
        mobile: 1.5 * 1024 * 1024, // ~1.5MB
        server: 1.5 * 1024 * 1024  // Same for cls
      }
    }
    
    return sizes[modelType]?.[variant] || 10 * 1024 * 1024
  }
  
  // Check if models are cached
  async areModelsCached(
    lang: LangType,
    version: OCRVersion,
    modelType: ModelType
  ): Promise<boolean> {
    const paths = getLanguageModelPaths(lang, version, modelType)
    
    const requiredPaths = [
      paths.det,
      paths.rec,
      paths.cls
    ].filter(p => p !== undefined)
    
    for (const path of requiredPaths) {
      const modelInfo = extractModelInfo(path!)
      const pathStr = modelInfo.url
      if (!this.cache.has(pathStr)) {
        return false
      }
    }
    
    return true
  }
  
  // Clear cache
  async clearCache() {
    this.cache.clear()
    
    if ('indexedDB' in window) {
      try {
        const db = await this.openDB()
        const tx = db.transaction(['models'], 'readwrite')
        const store = tx.objectStore('models')
        await new Promise<void>((resolve, reject) => {
          const req = store.clear()
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
        })
      } catch (error) {
        console.warn('Failed to clear cache:', error)
      }
    }
  }
  
  // Get cache size
  async getCacheSize(): Promise<number> {
    let totalSize = 0
    
    for (const data of this.cache.values()) {
      totalSize += data.byteLength
    }
    
    return totalSize
  }
  
  // Download dictionary file as text
  async downloadDictionary(dictUrl: string): Promise<string[]> {
    try {
      const response = await fetch(dictUrl)
      if (!response.ok) {
        throw new Error(`Failed to download dictionary: ${response.status}`)
      }
      
      const text = await response.text()
      return text.split('\n').filter(line => line.length > 0)
    } catch (error) {
      console.error('Failed to download dictionary:', error)
      // Return empty array as fallback
      return []
    }
  }
  
  // Download all models for a language
  async downloadLanguageModels(
    lang: LangType,
    version: OCRVersion = 'PP-OCRv4',
    modelType: ModelType = 'mobile',
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<{
    det?: ArrayBuffer
    rec?: ArrayBuffer
    cls?: ArrayBuffer
    dict?: string[]
  }> {
    if (onProgress) {
      this.setProgressCallback(onProgress)
    }
    
    const modelUrls = await this.getModelUrls(lang, version, modelType)
    const result: any = {}
    
    // Download models in parallel
    const downloads: Promise<void>[] = []
    
    if (modelUrls.det) {
      downloads.push(
        this.downloadModel(modelUrls.det).then(data => {
          result.det = data
        })
      )
    }
    
    if (modelUrls.rec) {
      downloads.push(
        this.downloadModel(modelUrls.rec).then(data => {
          result.rec = data
        })
      )
    }
    
    if (modelUrls.cls) {
      downloads.push(
        this.downloadModel(modelUrls.cls).then(data => {
          result.cls = data
        })
      )
    }
    
    if (modelUrls.dict) {
      downloads.push(
        this.downloadDictionary(modelUrls.dict.url).then(data => {
          result.dict = data
        })
      )
    }
    
    await Promise.all(downloads)
    
    return result
  }
}