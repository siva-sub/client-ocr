# RapidOCR Feature Implementation Plan for Client-OCR

## Analysis Summary

### RapidOCR Core Features:
1. **Multi-language support** (14+ languages)
2. **Meta ONNX models** with embedded dictionaries
3. **Text classification** for 180° rotation detection
4. **Batch processing** with aspect ratio sorting
5. **Configuration-based model selection**
6. **Automatic model downloading** with SHA256 verification
7. **Multiple inference engines** (ONNX, OpenVINO, Paddle, Torch)
8. **Word-level and single-character bounding boxes**
9. **Advanced preprocessing pipelines**
10. **Model versioning** (PP-OCRv4, PP-OCRv5)

### RapidOCRWeb Additional Features:
1. **Multi-language API** with language switching
2. **Web-based demo interface**
3. **Server deployment** with Flask/Waitress
4. **Image format validation**
5. **Token-based authentication**
6. **Model caching** with LRU cache
7. **Performance timing** for each stage
8. **Visualization** of detection results

### Current Client-OCR Limitations:
1. Fixed dictionary format without meta ONNX support
2. No text classification (rotation detection)
3. Single image processing (no batch)
4. Limited language support
5. No automatic model downloading
6. Basic preprocessing pipeline
7. No configuration system

## Implementation Plan

### Phase 1: Core Infrastructure Updates

#### 1.1 Meta ONNX Model Support
```typescript
// src/core/meta-onnx-loader.ts
interface MetaONNXModel {
  session: ort.InferenceSession
  metadata: {
    dictionary?: string[]
    shape?: number[]
    version?: string
  }
}

// Extract dictionary from model metadata
const extractMetadata = async (session: ort.InferenceSession) => {
  const metadata = session.metadata
  if (metadata?.dictionary) {
    return metadata.dictionary.split('\n')
  }
  return null
}
```

#### 1.2 Configuration System
```typescript
// src/core/ocr-config.ts
interface OCRConfig {
  global: {
    text_score: number
    use_det: boolean
    use_cls: boolean
    use_rec: boolean
    min_height: number
    width_height_ratio: number
  }
  det: {
    engine_type: 'onnxruntime'
    lang_type: string
    model_type: 'mobile' | 'server'
    ocr_version: 'PP-OCRv4' | 'PP-OCRv5'
    limit_side_len: number
    thresh: number
    box_thresh: number
    unclip_ratio: number
  }
  cls: {
    cls_batch_num: number
    cls_thresh: number
  }
  rec: {
    rec_batch_num: number
    rec_img_shape: [number, number, number]
  }
}
```

### Phase 2: Model Management

#### 2.1 Model Auto-Download
```typescript
// src/core/model-downloader.ts
interface ModelInfo {
  url: string
  sha256: string
  size: number
  localPath: string
}

class ModelDownloader {
  async downloadModel(modelInfo: ModelInfo): Promise<void> {
    // Check if model exists and verify SHA256
    // Download with progress tracking
    // Cache in IndexedDB or localStorage
  }
}
```

#### 2.2 Multi-Language Model Registry
```typescript
// src/core/language-models.ts
export const LANGUAGE_MODELS = {
  'ch': {
    name: 'Chinese',
    models: {
      det: 'ch_PP-OCRv4_det_infer.onnx',
      rec: 'ch_PP-OCRv4_rec_infer.onnx',
      cls: 'ch_ppocr_mobile_v2.0_cls_infer.onnx',
      dict: 'ppocr_keys_v1.txt'
    }
  },
  'en': {
    name: 'English',
    models: {
      det: 'en_PP-OCRv4_det_infer.onnx',
      rec: 'en_PP-OCRv4_rec_infer.onnx',
      cls: 'ch_ppocr_mobile_v2.0_cls_infer.onnx',
      dict: 'en_dict.txt'
    }
  },
  // ... other languages
}
```

### Phase 3: Processing Pipeline Updates

#### 3.1 Text Classification Worker
```typescript
// src/workers/classification.worker.ts
// Implement 180° rotation detection
const classifyText = async (images: ImageData[]) => {
  // Resize to [3, 48, 192]
  // Normalize with same pipeline as recognition
  // Run inference
  // Return rotation angles (0 or 180)
}
```

