# Available OCR Models

This document describes all available OCR models in this project.

## Model Sources

All models are sourced from:
- [OnnxOCR](https://github.com/jingsongliujing/OnnxOCR) - ONNX-converted PaddleOCR models
- [ppu-paddle-ocr](https://github.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr) - Additional English models

## Model Configurations

### 1. PaddleOCR v5 Mobile (Default)
- **ID**: `ppocrv5-mobile`
- **Type**: Mobile (Fast)
- **Best For**: General purpose, balanced speed and accuracy
- **Languages**: English, Chinese
- **Components**:
  - Detection: `ch_PP-OCRv5_det.onnx` (4.6MB)
  - Recognition: `ch_PP-OCRv5_rec.onnx` (16.5MB)
  - Classification: `ch_PP-OCRv5_cls.onnx` (583KB)

### 2. PaddleOCR v4 Mobile
- **ID**: `ppocrv4-mobile`
- **Type**: Mobile (Fast)
- **Best For**: Stable performance, smaller model size
- **Languages**: English, Chinese
- **Components**:
  - Detection: `ch_PP-OCRv4_det.onnx` (4.6MB)
  - Recognition: `ch_PP-OCRv4_rec.onnx` (10.8MB)
  - Classification: `ch_PP-OCRv4_cls.onnx` (583KB)

### 3. PaddleOCR v2 Server
- **ID**: `ppocrv2-server`
- **Type**: Server (Accurate)
- **Best For**: High accuracy detection, slower processing
- **Languages**: Chinese (primary)
- **Components**:
  - Detection: `ch_ppocr_server_v2.0_det.onnx` (47MB)
  - Recognition: `ch_PP-OCRv4_rec.onnx` (10.8MB) - Fallback from v4
  - Classification: `ch_ppocr_server_v2.0_cls.onnx` (583KB)

### 4. English Mobile
- **ID**: `en-mobile`
- **Type**: Mobile (Very Fast)
- **Best For**: English-only text, fastest processing
- **Languages**: English
- **Components**:
  - Detection: `PP-OCRv5_mobile_det.onnx` (4.7MB)
  - Recognition: `en_PP-OCRv4_mobile_rec.onnx` (8.6MB)
  - Classification: `ch_PP-OCRv4_cls.onnx` (583KB)

## Model Architecture

All models follow the PaddleOCR architecture:

1. **Detection Model (DB)**
   - Uses Differentiable Binarization (DB) algorithm
   - Outputs probability maps for text regions
   - Input: RGB image (any size, resized to multiple of 32)
   - Output: Binary map of text regions

2. **Recognition Model (CRNN)**
   - Uses CRNN + CTC for text recognition
   - Processes cropped text regions
   - Input: Grayscale image (48px height)
   - Output: Character sequence probabilities

3. **Classification Model (CNN)**
   - Detects text orientation (0° or 180°)
   - Used to correct upside-down text
   - Input: Text region (48x192px)
   - Output: Orientation probability

## Dictionary Files

Each model configuration includes a dictionary file that maps output indices to characters:
- `ppocr_keys_v1.txt` - Standard PaddleOCR dictionary (6623 chars)
- `ppocrv5_dict.txt` - Extended v5 dictionary
- `en_dict.txt` - English-only dictionary (96 chars)

## Performance Comparison

| Model | Detection Speed | Recognition Speed | Overall Accuracy |
|-------|----------------|-------------------|------------------|
| v5 Mobile | Fast | Fast | 95%+ |
| v4 Mobile | Fast | Very Fast | 93%+ |
| v2 Server | Slow | Fast* | 97%+ |
| English Mobile | Very Fast | Very Fast | 94%+ (English) |

*v2 Server uses v4 recognition model as fallback

## Usage in Code

```typescript
import { getModelConfig } from './core/model-config'

// Get default model (v5 mobile)
const defaultConfig = getModelConfig('ppocrv5-mobile')

// Initialize with specific model
await engine.initialize(defaultConfig.paths, defaultConfig.id)
```