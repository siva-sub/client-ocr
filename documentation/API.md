# Client-Side OCR - API Reference

## Table of Contents
1. [Core API](#core-api)
2. [Type Definitions](#type-definitions)
3. [React Components](#react-components)
4. [Configuration Options](#configuration-options)
5. [Error Handling](#error-handling)
6. [Events](#events)
7. [Utilities](#utilities)

## Core API

### createOCREngine(config?)

Creates a new OCR engine instance.

```typescript
function createOCREngine(config?: OCREngineConfig): OCREngine
```

#### Parameters

- `config` (optional): Configuration options for the OCR engine

```typescript
interface OCREngineConfig {
  wasmPaths?: {
    'ort-wasm.wasm'?: string;
    'ort-wasm-simd.wasm'?: string;
    'ort-wasm-threaded.wasm'?: string;
    'ort-wasm-simd-threaded.wasm'?: string;
  };
  workerPath?: string;
  modelBasePath?: string;
  enableDebug?: boolean;
}
```

#### Returns

- `OCREngine` instance

#### Example

```typescript
import { createOCREngine } from 'client-side-ocr';

// Default configuration
const ocr = createOCREngine();

// Custom configuration
const ocr = createOCREngine({
  modelBasePath: '/custom/models/',
  enableDebug: true
});
```

### OCREngine

The main OCR processing engine.

#### Methods

##### initialize(modelId?)

Initialize the OCR engine with a specific model.

```typescript
async initialize(modelId?: string): Promise<void>
```

**Parameters:**
- `modelId` (optional): The model to use. Defaults to 'ppocr-v5'
  - `'ppocr-v5'` - Latest PaddleOCR v5 (default)
  - `'ppocr-v4'` - PaddleOCR v4
  - `'en-mobile'` - English-optimized mobile model
  - `'ppocr-v2-server'` - Server model (detection only)

**Example:**
```typescript
// Use default model (ppocr-v5)
await ocr.initialize();

// Use specific model
await ocr.initialize('ppocr-v4');
```

##### processImage(input, options?)

Process an image and extract text.

```typescript
async processImage(
  input: File | Blob | HTMLImageElement | HTMLCanvasElement | ArrayBuffer,
  options?: ProcessingOptions
): Promise<OCRResult>
```

**Parameters:**
- `input`: The image to process
- `options` (optional): Processing configuration

**Returns:** `OCRResult` object

**Example:**
```typescript
// Process a file
const file = document.getElementById('file-input').files[0];
const result = await ocr.processImage(file);

// Process with options
const result = await ocr.processImage(file, {
  enableDeskew: true,
  confidenceThreshold: 0.8
});
```

##### processImageData(imageData, options?)

Process raw image data.

```typescript
async processImageData(
  imageData: ArrayBuffer | Uint8Array,
  options?: ProcessingOptions
): Promise<OCRResult>
```

**Parameters:**
- `imageData`: Raw image data
- `options` (optional): Processing configuration

**Example:**
```typescript
const response = await fetch('image.jpg');
const data = await response.arrayBuffer();
const result = await ocr.processImageData(data);
```

##### switchModel(modelId)

Switch to a different OCR model.

```typescript
async switchModel(modelId: string): Promise<void>
```

**Parameters:**
- `modelId`: The model to switch to

**Example:**
```typescript
// Start with mobile model
await ocr.initialize('en-mobile');

// Switch to server model for better accuracy
await ocr.switchModel('ppocr-v2-server');
```

##### isInitialized()

Check if the engine is initialized.

```typescript
isInitialized(): boolean
```

**Returns:** `true` if initialized, `false` otherwise

**Example:**
```typescript
if (!ocr.isInitialized()) {
  await ocr.initialize();
}
```

##### getCurrentModel()

Get information about the current model.

```typescript
getCurrentModel(): ModelConfig | null
```

**Returns:** Current model configuration or `null` if not initialized

**Example:**
```typescript
const model = ocr.getCurrentModel();
console.log(`Using ${model.name} (${model.version})`);
```

##### getAvailableModels()

Get list of available models.

```typescript
getAvailableModels(): ModelConfig[]
```

**Returns:** Array of available model configurations

**Example:**
```typescript
const models = ocr.getAvailableModels();
models.forEach(model => {
  console.log(`${model.name}: ${model.description}`);
});
```

##### getPerformanceMetrics()

Get performance metrics.

```typescript
getPerformanceMetrics(): PerformanceMetrics
```

**Returns:** Performance metrics object

**Example:**
```typescript
const metrics = ocr.getPerformanceMetrics();
console.log(`Model load time: ${metrics.modelLoadTime}ms`);
console.log(`Average processing: ${metrics.avgInferenceTime}ms`);
```

##### dispose()

Clean up resources.

```typescript
dispose(): void
```

**Example:**
```typescript
// Clean up when done
ocr.dispose();

// In React
useEffect(() => {
  return () => ocr.dispose();
}, []);
```

## Type Definitions

### OCRResult

The result of OCR processing.

```typescript
interface OCRResult {
  text: string;              // Combined text from all lines
  lines: TextLine[];         // Individual text lines
  confidence: number;        // Overall confidence (0-1)
  processingTime: number;    // Processing time in milliseconds
  method: 'onnx' | 'fallback'; // Processing method used
  rotationApplied?: number;  // Rotation angle if deskew was applied
  metadata?: {
    imageWidth: number;
    imageHeight: number;
    modelUsed: string;
    timestamp: number;
  };
}
```

### TextLine

Individual text line information.

```typescript
interface TextLine {
  text: string;              // Text content
  confidence: number;        // Confidence score (0-1)
  boundingBox: number[][];   // [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
  words?: Word[];            // Individual words (if available)
}
```

### Word

Individual word information.

```typescript
interface Word {
  text: string;
  confidence: number;
  boundingBox: number[][];
}
```

### ProcessingOptions

Options for image processing.

```typescript
interface ProcessingOptions {
  enableDeskew?: boolean;        // Auto-rotate tilted images (default: true)
  enableFallback?: boolean;      // Use Tesseract.js fallback (default: true)
  confidenceThreshold?: number;  // Minimum confidence (0-1, default: 0.7)
  language?: 'eng' | 'chi';      // Language hint (default: 'eng')
  preprocessImage?: boolean;     // Apply preprocessing (default: false)
  outputFormat?: 'text' | 'json' | 'hocr'; // Output format (default: 'text')
}
```

### ModelConfig

Model configuration information.

```typescript
interface ModelConfig {
  id: string;                    // Model identifier
  name: string;                  // Display name
  version: string;               // Model version
  description: string;           // Model description
  type: 'mobile' | 'server';     // Model type
  size: number;                  // Total size in bytes
  languages: string[];           // Supported languages
  files: {
    detection: string;
    recognition: string;
    classification?: string;
    dictionary: string;
  };
  performance: {
    speed: 'fast' | 'medium' | 'slow';
    accuracy: 'good' | 'high' | 'very high';
    memoryUsage: 'low' | 'medium' | 'high';
  };
}
```

### PerformanceMetrics

Performance tracking information.

```typescript
interface PerformanceMetrics {
  modelLoadTime: number;         // Model loading time (ms)
  avgInferenceTime: number;      // Average processing time (ms)
  totalProcessed: number;        // Total images processed
  successRate: number;           // Success rate (0-1)
  lastProcessingTime: number;    // Last processing time (ms)
  memoryUsage?: {
    current: number;             // Current memory (MB)
    peak: number;                // Peak memory (MB)
  };
}
```

## React Components

### OCRInterface

Complete OCR interface component.

```tsx
import { OCRInterface } from 'client-side-ocr/react';

interface OCRInterfaceProps {
  defaultModel?: string;         // Default model to use
  onResult?: (result: OCRResult) => void; // Result callback
  onError?: (error: Error) => void;       // Error callback
  theme?: 'light' | 'dark';      // UI theme
  showSettings?: boolean;        // Show settings panel
  showDebug?: boolean;           // Show debug information
  allowModelSwitch?: boolean;    // Allow model switching
  customStyles?: React.CSSProperties; // Custom styles
}
```

**Example:**
```tsx
function App() {
  const handleResult = (result: OCRResult) => {
    console.log('OCR Result:', result.text);
  };

  return (
    <OCRInterface
      defaultModel="ppocr-v5"
      onResult={handleResult}
      theme="light"
      showSettings={true}
    />
  );
}
```

### useOCR Hook

React hook for OCR functionality.

```typescript
function useOCR(config?: OCREngineConfig): {
  ocr: OCREngine | null;
  isInitialized: boolean;
  isProcessing: boolean;
  error: Error | null;
  result: OCRResult | null;
  processImage: (input: File | Blob, options?: ProcessingOptions) => Promise<void>;
  switchModel: (modelId: string) => Promise<void>;
  reset: () => void;
}
```

**Example:**
```tsx
import { useOCR } from 'client-side-ocr/react';

function OCRComponent() {
  const { ocr, isProcessing, result, processImage, error } = useOCR();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} disabled={isProcessing} />
      {isProcessing && <p>Processing...</p>}
      {result && <pre>{result.text}</pre>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Configuration Options

### Global Configuration

Set global configuration options.

```typescript
import { setGlobalConfig } from 'client-side-ocr';

setGlobalConfig({
  debug: true,
  defaultModel: 'ppocr-v4',
  wasmThreads: 4,
  cacheModels: true,
  corsProxy: 'https://cors-proxy.example.com/'
});
```

### Debug Mode

Enable debug logging.

```typescript
import { setDebugMode } from 'client-side-ocr';

// Enable debug mode
setDebugMode(true);

// With custom logger
setDebugMode(true, (level, message, data) => {
  console.log(`[${level}] ${message}`, data);
});
```

## Error Handling

### Error Types

```typescript
class OCRError extends Error {
  code: string;
  details?: any;
}

// Error codes
const ErrorCodes = {
  INITIALIZATION_FAILED: 'INIT_FAILED',
  MODEL_LOAD_FAILED: 'MODEL_LOAD_FAILED',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  WORKER_ERROR: 'WORKER_ERROR',
  MEMORY_ERROR: 'MEMORY_ERROR',
  BROWSER_NOT_SUPPORTED: 'BROWSER_NOT_SUPPORTED'
};
```

### Error Handling Example

```typescript
try {
  const result = await ocr.processImage(file);
} catch (error) {
  if (error instanceof OCRError) {
    switch (error.code) {
      case 'MEMORY_ERROR':
        console.error('Out of memory, try a smaller image');
        break;
      case 'MODEL_LOAD_FAILED':
        console.error('Failed to load model, check network connection');
        break;
      default:
        console.error('OCR failed:', error.message);
    }
  }
}
```

## Events

### Event Types

```typescript
interface OCREvents {
  'modelLoading': { modelId: string };
  'modelLoaded': { modelId: string; loadTime: number };
  'processingStart': { timestamp: number };
  'processingProgress': { progress: number };
  'processingComplete': { result: OCRResult };
  'error': { error: OCRError };
}
```

### Event Handling

```typescript
import { createOCREngine } from 'client-side-ocr';

const ocr = createOCREngine();

// Listen to events
ocr.on('modelLoading', ({ modelId }) => {
  console.log(`Loading model: ${modelId}`);
});

ocr.on('processingProgress', ({ progress }) => {
  console.log(`Progress: ${progress}%`);
});

ocr.on('error', ({ error }) => {
  console.error('OCR Error:', error);
});

// Remove listener
const handler = ({ result }) => console.log(result);
ocr.on('processingComplete', handler);
ocr.off('processingComplete', handler);
```

## Utilities

### checkCompatibility()

Check browser compatibility.

```typescript
import { checkCompatibility } from 'client-side-ocr';

const compatibility = await checkCompatibility();

if (!compatibility.supported) {
  console.error('Browser not supported:', compatibility.missingFeatures);
} else {
  console.log('Browser features:', compatibility.features);
}
```

### optimizeImage()

Optimize image for OCR processing.

```typescript
import { optimizeImage } from 'client-side-ocr';

const optimized = await optimizeImage(file, {
  maxDimension: 2048,
  quality: 0.9,
  format: 'jpeg',
  grayscale: true
});

const result = await ocr.processImage(optimized);
```

### preprocessImage()

Apply preprocessing filters.

```typescript
import { preprocessImage } from 'client-side-ocr';

const processed = await preprocessImage(file, {
  contrast: 1.5,
  brightness: 1.1,
  sharpen: true,
  denoise: true
});
```

### extractRegion()

Extract a specific region from an image.

```typescript
import { extractRegion } from 'client-side-ocr';

const region = await extractRegion(image, {
  x: 100,
  y: 100,
  width: 200,
  height: 50
});

const result = await ocr.processImage(region);
```

## Advanced Usage

### Custom Worker Configuration

```typescript
const ocr = createOCREngine({
  workerPath: '/custom/worker.js',
  wasmPaths: {
    'ort-wasm-simd.wasm': '/custom/wasm/ort-wasm-simd.wasm'
  }
});
```

### Batch Processing

```typescript
import { createBatchProcessor } from 'client-side-ocr';

const processor = createBatchProcessor({
  concurrency: 2,
  model: 'ppocr-v5'
});

const files = [file1, file2, file3];
const results = await processor.processFiles(files, {
  onProgress: (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
});
```

### Stream Processing

```typescript
import { createOCRStream } from 'client-side-ocr';

const stream = createOCRStream();

stream.on('result', (result) => {
  console.log('OCR Result:', result.text);
});

// Process video frames
const video = document.querySelector('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

setInterval(() => {
  ctx.drawImage(video, 0, 0);
  canvas.toBlob((blob) => {
    stream.process(blob);
  });
}, 1000);
```

### Custom Model Loading

```typescript
import { registerCustomModel } from 'client-side-ocr';

// Register a custom model
registerCustomModel({
  id: 'custom-model',
  name: 'Custom Model',
  version: '1.0',
  files: {
    detection: '/models/custom/det.onnx',
    recognition: '/models/custom/rec.onnx',
    dictionary: '/models/custom/dict.txt'
  }
});

// Use the custom model
const ocr = createOCREngine();
await ocr.initialize('custom-model');
```

## Performance Optimization

### Memory Management

```typescript
import { setMemoryLimit, getMemoryUsage } from 'client-side-ocr';

// Set memory limit (MB)
setMemoryLimit(512);

// Monitor memory usage
const usage = getMemoryUsage();
console.log(`Memory: ${usage.current}MB / ${usage.limit}MB`);

// Auto cleanup when memory is high
ocr.on('memoryWarning', () => {
  ocr.clearCache();
});
```

### Caching

```typescript
import { setCacheStrategy } from 'client-side-ocr';

// Configure caching
setCacheStrategy({
  models: true,          // Cache loaded models
  results: true,         // Cache OCR results
  maxSize: 100,          // Max cache size (MB)
  ttl: 3600000          // Cache TTL (1 hour)
});

// Clear cache
ocr.clearCache('models');
ocr.clearCache('results');
ocr.clearCache(); // Clear all
```

## Migration Guide

### From Tesseract.js

```typescript
// Tesseract.js
const worker = await Tesseract.createWorker('eng');
const { data: { text } } = await worker.recognize(image);

// Client-Side OCR
const ocr = createOCREngine();
await ocr.initialize();
const { text } = await ocr.processImage(image);
```

### From Server-Side OCR

```typescript
// Before: Server API
const formData = new FormData();
formData.append('image', file);
const response = await fetch('/api/ocr', { 
  method: 'POST', 
  body: formData 
});
const { text } = await response.json();

// After: Client-Side OCR
const ocr = createOCREngine();
await ocr.initialize();
const { text } = await ocr.processImage(file);
```

## Troubleshooting

### Common Issues

1. **SharedArrayBuffer not available**
   ```javascript
   // Add these headers to your server
   response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
   response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
   ```

2. **CORS errors with models**
   ```javascript
   // Configure CORS for model files
   const ocr = createOCREngine({
     corsProxy: 'https://cors-anywhere.herokuapp.com/'
   });
   ```

3. **Out of memory errors**
   ```javascript
   // Use smaller models or optimize images
   const optimized = await optimizeImage(file, { maxDimension: 1024 });
   const result = await ocr.processImage(optimized);
   ```

## Best Practices

1. **Initialize once, reuse often**
   ```typescript
   // Good: Initialize once
   const ocr = createOCREngine();
   await ocr.initialize();
   
   // Process multiple images
   for (const file of files) {
     await ocr.processImage(file);
   }
   ```

2. **Handle errors gracefully**
   ```typescript
   try {
     const result = await ocr.processImage(file);
   } catch (error) {
     // Fallback to server-side OCR
     const result = await serverOCR(file);
   }
   ```

3. **Optimize for performance**
   ```typescript
   // Preload models
   await ocr.initialize();
   
   // Process in parallel
   const results = await Promise.all(
     files.map(file => ocr.processImage(file))
   );
   ```

## License

MIT License - see [LICENSE](https://github.com/siva-sub/client-ocr/blob/main/LICENSE)

## Support

- GitHub Issues: [https://github.com/siva-sub/client-ocr/issues](https://github.com/siva-sub/client-ocr/issues)
- Discussions: [https://github.com/siva-sub/client-ocr/discussions](https://github.com/siva-sub/client-ocr/discussions)
- Email: sivasub987@gmail.com