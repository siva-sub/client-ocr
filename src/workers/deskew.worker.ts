import type { WorkerMessage } from '../types/ocr.types'
import { DeskewService } from '../core/deskew.service'

const deskewService = new DeskewService()

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'PROCESS':
      try {
        const { imageData, width, height } = data
        
        // Create ImageData object
        const imgData = new ImageData(
          new Uint8ClampedArray(imageData),
          width,
          height
        )
        
        // Perform deskew
        const result = await deskewService.deskewImage(imgData)
        
        // Send back the deskewed image data
        const transferBuffer = result.imageData.data.buffer;
        (self as any).postMessage({ 
          type: 'RESULT', 
          data: {
            imageData: transferBuffer,
            width: result.imageData.width,
            height: result.imageData.height,
            angle: result.angle
          }
        }, [transferBuffer])
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: (error as Error).message })
      }
      break
  }
})