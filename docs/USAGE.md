# Client-Side OCR - Comprehensive Usage Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Basic Usage](#basic-usage)
5. [Advanced Usage](#advanced-usage)
6. [Model Selection Guide](#model-selection-guide)
7. [API Reference](#api-reference)
8. [Architecture Overview](#architecture-overview)
9. [Performance Optimization](#performance-optimization)
10. [Browser Compatibility](#browser-compatibility)
11. [Troubleshooting](#troubleshooting)
12. [Examples](#examples)

## Introduction

Client-Side OCR is a high-performance, privacy-focused OCR library that runs entirely in the browser using ONNX Runtime and PaddleOCR models. No server required, no data leaves your device.

### Key Features
- 🚀 **100% Client-Side**: All processing happens in your browser
- 🔒 **Privacy-First**: Your data never leaves your device
- ⚡ **High Performance**: Optimized with Web Workers and SIMD
- 🌐 **Multi-Language**: Supports English and Chinese (more coming soon)
- 📱 **PWA Support**: Works offline as a Progressive Web App
- 🎯 **Multiple Models**: Choose between speed and accuracy

## Quick Start

### CDN Usage
```html
<script type="module">
  import { createOCREngine } from 'https://unpkg.com/client-side-ocr@latest/dist/index.mjs';
  
  const ocr = createOCREngine();
  await ocr.initialize();
  
  const result = await ocr.processImage(imageFile);
  console.log(result.text);
</script>
```

### NPM Installation
```bash
npm install client-side-ocr
```

## Installation

### Package Manager

#### NPM
```bash
npm install client-side-ocr
```

#### Yarn
```bash
yarn add client-side-ocr
```

#### PNPM
```bash
pnpm add client-side-ocr
```

### CDN
```html
<!-- ESM -->
<script type="module">
  import { createOCREngine } from 'https://unpkg.com/client-side-ocr@latest/dist/index.mjs';
</script>

<!-- UMD -->
<script src="https://unpkg.com/client-side-ocr@latest/dist/index.js"></script>
```

## Basic Usage

### JavaScript/TypeScript

```typescript
import { createOCREngine } from 'client-side-ocr';

// Create OCR engine instance
const ocr = createOCREngine();

// Initialize with default model (PaddleOCR v5)
await ocr.initialize();

// Process an image
const imageFile = document.getElementById('file-input').files[0];
const result = await ocr.processImage(imageFile);

console.log('Detected text:', result.text);
console.log('Confidence:', result.confidence);
console.log('Processing time:', result.processingTime + 'ms');
```

### React Component

```tsx
import React, { useState } from 'react';
import { OCRInterface } from 'client-side-ocr/react';

function App() {
  return (
    <div>
      <h1>OCR Demo</h1>
      <OCRInterface />
    </div>
  );
}
```

### Custom React Integration

```tsx
import React, { useState, useCallback } from 'react';
import { createOCREngine } from 'client-side-ocr';

function CustomOCR() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocr] = useState(() => createOCREngine());

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // Initialize if needed
      if (!ocr.isInitialized()) {
        await ocr.initialize();
      }

      // Process image
      const result = await ocr.processImage(file);
      setResult(result);
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      setLoading(false);
    }
  }, [ocr]);

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect}
        disabled={loading}
      />
      
      {loading && <p>Processing...</p>}
      
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{result.text}</pre>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <p>Time: {result.processingTime}ms</p>
        </div>
      )}
    </div>
  );
}
```

## Advanced Usage

### Custom Model Selection

```typescript
import { createOCREngine, ModelConfig } from 'client-side-ocr';

const ocr = createOCREngine();

// Use PaddleOCR v4 for better compatibility
await ocr.initialize('ppocr-v4');

// Or use English-optimized model
await ocr.initialize('en-mobile');

// Switch models at runtime
await ocr.switchModel('ppocr-v5');
```

### Processing Options

```typescript
const options = {
  // Enable automatic rotation correction
  enableDeskew: true,
  
  // Use Tesseract.js as fallback for unsupported scenarios
  enableFallback: true,
  
  // Minimum confidence threshold (0-1)
  confidenceThreshold: 0.7,
  
  // Language hint for recognition
  language: 'eng' // or 'chi' for Chinese
};

const result = await ocr.processImage(file, options);
```

### Batch Processing

```typescript
async function processBatch(files: File[]) {
  const ocr = createOCREngine();
  await ocr.initialize();
  
  const results = [];
  
  for (const file of files) {
    const result = await ocr.processImage(file);
    results.push({
      filename: file.name,
      text: result.text,
      confidence: result.confidence
    });
  }
  
  return results;
}
```

### Web Worker Integration

```typescript
// main.js
const worker = new Worker('ocr-worker.js');

worker.postMessage({ 
  type: 'process', 
  imageData: await file.arrayBuffer() 
});

worker.onmessage = (e) => {
  console.log('OCR Result:', e.data.text);
};

// ocr-worker.js
import { createOCREngine } from 'client-side-ocr';

const ocr = createOCREngine();

self.onmessage = async (e) => {
  if (e.data.type === 'process') {
    if (!ocr.isInitialized()) {
      await ocr.initialize();
    }
    
    const result = await ocr.processImageData(e.data.imageData);
    self.postMessage(result);
  }
};
```

## Model Selection Guide

### Available Models

| Model ID | Description | Size | Speed | Accuracy | Languages |
|----------|-------------|------|-------|----------|-----------|
| `ppocr-v5` | Latest PaddleOCR v5 (default) | ~21MB | Fast | High | EN, ZH |
| `ppocr-v4` | PaddleOCR v4 | ~16MB | Fast | Good | EN, ZH |
| `en-mobile` | English-optimized | ~13MB | Very Fast | Good | EN |
| `ppocr-v2-server` | Server model (detection only) | ~50MB | Slow | Very High | EN, ZH |

### Model Comparison

![Model Selection](./screenshots/model-selection.png)

#### Mobile Models (Recommended)
- **Fast loading**: Models load in 2-5 seconds
- **Quick inference**: Process images in 100-500ms
- **Lower memory usage**: ~100-200MB RAM
- **Suitable for**: Real-time processing, mobile devices, most use cases

#### Server Models
- **Larger size**: 50MB+ download
- **Slower loading**: 10-20 seconds initial load
- **Higher accuracy**: Better for complex documents
- **Suitable for**: High-quality scans, complex layouts, when accuracy is critical

### Switching Models

```typescript
// Initialize with specific model
const ocr = createOCREngine();
await ocr.initialize('ppocr-v4');

// Switch model at runtime
await ocr.switchModel('en-mobile');

// Get current model info
const modelInfo = ocr.getCurrentModel();
console.log(modelInfo);
// { id: 'en-mobile', name: 'English Mobile', version: 'v5+v4', ... }
```

## API Reference

### createOCREngine()

Creates a new OCR engine instance.

```typescript
function createOCREngine(config?: OCREngineConfig): OCREngine
```

#### Parameters
- `config` (optional): Configuration options
  - `wasmPaths`: Custom paths for ONNX Runtime WASM files
  - `workerPath`: Custom path for Web Worker scripts
  - `modelBasePath`: Base URL for model files

#### Returns
- `OCREngine` instance

### OCREngine Methods

#### initialize(modelId?: string)
Initialize the OCR engine with a specific model.

```typescript
async initialize(modelId?: string): Promise<void>
```

#### processImage(input: File | Blob | HTMLImageElement)
Process an image and extract text.

```typescript
async processImage(
  input: File | Blob | HTMLImageElement, 
  options?: ProcessingOptions
): Promise<OCRResult>
```

#### switchModel(modelId: string)
Switch to a different OCR model.

```typescript
async switchModel(modelId: string): Promise<void>
```

#### isInitialized()
Check if the engine is initialized.

```typescript
isInitialized(): boolean
```

#### getCurrentModel()
Get information about the current model.

```typescript
getCurrentModel(): ModelConfig | null
```

#### dispose()
Clean up resources.

```typescript
dispose(): void
```

### Types

#### OCRResult
```typescript
interface OCRResult {
  text: string;              // Extracted text
  lines: TextLine[];         // Detected text lines
  confidence: number;        // Overall confidence (0-1)
  processingTime: number;    // Processing time in ms
  method: 'onnx' | 'fallback'; // Processing method used
  rotationApplied?: number;  // Rotation angle if deskew was applied
}
```

#### TextLine
```typescript
interface TextLine {
  text: string;              // Line text
  confidence: number;        // Line confidence (0-1)
  boundingBox: number[][];   // [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
}
```

#### ProcessingOptions
```typescript
interface ProcessingOptions {
  enableDeskew?: boolean;    // Auto-rotate tilted images
  enableFallback?: boolean;  // Use Tesseract.js as fallback
  confidenceThreshold?: number; // Min confidence (0-1)
  language?: 'eng' | 'chi';  // Language hint
}
```

## Architecture Overview

### System Architecture

```
┌─────────────────────┐
│   Web Application   │
├─────────────────────┤
│   OCR Interface     │
├─────────────────────┤
│  Inference Engine   │
├─────────────────────┤
│    Web Workers      │
│ ┌─────┬─────┬─────┐ │
│ │ Det │ Rec │ Cls │ │
│ └─────┴─────┴─────┘ │
├─────────────────────┤
│  ONNX Runtime Web   │
└─────────────────────┘
```

### Processing Pipeline

1. **Image Preprocessing**
   - Format conversion (JPEG, PNG, WebP supported)
   - Resize to optimal dimensions
   - Normalize pixel values

2. **Text Detection (DB Algorithm)**
   - Detect text regions using Differentiable Binarization
   - Generate bounding boxes for text areas
   - Non-maximum suppression for overlapping regions

3. **Text Recognition (CRNN + CTC)**
   - Extract text line images
   - Classify orientation (0° or 180°)
   - Recognize characters using CRNN
   - Decode with CTC algorithm

4. **Post-processing**
   - Combine detected lines
   - Apply confidence filtering
   - Format output

### Web Worker Architecture

The library uses dedicated Web Workers for each stage to prevent blocking the main thread:

- **Detection Worker**: Handles text detection
- **Recognition Worker**: Processes text recognition
- **Classification Worker**: Determines text orientation
- **Deskew Worker**: Corrects image rotation

## Performance Optimization

### Best Practices

1. **Image Optimization**
   ```typescript
   // Resize large images before processing
   async function optimizeImage(file: File): Promise<Blob> {
     const img = new Image();
     img.src = URL.createObjectURL(file);
     await img.decode();
     
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     
     // Limit to 2048px max dimension
     const maxDim = 2048;
     const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
     
     canvas.width = img.width * scale;
     canvas.height = img.height * scale;
     
     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
     
     return new Promise(resolve => {
       canvas.toBlob(resolve, 'image/jpeg', 0.9);
     });
   }
   ```

2. **Batch Processing**
   ```typescript
   // Process multiple images efficiently
   const ocr = createOCREngine();
   await ocr.initialize();
   
   // Reuse same engine instance for multiple images
   for (const file of files) {
     const result = await ocr.processImage(file);
     // Process result...
   }
   ```

3. **Memory Management**
   ```typescript
   // Dispose engine when done
   ocr.dispose();
   
   // For single-page applications
   window.addEventListener('beforeunload', () => {
     ocr.dispose();
   });
   ```

### Performance Benchmarks

| Image Size | Mobile Model | Server Model | Tesseract.js |
|------------|--------------|--------------|---------------|
| 640×480    | ~200ms       | ~500ms       | ~1500ms       |
| 1280×720   | ~400ms       | ~1000ms      | ~3000ms       |
| 1920×1080  | ~800ms       | ~2000ms      | ~5000ms       |

*Benchmarks on Chrome 120, Intel i7-9700K, 16GB RAM*

## Browser Compatibility

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|--------|
| Chrome | 91+ | Full support with SIMD |
| Edge | 91+ | Full support with SIMD |
| Firefox | 89+ | Full support |
| Safari | 15.4+ | WebAssembly threads required |
| Chrome Android | 91+ | Mobile optimized |
| Safari iOS | 15.4+ | Limited to 4GB memory |

### Feature Detection

```typescript
// Check browser compatibility
import { checkCompatibility } from 'client-side-ocr';

const compat = await checkCompatibility();

if (!compat.supported) {
  console.error('Browser not supported:', compat.missingFeatures);
  // Fallback to server-side OCR
  return;
}

if (compat.warnings.length > 0) {
  console.warn('Performance may be limited:', compat.warnings);
}

// Optional features
console.log('SIMD supported:', compat.features.simd);
console.log('Threads supported:', compat.features.threads);
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Access to fetch at 'https://...' from origin 'http://localhost' has been blocked by CORS policy
```

**Solution**: Ensure model files are served with proper CORS headers:
```javascript
// If self-hosting models
app.use('/models', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});
```

#### 2. SharedArrayBuffer Not Available
```
SharedArrayBuffer is not defined
```

**Solution**: Enable required headers:
```javascript
// vite.config.js
export default {
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
}
```

#### 3. Out of Memory
```
RuntimeError: memory access out of bounds
```

**Solution**: Process smaller images or use mobile models:
```typescript
// Reduce image size
const optimized = await optimizeImage(file, { maxDimension: 1024 });
const result = await ocr.processImage(optimized);
```

### Debug Mode

```typescript
// Enable debug logging
import { setDebugMode } from 'client-side-ocr';

setDebugMode(true);

// Get performance metrics
const metrics = ocr.getPerformanceMetrics();
console.log('Model load time:', metrics.modelLoadTime);
console.log('Average inference time:', metrics.avgInferenceTime);
```

## Examples

### 1. Simple HTML Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>OCR Demo</title>
</head>
<body>
  <input type="file" id="fileInput" accept="image/*">
  <div id="result"></div>
  
  <script type="module">
    import { createOCREngine } from 'https://unpkg.com/client-side-ocr@latest/dist/index.mjs';
    
    const ocr = createOCREngine();
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      resultDiv.textContent = 'Processing...';
      
      try {
        if (!ocr.isInitialized()) {
          await ocr.initialize();
        }
        
        const result = await ocr.processImage(file);
        resultDiv.textContent = result.text;
      } catch (error) {
        resultDiv.textContent = 'Error: ' + error.message;
      }
    });
  </script>
</body>
</html>
```

### 2. Vue.js Component

```vue
<template>
  <div class="ocr-component">
    <input 
      type="file" 
      @change="handleFile" 
      accept="image/*"
      :disabled="processing"
    >
    
    <div v-if="processing" class="loading">
      Processing... {{ progress }}%
    </div>
    
    <div v-if="result" class="result">
      <h3>Extracted Text:</h3>
      <pre>{{ result.text }}</pre>
      <p>Confidence: {{ (result.confidence * 100).toFixed(1) }}%</p>
      <p>Time: {{ result.processingTime }}ms</p>
    </div>
  </div>
</template>

<script>
import { createOCREngine } from 'client-side-ocr';

export default {
  data() {
    return {
      ocr: null,
      processing: false,
      progress: 0,
      result: null
    };
  },
  
  mounted() {
    this.ocr = createOCREngine();
  },
  
  methods: {
    async handleFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.processing = true;
      this.progress = 0;
      
      try {
        if (!this.ocr.isInitialized()) {
          this.progress = 10;
          await this.ocr.initialize();
          this.progress = 50;
        }
        
        this.result = await this.ocr.processImage(file);
        this.progress = 100;
      } catch (error) {
        console.error('OCR failed:', error);
        alert('OCR failed: ' + error.message);
      } finally {
        this.processing = false;
      }
    }
  },
  
  beforeUnmount() {
    if (this.ocr) {
      this.ocr.dispose();
    }
  }
};
</script>
```

### 3. Node.js Server Integration

```javascript
// While this is a client-side library, you can use it in Node.js with jsdom
import { JSDOM } from 'jsdom';
import { createOCREngine } from 'client-side-ocr';

// Setup browser-like environment
const dom = new JSDOM();
global.window = dom.window;
global.document = window.document;
global.Image = window.Image;

// Create OCR engine
const ocr = createOCREngine();
await ocr.initialize();

// Process image buffer
const imageBuffer = fs.readFileSync('image.jpg');
const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
const result = await ocr.processImage(blob);

console.log(result.text);
```

### 4. PWA with Offline Support

```javascript
// sw.js - Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ocr-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/models/ppocr-v5/det.onnx',
        '/models/ppocr-v5/rec.onnx',
        '/models/ppocr-v5/cls.onnx'
      ]);
    })
  );
});

