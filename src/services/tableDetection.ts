import type { TableDetectionConfig } from '../core/table-models'

export interface TableDetectionResult {
  html: string
  cellBboxes: number[][]
  logicPoints: number[][]
}

let tableWorker: Worker | null = null

export async function detectTable(
  imageUrl: string,
  config: TableDetectionConfig
): Promise<TableDetectionResult> {
  return new Promise((resolve, reject) => {
    // Create worker if not exists
    if (!tableWorker) {
      tableWorker = new Worker(
        new URL('../workers/table.worker.ts', import.meta.url),
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
          tableWorker!.postMessage({
            type: 'detect',
            imageData
          })
        } else if (event.data.type === 'result') {
          tableWorker!.removeEventListener('message', handleMessage)
          resolve(event.data.result)
        } else if (event.data.type === 'error') {
          tableWorker!.removeEventListener('message', handleMessage)
          reject(new Error(event.data.error))
        }
      }

      tableWorker!.addEventListener('message', handleMessage)

      // Initialize model
      tableWorker!.postMessage({
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

export function disposeTableWorker() {
  if (tableWorker) {
    tableWorker.terminate()
    tableWorker = null
  }
}