#### 3.2 Batch Processing
```typescript
// src/core/batch-processor.ts
class BatchProcessor {
  processBatch(images: ImageData[], batchSize: number = 6) {
    // Sort by aspect ratio
    const sorted = this.sortByAspectRatio(images)
    
    // Process in batches
    const batches = this.createBatches(sorted, batchSize)
    
    // Dynamic width calculation per batch
    return batches.map(batch => this.processSingleBatch(batch))
  }
}
```

#### 3.3 Updated Preprocessing
```typescript
// src/workers/detection.worker.ts
// Detection preprocessing with ImageNet normalization
const preprocessForDetection = (image: ImageData) => {
  // Resize maintaining aspect ratio
  // Apply ImageNet normalization:
  // mean = [0.485, 0.456, 0.406]
  // std = [0.229, 0.224, 0.225]
  // value = (pixel * scale - mean) / std
}

// src/workers/recognition.worker.ts
// Recognition preprocessing
const preprocessForRecognition = (image: ImageData) => {
  // Standard normalization:
  // value = (pixel / 255 - 0.5) / 0.5
}
```

### Phase 4: Advanced Features

#### 4.1 Word-Level Bounding Boxes
```typescript
// src/core/word-segmentation.ts
interface WordBox {
  text: string
  confidence: number
  box: number[][]
}

class WordSegmentation {
  getWordBoxes(text: string, charBoxes: number[][]): WordBox[] {
    // Implement word segmentation logic
    // Group characters into words
    // Calculate word bounding boxes
  }
}
```

#### 4.2 Model Version Management
```typescript
// src/core/model-versions.ts
export const MODEL_VERSIONS = {
  'PP-OCRv4': {
    det: { /* model configs */ },
    rec: { /* model configs */ },
    features: ['stable', 'multi-language']
  },
  'PP-OCRv5': {
    det: { /* model configs */ },
    rec: { /* model configs */ },
    features: ['latest', 'improved-accuracy']
  }
}
```

### Phase 5: UI/UX Enhancements

#### 5.1 Language Selector
```typescript
// src/ui/LanguageSelector.tsx
const LanguageSelector = () => {
  return (
    <Select value={language} onChange={handleLanguageChange}>
      <Option value="en">English</Option>
      <Option value="ch">Chinese</Option>
      <Option value="ja">Japanese</Option>
      {/* ... other languages */}
    </Select>
  )
}
```

#### 5.2 Performance Monitor Updates
```typescript
// src/ui/PerformanceMonitor.tsx
// Add timing for each stage:
// - Detection time
// - Classification time
// - Recognition time
// - Post-processing time
```

### Phase 6: API and Export Features

#### 6.1 OCR API Interface
```typescript
// src/api/ocr-api.ts
interface OCRRequest {
  image: Blob
  lang: string
  detect: boolean
  classify: boolean
  token?: string
}

interface OCRResponse {
  results: Array<{
    text: string
    confidence: number
    box: number[][]
  }>
  timing: {
    detect: number
    classify: number
    recognize: number
    total: number
  }
}
```

## Implementation Priority

1. **High Priority** (Week 1-2):
   - Meta ONNX support
   - Configuration system
   - Updated preprocessing pipelines
   - Text classification

2. **Medium Priority** (Week 3-4):
   - Multi-language support
   - Batch processing
   - Model auto-download
   - Word-level boxes

3. **Low Priority** (Week 5+):
   - Additional language models
   - Performance optimizations
   - Advanced UI features
   - API interface

## Testing Strategy

1. **Unit Tests**:
   - Model loading
   - Preprocessing functions
   - Dictionary extraction
   - Batch processing

2. **Integration Tests**:
   - Full OCR pipeline
   - Language switching
   - Model downloading

3. **Performance Tests**:
   - Batch vs single processing
   - Model loading times
   - Memory usage

4. **Accuracy Tests**:
   - Compare with RapidOCR outputs
   - Multi-language recognition
   - Rotation detection

## Migration Path

1. Keep existing functionality intact
2. Add new features behind feature flags
3. Gradual migration to new models
4. Maintain backward compatibility
5. Provide migration guides for users