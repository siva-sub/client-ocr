# OCR Model Documentation

## Overview

Client-Side OCR supports multiple model architectures and sources, providing flexibility for different use cases and languages. This document details the available models, their characteristics, and usage guidelines.

## Model Sources

### 1. RapidOCR Models
- **Source**: [RapidAI/RapidOCR](https://github.com/RapidAI/RapidOCR)
- **Languages**: 14+ languages
- **Versions**: PP-OCRv4, PP-OCRv5
- **Types**: Mobile (fast) and Server (accurate)
- **Hosting**: ModelScope CDN

### 2. PPU PaddleOCR Models
- **Source**: [PT-Perkasa-Pilar-Utama/ppu-paddle-ocr](https://github.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr)
- **Languages**: English
- **Versions**: PP-OCRv4, PP-OCRv5
- **Special**: Custom preprocessing requirements

## Model Architecture

### Detection Models (Text Localization)

**Purpose**: Locate text regions in images

| Model | Algorithm | Input Size | Features |
|-------|-----------|------------|----------|
| det_mobile | DB | Dynamic | Fast, lightweight |
| det_server | DB++ | Dynamic | Higher accuracy |

**Technical Details:**
- **Algorithm**: Differentiable Binarization (DB)
- **Normalization**: ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- **Output**: Binary segmentation map
- **Post-processing**: Contour extraction with unclip expansion

### Recognition Models (Text Recognition)

**Purpose**: Convert text regions to characters

| Model | Architecture | Dictionary | Max Width |
|-------|--------------|------------|-----------|
| rec_mobile | CRNN-CTC | Embedded | Dynamic |
| rec_server | CRNN-CTC | Embedded | Dynamic |
| ppu_rec | CRNN-CTC | External | 800px |

**Technical Details:**
- **Architecture**: CNN + RNN + CTC
- **Input**: Variable width, fixed height (48px)
- **Normalization**: 
  - RapidOCR: `(pixel/255 - 0.5) / 0.5`
  - PPU: Red channel only, same formula
- **Output**: Character probability sequence

### Classification Models (Orientation Detection)

**Purpose**: Detect text rotation (0° or 180°)

| Model | Size | Accuracy | Use Case |
|-------|------|----------|----------|
| cls_mobile | 0.5MB | 95%+ | Auto-rotation |

**Technical Details:**
- **Input**: Fixed size 192x48
- **Output**: 2-class probability (0°, 180°)
- **Threshold**: 0.9 for rotation decision

## Language Support Matrix

### Tier 1 - Full Support (All Models)

| Language | Code | Script | PP-OCRv4 | PP-OCRv5 | Notes |
|----------|------|--------|----------|----------|-------|
| Chinese | ch | Han | ✅ | ✅ | Simplified & Traditional |
| English | en | Latin | ✅ | ✅ | Full punctuation |
| Japanese | ja | Mixed | ✅ | ✅ | Hiragana, Katakana, Kanji |
| Korean | ko | Hangul | ✅ | ✅ | Complete syllables |

### Tier 2 - RapidOCR Only

| Language | Code | Script | PP-OCRv4 | PP-OCRv5 | Notes |
|----------|------|--------|----------|----------|-------|
| French | fr | Latin | ✅ | ❌ | Accents supported |
| German | de | Latin | ✅ | ❌ | Umlauts supported |
| Spanish | es | Latin | ✅ | ❌ | Tildes supported |
| Portuguese | pt | Latin | ✅ | ❌ | PT-BR & PT-PT |
| Italian | it | Latin | ✅ | ❌ | Full support |
| Russian | ru | Cyrillic | ✅ | ❌ | Complete alphabet |
| Vietnamese | vi | Latin | ✅ | ❌ | Tone marks |
| Indonesian | id | Latin | ✅ | ❌ | Standard Latin |
| Persian | fa | Arabic | ✅ | ❌ | RTL support |
| Kannada | ka | Kannada | ✅ | ❌ | Indic script |

### Tier 3 - Extended Support

Additional 80+ languages available through RapidOCR community models, including:
- Arabic (ar)
- Hindi (hi)
- Tamil (ta)
- Thai (th)
- Turkish (tr)
- Dutch (nl)
- Polish (pl)
- And many more...

## Model Selection Guide

### By Use Case

| Use Case | Recommended Model | Configuration |
|----------|------------------|---------------|
| **Real-time scanning** | PP-OCRv4 Mobile | Fast processing |
| **Document archival** | PP-OCRv5 Server | Best accuracy |
| **Mobile web app** | PP-OCRv4 Mobile | Low bandwidth |
| **Multi-language** | PP-OCRv4 Server | Broad support |
| **English only** | PPU Models | Optimized |

### By Performance Requirements

```typescript
// Fastest (300-500ms)
const fast = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'mobile'
});

// Balanced (500-1000ms)
const balanced = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv5',
  modelType: 'mobile'
});

// Most Accurate (1000-2000ms)
const accurate = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv5',
  modelType: 'server'
});
```

## Model Files and Sizes

### RapidOCR Model Package

```
models/
├── det_mobile.onnx          # 4.6MB - Detection
├── rec_mobile.onnx          # 8.6MB - Recognition  
├── cls_mobile.onnx          # 0.5MB - Classification
├── det_server.onnx          # 4.7MB - Detection (server)
├── rec_server.onnx          # 17.2MB - Recognition (server)
└── ppocr_keys_v1.txt        # 37KB - Dictionary (if external)
```

### PPU Model Package

```
models/ppu/
├── ch_PP-OCRv4_det.onnx    # 4.4MB - Detection
├── ch_PP-OCRv4_rec.onnx    # 10.7MB - Recognition
├── ch_ppocr_cls.onnx       # 0.5MB - Classification
└── ppocr_keys_v1.txt       # 37KB - Dictionary
```

### Total Download Sizes

| Configuration | Initial Download | Cached Size |
|--------------|------------------|-------------|
| RapidOCR Mobile | ~14MB | ~14MB |
| RapidOCR Server | ~23MB | ~23MB |
| PPU English | ~16MB | ~16MB |
| All Models | ~53MB | ~53MB |

## Model Preprocessing Requirements

### RapidOCR Models

```typescript
// Detection preprocessing
const detectPreprocess = {
  normalization: 'imagenet',
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225],
  resizeMode: 'multiple_of_32',
  maxSideLen: 960
};

// Recognition preprocessing  
const recPreprocess = {
  normalization: 'standard',
  formula: '(pixel/255 - 0.5) / 0.5',
  targetHeight: 48,
  dynamicWidth: true,
  channelOrder: 'CHW'
};
```

### PPU Models

```typescript
// PPU-specific preprocessing
const ppuPreprocess = {
  grayscale: 'red_channel_only',  // Critical difference!
  normalization: 'standard',
  formula: '(red/255 - 0.5) / 0.5',
  targetHeight: 48,
  maxWidth: 800,  // Prevent memory issues
  dictionaryIndexing: '0-based'  // Not 1-based
};
```

## Model Metadata

### Meta ONNX Format

Models use Meta ONNX format to embed dictionaries:

```python
# Model metadata structure
metadata = {
  'dictionary': 'base64_encoded_dictionary',
  'character_count': 6625,
  'blank_token_index': 0,
  'language': 'en',
  'version': 'PP-OCRv4'
}
```

### Extracting Dictionary

```typescript
import { MetaONNXLoader } from 'client-side-ocr';

const model = await MetaONNXLoader.loadModel(modelPath);
if (MetaONNXLoader.hasEmbeddedDictionary(model)) {
  const dictionary = await MetaONNXLoader.getDictionary(model);
  console.log(`Dictionary size: ${dictionary.length} characters`);
}
```

## Model Updates and Versioning

### Version History

| Version | Release | Major Changes |
|---------|---------|---------------|
| PP-OCRv4 | 2023 | Improved accuracy, smaller models |
| PP-OCRv5 | 2024 | Better multi-language, faster |

### Checking for Updates

```typescript
// Check model versions
const modelInfo = await ocr.getModelInfo();
console.log('Current model:', modelInfo.version);
console.log('Available updates:', modelInfo.updates);
```

### Updating Models

```typescript
// Clear old cache and download new models
await ocr.clearCache();
await ocr.updateModels({
  version: 'PP-OCRv5',
  onProgress: (progress) => {
    console.log(`Updating: ${progress.percent}%`);
  }
});
```

## Custom Model Integration

### Using Custom ONNX Models

```typescript
const customOCR = createRapidOCREngine({
  customModels: {
    detection: {
      url: '/models/custom_det.onnx',
      preprocessor: 'imagenet',
      postprocessor: 'db'
    },
    recognition: {
      url: '/models/custom_rec.onnx',
      dictionary: '/models/custom_dict.txt',
      preprocessor: 'standard'
    }
  }
});
```

### Model Conversion

To convert PaddlePaddle models to ONNX:

```bash
# Install paddle2onnx
pip install paddle2onnx

# Convert detection model
paddle2onnx --model_dir ./det_model \
  --model_filename inference.pdmodel \
  --params_filename inference.pdiparams \
  --save_file det.onnx \
  --opset_version 11

# Convert recognition model  
paddle2onnx --model_dir ./rec_model \
  --model_filename inference.pdmodel \
  --params_filename inference.pdiparams \
  --save_file rec.onnx \
  --opset_version 11
```

## Performance Optimization

### Model Quantization

Models support INT8 quantization for faster inference:

```typescript
const ocr = createRapidOCREngine({
  language: 'en',
  modelOptions: {
    quantized: true,  // Use INT8 models
    executionProviders: ['wasm']  // or 'webgl'
  }
});
```

### Hardware Acceleration

```typescript
// Enable WebGL acceleration
const ocr = createRapidOCREngine({
  language: 'en',
  executionProviders: [
    {
      name: 'webgl',
      deviceType: 'gpu',
      powerPreference: 'high-performance'
    }
  ]
});
```

## Model Limitations

### Known Limitations

1. **Text Size**: Minimum 16px height for reliable recognition
2. **Rotation**: Only 0° and 180° detected (not 90°/270°)
3. **Skew**: Maximum ±15° skew tolerance
4. **Languages**: Cannot mix RTL and LTR in same image
5. **Handwriting**: Limited support (printed text optimized)

### PPU Model Specific Limitations

1. **Width Limit**: Maximum 800px to prevent stack overflow
2. **Language**: English only
3. **Preprocessing**: Must use red channel for grayscale
4. **Dictionary**: External file required (not embedded)

## Troubleshooting Model Issues

### Common Problems

| Issue | Cause | Solution |
|-------|-------|----------|
| Wrong predictions | Model mismatch | Verify preprocessing |
| Slow loading | Large models | Use mobile variants |
| Memory errors | Image too large | Resize before process |
| Missing characters | Wrong dictionary | Check language code |

### Debug Mode

```typescript
// Enable model debugging
const ocr = createRapidOCREngine({
  language: 'en',
  debug: true,
  logLevel: 'verbose'
});

// Get model diagnostics
const diagnostics = await ocr.runDiagnostics();
console.log('Model health:', diagnostics);
```

## Future Roadmap

### Planned Improvements

1. **PP-OCRv6**: Expected 2025
2. **More Languages**: Arabic improvements, Indic scripts
3. **Layout Analysis**: Table detection, form understanding
4. **Handwriting**: Better cursive support
5. **3D Text**: Perspective correction
6. **Video OCR**: Real-time video stream processing

### Community Contributions

To contribute models:
1. Train using PaddleOCR framework
2. Convert to ONNX format
3. Test with client-side-ocr
4. Submit PR with benchmarks

## Resources

- [PaddleOCR Documentation](https://github.com/PaddlePaddle/PaddleOCR)
- [RapidOCR Wiki](https://github.com/RapidAI/RapidOCR/wiki)
- [ONNX Model Zoo](https://github.com/onnx/models)
- [Model Benchmarks](./BENCHMARKS.md)