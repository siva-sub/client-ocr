import type { LayoutDetectionConfig } from '../core/layout-models'

export interface LayoutDetectionResult {
  boxes: number[][]
  classNames: string[]
  scores: number[]
}

let layoutWorker: Worker | null = null

export async function detectLayout(
  imageUrl: string,
  config: LayoutDetectionConfig
): Promise<LayoutDetectionResult> {
  return new Promise((resolve, reject) => {
    // Create worker if not exists
    if (!layoutWorker) {
      layoutWorker = new Worker(
        new URL('../workers/layout.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }

    // Convert image URL to ImageData
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Setup message handlers
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'initialized') {
          // Send image for detection
          layoutWorker!.postMessage({
            type: 'detect',
            imageData
          })
        } else if (event.data.type === 'result') {
          layoutWorker!.removeEventListener('message', handleMessage)
          resolve(event.data.result)
        } else if (event.data.type === 'error') {
          layoutWorker!.removeEventListener('message', handleMessage)
          reject(new Error(event.data.error))
        }
      }

      layoutWorker!.addEventListener('message', handleMessage)

      // Initialize model
      layoutWorker!.postMessage({
        type: 'init',
        config
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

export function disposeLayoutWorker() {
  if (layoutWorker) {
    layoutWorker.terminate()
    layoutWorker = null
  }
}