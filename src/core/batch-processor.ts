import type { BoundingBox } from '../types/ocr.types'

export interface BatchItem<T> {
  index: number
  data: T
  aspectRatio: number
}

export interface ProcessBatchOptions {
  batchSize: number
  sortByAspectRatio: boolean
}

export class BatchProcessor {
  /**
   * Process items in batches with optional aspect ratio sorting
   */
  static async processBatch<T, R>(
    items: T[],
    processFunc: (batch: T[]) => Promise<R[]>,
    options: ProcessBatchOptions = { batchSize: 6, sortByAspectRatio: false },
    getAspectRatio?: (item: T) => number
  ): Promise<R[]> {
    // If sorting by aspect ratio, prepare sorted indices
    let sortedIndices: number[]
    if (options.sortByAspectRatio && getAspectRatio) {
      sortedIndices = this.sortByAspectRatio(items, getAspectRatio)
    } else {
      sortedIndices = items.map((_, i) => i)
    }
    
    // Process in batches
    const results: R[] = new Array(items.length)
    const { batchSize } = options
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batchIndices = sortedIndices.slice(i, i + batchSize)
      const batch = batchIndices.map(idx => items[idx])
      
      // Process batch
      const batchResults = await processFunc(batch)
      
      // Place results back in original order
      batchIndices.forEach((originalIdx, batchIdx) => {
        results[originalIdx] = batchResults[batchIdx]
      })
    }
    
    return results
  }
  
  /**
   * Sort items by aspect ratio and return sorted indices
   */
  static sortByAspectRatio<T>(items: T[], getAspectRatio: (item: T) => number): number[] {
    const ratios = items.map((item, index) => ({
      index,
      ratio: getAspectRatio(item)
    }))
    
    // Sort by aspect ratio
    ratios.sort((a, b) => a.ratio - b.ratio)
    
    return ratios.map(r => r.index)
  }
  
  /**
   * Get aspect ratio from bounding box
   */
  static getBoxAspectRatio(box: BoundingBox): number {
    const width = Math.max(
      Math.abs(box.topRight.x - box.topLeft.x),
      Math.abs(box.bottomRight.x - box.bottomLeft.x)
    )
    const height = Math.max(
      Math.abs(box.bottomLeft.y - box.topLeft.y),
      Math.abs(box.bottomRight.y - box.topRight.y)
    )
    return width / height
  }
  
  /**
   * Calculate max aspect ratio in a batch of boxes
   */
  static getMaxAspectRatio(boxes: BoundingBox[]): number {
    return Math.max(...boxes.map(box => this.getBoxAspectRatio(box)))
  }
  
  /**
   * Group items into batches with similar aspect ratios
   */
  static groupBySimilarAspectRatio<T>(
    items: T[],
    getAspectRatio: (item: T) => number,
    maxBatchSize: number = 6,
    ratioThreshold: number = 2.0
  ): T[][] {
    // Sort by aspect ratio
    const sorted = items.map((item, index) => ({
      item,
      index,
      ratio: getAspectRatio(item)
    })).sort((a, b) => a.ratio - b.ratio)
    
    const batches: T[][] = []
    let currentBatch: T[] = []
    let baseRatio = sorted[0]?.ratio || 1
    
    for (const { item, ratio } of sorted) {
      // Check if ratio difference is too large or batch is full
      if (currentBatch.length > 0 && 
          (ratio / baseRatio > ratioThreshold || currentBatch.length >= maxBatchSize)) {
        batches.push(currentBatch)
        currentBatch = []
        baseRatio = ratio
      }
      
      currentBatch.push(item)
    }
    
    if (currentBatch.length > 0) {
      batches.push(currentBatch)
    }
    
    return batches
  }
  
  /**
   * Process images in parallel batches
   */
  static async processImagesInBatches(
    images: Array<{ data: Uint8ClampedArray; width: number; height: number }>,
    processFunc: (batch: typeof images) => Promise<any[]>,
    batchSize: number = 6
  ): Promise<any[]> {
    const getAspectRatio = (img: typeof images[0]) => img.width / img.height
    
    return this.processBatch(
      images,
      processFunc,
      { batchSize, sortByAspectRatio: true },
      getAspectRatio
    )
  }
}