// app.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// OCR works offline once models are cached
const ocr = createOCREngine();
await ocr.initialize();
```

## Performance Tips

### 1. Preload Models
```typescript
// Preload models during app initialization
const ocr = createOCREngine();

// Initialize in background
ocr.initialize().then(() => {
  console.log('OCR ready');
});

// Later, when user needs OCR
if (ocr.isInitialized()) {
  // Process immediately
  const result = await ocr.processImage(file);
}
```

### 2. Image Preprocessing
```typescript
// Enhance image quality before OCR
async function preprocessImage(file: File): Promise<Blob> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Apply filters for better OCR
  ctx.filter = 'contrast(1.5) brightness(1.1)';
  ctx.drawImage(img, 0, 0);
  
  // Convert to grayscale
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
}
```

### 3. Progressive Enhancement
```typescript
// Start with fast model, upgrade if needed
const ocr = createOCREngine();

// Quick scan with mobile model
await ocr.initialize('en-mobile');
let result = await ocr.processImage(file);

// If confidence is low, try better model
if (result.confidence < 0.7) {
  await ocr.switchModel('ppocr-v5');
  result = await ocr.processImage(file);
}
```

## Security Considerations

### Content Security Policy

If using CSP, add these directives:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval' blob:;
  worker-src 'self' blob:;
  wasm-eval 'unsafe-eval';
">
```

### Data Privacy

- All processing happens client-side
- No data is sent to external servers
- Models are cached locally after first download
- Images are processed in memory and not stored

## Contributing

See [CONTRIBUTING.md](https://github.com/siva-sub/client-ocr/blob/main/CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see [LICENSE](https://github.com/siva-sub/client-ocr/blob/main/LICENSE)

## References

- [ONNX Runtime Web Documentation](https://onnxruntime.ai/docs/get-started/with-javascript.html)
- [PaddleOCR Paper](https://arxiv.org/abs/2109.03144)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [WebAssembly Documentation](https://webassembly.org/docs/)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)

## Support

- GitHub Issues: [https://github.com/siva-sub/client-ocr/issues](https://github.com/siva-sub/client-ocr/issues)
- Discussions: [https://github.com/siva-sub/client-ocr/discussions](https://github.com/siva-sub/client-ocr/discussions)
- Email: sivasub987@gmail.com