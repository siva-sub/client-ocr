// Unified model registry for all OCR, table, and layout models

export interface ModelSource {
  type: 'remote' | 'local'
  url?: string
  path?: string
  sha256?: string
}

export interface RegisteredModel {
  id: string
  name: string
  category: 'ocr-det' | 'ocr-rec' | 'ocr-cls' | 'table' | 'layout'
  version: string
  source: ModelSource
  description: string
  size?: string
  metadata?: Record<string, any>
}

// Model paths - always use GitHub Pages URL for consistency
const LOCAL_MODEL_BASE = 'https://siva-sub.github.io/client-ocr/models'

// Register all available models
export const MODEL_REGISTRY: RegisteredModel[] = [
  // ===== OCR Detection Models =====
  // Local OnnxOCR models
  {
    id: 'onnxocr-ppv2-det',
    name: 'PP-OCRv2 Server Detection',
    category: 'ocr-det',
    version: 'v2.0',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ch_ppocr_server_v2.0/det/det.onnx`
    },
    description: 'OnnxOCR PP-OCRv2 server detection model',
    size: '47MB'
  },
  {
    id: 'onnxocr-ppv4-det',
    name: 'PP-OCRv4 Detection',
    category: 'ocr-det',
    version: 'v4',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv4/det/det.onnx`
    },
    description: 'OnnxOCR PP-OCRv4 detection model',
    size: '4.2MB'
  },
  {
    id: 'onnxocr-ppv5-det',
    name: 'PP-OCRv5 Detection',
    category: 'ocr-det',
    version: 'v5',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv5/det/det.onnx`
    },
    description: 'OnnxOCR PP-OCRv5 detection model',
    size: '4.0MB'
  },
  
  // Local ppu-paddle-ocr models
  {
    id: 'ppu-ppv5-det',
    name: 'PP-OCRv5 Mobile Detection',
    category: 'ocr-det',
    version: 'v5',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/ppu-paddle-ocr/PP-OCRv5_mobile_det_infer.onnx`
    },
    description: 'PPU Paddle OCR v5 mobile detection model',
    size: '2.8MB'
  },

  // ===== OCR Recognition Models =====
  // Local OnnxOCR models
  {
    id: 'onnxocr-ppv4-rec',
    name: 'PP-OCRv4 Recognition',
    category: 'ocr-rec',
    version: 'v4',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv4/rec/rec.onnx`
    },
    description: 'OnnxOCR PP-OCRv4 recognition model',
    size: '8.8MB',
    metadata: {
      dictPath: `${LOCAL_MODEL_BASE}/onnxocr/ppocr_keys_v1.txt`
    }
  },
  {
    id: 'onnxocr-ppv5-rec',
    name: 'PP-OCRv5 Recognition',
    category: 'ocr-rec',
    version: 'v5',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv5/rec/rec.onnx`
    },
    description: 'OnnxOCR PP-OCRv5 recognition model',
    size: '10.2MB',
    metadata: {
      dictPath: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv5/ppocrv5_dict.txt`
    }
  },
  
  // Local ppu-paddle-ocr models
  {
    id: 'ppu-ppv4-rec-en',
    name: 'PP-OCRv4 English Recognition',
    category: 'ocr-rec',
    version: 'v4',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/ppu-paddle-ocr/en_PP-OCRv4_mobile_rec_infer.onnx`
    },
    description: 'PPU Paddle OCR v4 English recognition model',
    size: '2.8MB',
    metadata: {
      dictPath: `${LOCAL_MODEL_BASE}/ppu-paddle-ocr/en_dict.txt`
    }
  },

  // ===== OCR Classification Models =====
  // Local OnnxOCR models
  {
    id: 'onnxocr-ppv2-cls',
    name: 'PP-OCRv2 Classification',
    category: 'ocr-cls',
    version: 'v2.0',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ch_ppocr_server_v2.0/cls/cls.onnx`
    },
    description: 'OnnxOCR text direction classification model',
    size: '1.4MB'
  },
  {
    id: 'onnxocr-ppv4-cls',
    name: 'PP-OCRv4 Classification',
    category: 'ocr-cls',
    version: 'v4',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv4/cls/cls.onnx`
    },
    description: 'OnnxOCR PP-OCRv4 classification model',
    size: '1.4MB'
  },
  {
    id: 'onnxocr-ppv5-cls',
    name: 'PP-OCRv5 Classification',
    category: 'ocr-cls',
    version: 'v5',
    source: {
      type: 'local',
      path: `${LOCAL_MODEL_BASE}/onnxocr/ppocrv5/cls/cls.onnx`
    },
    description: 'OnnxOCR PP-OCRv5 classification model',
    size: '1.4MB'
  }
]

// Helper functions
export function getModelById(id: string): RegisteredModel | undefined {
  return MODEL_REGISTRY.find(model => model.id === id)
}

export function getModelsByCategory(category: RegisteredModel['category']): RegisteredModel[] {
  return MODEL_REGISTRY.filter(model => model.category === category)
}

export function getLocalModels(): RegisteredModel[] {
  return MODEL_REGISTRY.filter(model => model.source.type === 'local')
}

export function getRemoteModels(): RegisteredModel[] {
  return MODEL_REGISTRY.filter(model => model.source.type === 'remote')
}

// Model URL resolver
export function resolveModelUrl(model: RegisteredModel): string {
  if (model.source.type === 'local' && model.source.path) {
    // For local models, return the path as-is (will be served from public directory)
    return model.source.path
  } else if (model.source.type === 'remote' && model.source.url) {
    return model.source.url
  }
  throw new Error(`Cannot resolve URL for model: ${model.id}`)
}