import { getModelPath } from './config'

export interface ModelConfig {
  id: string
  name: string
  description: string
  type: 'mobile' | 'server'
  version: string
  paths: {
    detection: string
    recognition: string
    classification: string
    dictionary: string
  }
  sizes: {
    detection: string
    recognition: string
    classification: string
  }
  accuracy: 'low' | 'medium' | 'high' | 'very-high'
  speed: 'very-fast' | 'fast' | 'medium' | 'slow'
  languages: string[]
}

export const MODEL_CONFIGS: ModelConfig[] = [
  {
    id: 'ppocrv5-mobile',
    name: 'PaddleOCR v5 Mobile',
    description: 'Latest mobile model - Fast inference, good accuracy',
    type: 'mobile',
    version: 'v5',
    paths: {
      detection: getModelPath('/models/ppocrv5/det.onnx'),
      recognition: getModelPath('/models/ppocrv5/rec.onnx'),
      classification: getModelPath('/models/ppocrv5/cls.onnx'),
      dictionary: getModelPath('/models/ppocrv5/dict.txt')
    },
    sizes: {
      detection: '4.6MB',
      recognition: '16MB',
      classification: '570KB'
    },
    accuracy: 'high',
    speed: 'fast',
    languages: ['en', 'zh']
  },
  {
    id: 'ppocrv4-mobile',
    name: 'PaddleOCR v4 Mobile',
    description: 'Stable mobile model - Balanced performance',
    type: 'mobile',
    version: 'v4',
    paths: {
      detection: getModelPath('/models/ppocrv4/det.onnx'),
      recognition: getModelPath('/models/ppocrv4/rec.onnx'),
      classification: getModelPath('/models/ppocrv4/cls.onnx'),
      dictionary: getModelPath('/models/ppocrv4/dict.txt')
    },
    sizes: {
      detection: '4.6MB',
      recognition: '10.8MB',
      classification: '583KB'
    },
    accuracy: 'medium',
    speed: 'fast',
    languages: ['en', 'zh']
  },
  {
    id: 'ppocrv2-server',
    name: 'PaddleOCR v2 Server (Detection Only)',
    description: 'High accuracy server model for text detection - No recognition model available',
    type: 'server',
    version: 'v2',
    paths: {
      detection: getModelPath('/models/ppocrv2-server/det.onnx'),
      recognition: getModelPath('/models/ppocrv4/rec.onnx'), // Fallback to v4 mobile rec
      classification: getModelPath('/models/ppocrv2-server/cls.onnx'),
      dictionary: getModelPath('/models/ppocrv2-server/dict.txt')
    },
    sizes: {
      detection: '47MB',
      recognition: '10.8MB (v4)',
      classification: '583KB'
    },
    accuracy: 'very-high',
    speed: 'slow',
    languages: ['zh']
  },
  {
    id: 'en-mobile',
    name: 'English Mobile (v5 det + v4 rec)',
    description: 'Optimized for English text - Very fast',
    type: 'mobile',
    version: 'v5/v4',
    paths: {
      detection: getModelPath('/models/en-mobile/det.onnx'),
      recognition: getModelPath('/models/en-mobile/rec.onnx'),
      classification: getModelPath('/models/en-mobile/cls.onnx'),
      dictionary: getModelPath('/models/en-mobile/dict.txt')
    },
    sizes: {
      detection: '4.7MB',
      recognition: '8.6MB',
      classification: '583KB'
    },
    accuracy: 'medium',
    speed: 'very-fast',
    languages: ['en']
  }
]

export function getModelConfig(id: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find(config => config.id === id)
}

export function getDefaultModelId(): string {
  // Default to en-mobile which is selected in the logs
  return 'en-mobile'
}