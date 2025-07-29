// Custom model configuration that overrides RapidOCR's default model URLs
import { getModelById } from './model-registry'

export interface CustomModelUrls {
  det: string
  rec: string
  cls?: string
  dictUrl?: string
}

export function getCustomModelUrls(detModelId: string, recModelId: string, clsModelId?: string): CustomModelUrls | null {
  const detModel = getModelById(detModelId)
  const recModel = getModelById(recModelId)
  const clsModel = clsModelId ? getModelById(clsModelId) : null

  if (!detModel || !recModel) {
    return null
  }

  // Resolve URLs based on source type
  const detUrl = detModel.source.type === 'local' && detModel.source.path
    ? detModel.source.path
    : detModel.source.url || ''

  const recUrl = recModel.source.type === 'local' && recModel.source.path
    ? recModel.source.path
    : recModel.source.url || ''

  const clsUrl = clsModel && (clsModel.source.type === 'local' && clsModel.source.path
    ? clsModel.source.path
    : clsModel.source.url)

  // Get dictionary URL from metadata
  const dictUrl = recModel.metadata?.dictPath

  return {
    det: detUrl,
    rec: recUrl,
    cls: clsUrl || undefined,
    dictUrl
  }
}

// Override the model URLs in RapidOCR workers
export function overrideWorkerModelUrls() {
  // This would need to be implemented in the workers
  // For now, we'll use a different approach
}

// Map our model selections to RapidOCR's expected format
export function mapToRapidOCRConfig(detModelId: string, recModelId: string): any {
  // PPU models map to specific language/version combinations
  if (detModelId === 'ppu-ppv5-det' && recModelId === 'ppu-ppv4-rec-en') {
    return {
      lang: 'en',
      version: 'PP-OCRv4',
      modelType: 'mobile'
    }
  }
  
  // Default mapping
  return {
    lang: 'en',
    version: 'PP-OCRv4',
    modelType: 'mobile'
  }
}