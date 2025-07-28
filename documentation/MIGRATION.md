# Migration Guide: v1.x to v2.0

## Overview

Version 2.0 brings RapidOCR integration with support for 14+ languages, improved processing techniques, and automatic model management. While we've maintained backward compatibility where possible, some changes require updates to your code.

## Breaking Changes

### 1. Component Name Changes

The main React component has been renamed to reflect RapidOCR integration:

```tsx
// v1.x
import { OCRInterface } from 'client-side-ocr/react';

// v2.0
import { RapidOCRInterface } from 'client-side-ocr/react';
```

### 2. Engine Creation API

The engine creation function now requires language specification:

```typescript
// v1.x
const ocr = createOCREngine();
await ocr.initialize('ppocr-v4');

// v2.0
const ocr = createRapidOCREngine({
  language: 'en', // Required: specify language
  modelVersion: 'PP-OCRv4', // Optional: defaults to PP-OCRv4
  modelType: 'mobile' // Optional: 'mobile' or 'server'
});
await ocr.initialize(); // Models auto-download based on config
```

### 3. Model Names

Model naming convention has changed:

| v1.x | v2.0 |
|------|------|
| `ppocr-v4` | `PP-OCRv4` |
| `ppocr-v5` | `PP-OCRv5` |
| `en-mobile` | Use language: 'en' with modelType: 'mobile' |

### 4. Result Format

Results now include additional information:

```typescript
// v1.x
interface OCRResult {
  text: string;
  confidence: number;
  lines: Array<{ text: string; box: BoundingBox }>;
  processingTime: number;
}

// v2.0
interface RapidOCRResult {
  text: string;
  confidence: number;
  lines: Array<{
    text: string;
    box: BoundingBox;
    confidence: number; // New: per-line confidence
  }>;
  wordBoxes?: Array<{ // New: word-level segmentation
    words: string[][];
    positions: number[][];
    states: string[]; // 'cn' for Chinese, 'en&num' for English/numbers
  }>;
  angle?: number; // New: detected rotation (0 or 180)
  processingTime: {
    total: number;
    detection: number;
    classification: number;
    recognition: number;
  };
}
```

## New Features

### 1. Multi-Language Support

```typescript
// Supported languages
const languages = [
  'ch', // Chinese
  'en', // English  
  'fr', // French
  'de', // German
  'ja', // Japanese
  'ko', // Korean
  'ru', // Russian
  'pt', // Portuguese
  'es', // Spanish
  'it', // Italian
  'id', // Indonesian
  'vi', // Vietnamese
  'fa', // Persian
  'ka'  // Kannada
];

const ocr = createRapidOCREngine({ language: 'ja' });
```

### 2. Advanced Processing Options

```typescript
const result = await ocr.processImage(file, {
  // Text rotation detection
  enableTextClassification: true,
  
  // Word-level segmentation
  enableWordSegmentation: true,
  
  // Preprocessing options
  preprocessConfig: {
    detectImageNetNorm: true, // ImageNet normalization for detection
    recStandardNorm: true     // Standard normalization for recognition
  },
  
  // Postprocessing options
  postprocessConfig: {
    unclipRatio: 2.0,    // Text region expansion
    boxThresh: 0.7,      // Box confidence threshold
    maxCandidates: 1000  // Max text regions
  }
});
```

### 3. Model Auto-Download

Models are now automatically downloaded on first use:

```typescript
// Models download automatically with progress callback
const ocr = createRapidOCREngine({
  language: 'en',
  onDownloadProgress: (progress) => {
    console.log(`Downloading: ${progress.percent}%`);
  }
});
```

### 4. React Component Props

```tsx
<RapidOCRInterface
  defaultLanguage="en"
  modelVersion="PP-OCRv4"
  onResult={(result) => console.log(result)}
  onError={(error) => console.error(error)}
  enableWordSegmentation={true}
  enableTextClassification={true}
/>
```

## Backward Compatibility

### Using Legacy API

For easier migration, we provide a compatibility layer:

```typescript
import { createOCREngineLegacy } from 'client-side-ocr/legacy';

// Works like v1.x
const ocr = createOCREngineLegacy();
await ocr.initialize('ppocr-v4');
```

### Gradual Migration

1. **Phase 1**: Update imports and use compatibility layer
2. **Phase 2**: Update to new engine creation API
3. **Phase 3**: Adopt new features (languages, word segmentation)

## Common Migration Scenarios

### Scenario 1: Basic OCR Usage

```typescript
// v1.x
const ocr = createOCREngine();
await ocr.initialize();
const result = await ocr.processImage(file);
console.log(result.text);

// v2.0 (minimal changes)
const ocr = createRapidOCREngine({ language: 'en' });
await ocr.initialize();
const result = await ocr.processImage(file);
console.log(result.text);
```

### Scenario 2: React Application

```tsx
// v1.x
import { OCRInterface } from 'client-side-ocr/react';

function App() {
  return <OCRInterface />;
}

// v2.0
import { RapidOCRInterface } from 'client-side-ocr/react';

function App() {
  return <RapidOCRInterface defaultLanguage="en" />;
}
```

### Scenario 3: Custom Model Selection

```typescript
// v1.x
await ocr.initialize('ppocr-v2-server');

// v2.0
const ocr = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'server'
});
await ocr.initialize();
```

## Performance Improvements

v2.0 includes several performance optimizations:

- **Batch Processing**: Recognition now processes multiple text regions in batches
- **Aspect Ratio Sorting**: Images sorted by aspect ratio for efficient batching
- **Smart Preprocessing**: Different normalization for detection vs recognition
- **Model Caching**: SHA256 verification ensures models are cached correctly

## Troubleshooting

### Issue: Models not downloading

```typescript
// Check if models are cached
const isModelsCached = await ocr.areModelsAvailable();

// Force re-download
await ocr.downloadModels({ force: true });
```

### Issue: Old model names not working

Map old names to new configuration:

```typescript
const modelMap = {
  'ppocr-v4': { modelVersion: 'PP-OCRv4', modelType: 'mobile' },
  'ppocr-v5': { modelVersion: 'PP-OCRv5', modelType: 'mobile' },
  'ppocr-v2-server': { modelVersion: 'PP-OCRv4', modelType: 'server' }
};
```

### Issue: Different results than v1.x

v2.0 uses improved preprocessing. To use legacy preprocessing:

```typescript
const result = await ocr.processImage(file, {
  preprocessConfig: {
    useLegacyNormalization: true
  }
});
```

## Support

- **Documentation**: [Full API Reference](./API.md)
- **Issues**: [GitHub Issues](https://github.com/siva-sub/client-ocr/issues)
- **Examples**: [Example Applications](./examples/)

## Conclusion

Version 2.0 brings significant improvements in accuracy, language support, and processing capabilities. While some changes are required, the migration path is straightforward and the benefits include:

- Support for 14+ languages
- Better accuracy with RapidOCR techniques
- Automatic model management
- Word-level text segmentation
- Improved preprocessing and postprocessing

We recommend testing thoroughly in a development environment before deploying to production.