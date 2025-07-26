# Client-Side OCR - API Documentation

## Core API

### createOCREngine

Creates a new OCR engine instance.

```typescript
function createOCREngine(config?: OCREngineConfig): OCREngine
```

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| config | `OCREngineConfig` | No | Configuration options for the OCR engine |

#### OCREngineConfig

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
  numThreads?: number;
  executionProviders?: ExecutionProvider[];
}
```

#### Example

```typescript
const ocr = createOCREngine({
  modelBasePath: '/custom/models/',
  numThreads: 4
});
```

### OCREngine Class

The main OCR processing engine.

#### Methods

##### initialize

Initialize the OCR engine with a specific model.

```typescript
initialize(modelId?: string): Promise<void>
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| modelId | `string` | No | `'ppocr-v5'` | ID of the model to load |

**Available Model IDs:**
- `'ppocr-v5'` - PaddleOCR v5 Mobile (default)
- `'ppocr-v4'` - PaddleOCR v4 Mobile
- `'en-mobile'` - English Mobile (v5 det + v4 rec)
- `'ppocr-v2-server'` - PaddleOCR v2 Server

**Example:**
```typescript
await ocr.initialize('en-mobile');
```

##### processImage

Process an image and extract text.

```typescript
processImage(
  input: File | Blob | HTMLImageElement | HTMLCanvasElement | ImageData,
  options?: ProcessingOptions
): Promise<OCRResult>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | `File \| Blob \| HTMLImageElement \| HTMLCanvasElement \| ImageData` | Yes | Image to process |
| options | `ProcessingOptions` | No | Processing configuration |

**Example:**
```typescript
const result = await ocr.processImage(file, {
  enableDeskew: true,
  confidenceThreshold: 0.7
});
```

##### processImageData

Process raw image data directly.

```typescript
processImageData(
  data: ArrayBuffer | Uint8Array,
  options?: ProcessingOptions
): Promise<OCRResult>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| data | `ArrayBuffer \| Uint8Array` | Yes | Raw image data |
| options | `ProcessingOptions` | No | Processing configuration |

##### switchModel

Switch to a different OCR model at runtime.

```typescript
switchModel(modelId: string): Promise<void>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| modelId | `string` | Yes | ID of the model to switch to |

**Example:**
```typescript
await ocr.switchModel('ppocr-v4');
```

##### isInitialized

Check if the engine is initialized and ready.

```typescript
isInitialized(): boolean
```

**Returns:** `boolean` - True if initialized, false otherwise

##### getCurrentModel

Get information about the currently loaded model.

```typescript
getCurrentModel(): ModelConfig | null
```

**Returns:** `ModelConfig` object or `null` if not initialized

##### getAvailableModels

Get list of all available models.

```typescript
getAvailableModels(): ModelConfig[]
```

**Returns:** Array of `ModelConfig` objects

##### dispose

Clean up resources and free memory.

```typescript
dispose(): void
```

**Example:**
```typescript
// Clean up when done
ocr.dispose();
```

##### getPerformanceMetrics

Get performance statistics.

```typescript
getPerformanceMetrics(): PerformanceMetrics
```

**Returns:** `PerformanceMetrics` object with timing information

## Data Types

### OCRResult

Result object returned by image processing.

```typescript
interface OCRResult {
  // Extracted text as a single string
  text: string;
  
  // Individual text lines with positions
  lines: TextLine[];
  
  // Overall confidence score (0-1)
  confidence: number;
  
  // Processing time in milliseconds
  processingTime: number;
  
  // Method used for processing
  method: 'onnx' | 'fallback';
  
  // Rotation angle applied (if deskew enabled)
  rotationApplied?: number;
  
  // Original image dimensions
  imageSize: {
    width: number;
    height: number;
  };
  
  // Model used for processing
  modelId: string;
}
```

### TextLine

Individual text line with position and confidence.

```typescript
interface TextLine {
  // Detected text content
  text: string;
  
  // Confidence score for this line (0-1)
  confidence: number;
  
  // Bounding box coordinates [top-left, top-right, bottom-right, bottom-left]
  boundingBox: [[number, number], [number, number], [number, number], [number, number]];
  
  // Polygon points (more precise than boundingBox)
  polygon?: [number, number][];
  
  // Text orientation in degrees (0, 90, 180, 270)
  orientation?: number;
  
  // Word-level details (if available)
  words?: Word[];
}
```

### Word

Individual word within a text line.

```typescript
interface Word {
  // Word text
  text: string;
  
  // Confidence score (0-1)
  confidence: number;
  
  // Bounding box for the word
  boundingBox: [[number, number], [number, number], [number, number], [number, number]];
}
```

### ProcessingOptions

Options to customize OCR processing.

```typescript
interface ProcessingOptions {
  // Enable automatic rotation correction
  enableDeskew?: boolean; // default: true
  
  // Use Tesseract.js as fallback
  enableFallback?: boolean; // default: true
  
  // Minimum confidence threshold (0-1)
  confidenceThreshold?: number; // default: 0.5
  
  // Language hint for recognition
  language?: 'eng' | 'chi' | 'auto'; // default: 'auto'
  
  // Region of interest (crop before processing)
  roi?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // Maximum image dimension (resize if larger)
  maxDimension?: number; // default: 2048
  
  // Output format options
  outputFormat?: {
    // Include word-level details
    includeWords?: boolean; // default: false
    
    // Include confidence for each character
    includeCharConfidence?: boolean; // default: false
    
    // Sort lines by vertical position
    sortLines?: boolean; // default: true
  };
  
  // Performance options
  performance?: {
    // Number of worker threads
    numThreads?: number; // default: navigator.hardwareConcurrency
    
    // Batch size for recognition
    batchSize?: number; // default: 8
    
    // Use WebGL acceleration (if available)
    useWebGL?: boolean; // default: true
  };
}
```

### ModelConfig

Configuration and metadata for OCR models.

```typescript
interface ModelConfig {
  // Unique model identifier
  id: string;
  
  // Display name
  name: string;
  
  // Model version
  version: string;
  
  // Model type
  type: 'mobile' | 'server';
  
  // Model description
  description: string;
  
  // Supported languages
  languages: string[];
  
  // Model file paths
  paths: {
    det: string;  // Detection model
    rec: string;  // Recognition model
    cls: string;  // Classification model
    dict: string; // Dictionary file
  };
  
  // Model sizes
  sizes: {
    detection: string;
    recognition: string;
    classification: string;
  };
  
  // Performance characteristics
  accuracy: 'good' | 'high' | 'very high';
  speed: 'fast' | 'medium' | 'slow';
  
  // Memory requirements
  memoryUsage: {
    min: number; // MB
    typical: number; // MB
    max: number; // MB
  };
}
```

### PerformanceMetrics

Performance statistics for monitoring.

```typescript
interface PerformanceMetrics {
  // Model loading time (ms)
  modelLoadTime: number;
  
  // Average processing times
  avgInferenceTime: number;
  avgPreprocessingTime: number;
  avgPostprocessingTime: number;
  
  // Processing statistics
  totalProcessed: number;
  successfulProcessed: number;
  failedProcessed: number;
  
  // Memory usage (if available)
  memoryUsage?: {
    current: number; // MB
    peak: number; // MB
  };
  
  // Detailed timings for last process
  lastProcess?: {
    total: number;
    preprocessing: number;
    detection: number;
    recognition: number;
    postprocessing: number;
  };
}
```

## React Components

### OCRInterface

Complete OCR interface component with UI.

```typescript
import { OCRInterface } from 'client-side-ocr/react';

function App() {
  return <OCRInterface />;
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| defaultModel | `string` | No | `'ppocr-v5'` | Initial model to load |
| onResult | `(result: OCRResult) => void` | No | - | Callback when OCR completes |
| onError | `(error: Error) => void` | No | - | Error handler |
| maxFileSize | `number` | No | `5242880` (5MB) | Maximum file size in bytes |
| acceptedFormats | `string[]` | No | `['image/*']` | Accepted file types |
| theme | `'light' \| 'dark' \| 'auto'` | No | `'auto'` | UI theme |

#### Example

```tsx
<OCRInterface
  defaultModel="en-mobile"
  onResult={(result) => {
    console.log('OCR Result:', result.text);
  }}
  maxFileSize={10 * 1024 * 1024} // 10MB
/>
```

### useOCR Hook

React hook for OCR functionality.

```typescript
import { useOCR } from 'client-side-ocr/react';

function MyComponent() {
  const {
    initialize,
    processImage,
    isProcessing,
    isInitialized,
    result,
    error,
    progress
  } = useOCR();
  
  // Use OCR functionality
}
```

#### Hook Return Value

```typescript
interface UseOCRReturn {
  // Initialize OCR engine
  initialize: (modelId?: string) => Promise<void>;
  
  // Process an image
  processImage: (
    input: File | Blob | HTMLImageElement,
    options?: ProcessingOptions
  ) => Promise<OCRResult | null>;
  
  // State
  isInitialized: boolean;
  isProcessing: boolean;
  result: OCRResult | null;
  error: Error | null;
  progress: number; // 0-100
  
  // Model management
  currentModel: ModelConfig | null;
  switchModel: (modelId: string) => Promise<void>;
  
  // Cleanup
  dispose: () => void;
}
```

#### Example

```tsx
function OCRComponent() {
  const { initialize, processImage, isProcessing, result } = useOCR();
  
  useEffect(() => {
    initialize('ppocr-v5');
  }, []);
  
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processImage(file);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleFile} disabled={isProcessing} />
      {isProcessing && <p>Processing...</p>}
      {result && <pre>{result.text}</pre>}
    </div>
  );
}
```

## Utility Functions

### checkCompatibility

Check browser compatibility for OCR features.

```typescript
function checkCompatibility(): Promise<CompatibilityResult>
```

#### CompatibilityResult

```typescript
interface CompatibilityResult {
  // Overall compatibility
  supported: boolean;
  
  // Missing required features
  missingFeatures: string[];
  
  // Performance warnings
  warnings: string[];
  
  // Feature availability
  features: {
    webAssembly: boolean;
    webAssemblyThreads: boolean;
    webAssemblySIMD: boolean;
    sharedArrayBuffer: boolean;
    webGL: boolean;
    webGPU: boolean;
    offscreenCanvas: boolean;
  };
  
  // Browser info
  browser: {
    name: string;
    version: string;
    platform: string;
  };
}
```

### optimizeImage

Optimize image for better OCR performance.

```typescript
function optimizeImage(
  input: File | Blob | HTMLImageElement,
  options?: OptimizeOptions
): Promise<Blob>
```

#### OptimizeOptions

```typescript
interface OptimizeOptions {
  // Maximum dimension (width or height)
  maxDimension?: number; // default: 2048
  
  // Output format
  format?: 'jpeg' | 'png' | 'webp'; // default: 'jpeg'
  
  // JPEG quality (0-1)
  quality?: number; // default: 0.9
  
  // Convert to grayscale
  grayscale?: boolean; // default: false
  
  // Apply sharpening filter
  sharpen?: boolean; // default: false
  
  // Enhance contrast
  enhanceContrast?: boolean; // default: false
}
```

### setDebugMode

Enable or disable debug logging.

```typescript
function setDebugMode(enabled: boolean): void
```

### getVersion

Get library version information.

```typescript
function getVersion(): VersionInfo
```

#### VersionInfo

```typescript
interface VersionInfo {
  version: string;
  onnxRuntimeVersion: string;
  buildDate: string;
  git: {
    commit: string;
    branch: string;
  };
}
```

## Events

The OCR engine emits events during processing that can be listened to:

```typescript
// Listen to events
ocr.on('progress', (progress) => {
  console.log(`Processing: ${progress.percent}%`);
});

ocr.on('modelLoaded', (modelId) => {
  console.log(`Model loaded: ${modelId}`);
});

// Remove listener
ocr.off('progress', progressHandler);
```

### Available Events

| Event | Payload | Description |
|-------|---------|-------------|
| `progress` | `{ percent: number, stage: string }` | Processing progress updates |
| `modelLoaded` | `string` (modelId) | Model successfully loaded |
| `modelLoading` | `string` (modelId) | Model loading started |
| `processingStart` | `void` | Image processing started |
| `processingEnd` | `OCRResult` | Image processing completed |
| `error` | `Error` | Error occurred |
| `warning` | `string` | Non-fatal warning |

## Error Handling

### Error Types

```typescript
// OCR-specific errors
class OCRError extends Error {
  code: string;
  details?: any;
}

// Common error codes
enum ErrorCode {
  // Initialization errors
  INIT_FAILED = 'INIT_FAILED',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  
  // Processing errors
  INVALID_INPUT = 'INVALID_INPUT',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  TIMEOUT = 'TIMEOUT',
  
  // Browser compatibility
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  WASM_NOT_SUPPORTED = 'WASM_NOT_SUPPORTED',
  
  // Resource errors
  OUT_OF_MEMORY = 'OUT_OF_MEMORY',
  WORKER_ERROR = 'WORKER_ERROR'
}
```

### Error Handling Example

```typescript
try {
  const result = await ocr.processImage(file);
} catch (error) {
  if (error instanceof OCRError) {
    switch (error.code) {
      case ErrorCode.OUT_OF_MEMORY:
        // Try with smaller image
        const optimized = await optimizeImage(file, { maxDimension: 1024 });
        const result = await ocr.processImage(optimized);
        break;
        
      case ErrorCode.MODEL_NOT_FOUND:
        // Fallback to default model
        await ocr.initialize();
        break;
        
      default:
        console.error('OCR Error:', error.message);
    }
  }
}
```

## Advanced Usage

### Custom Worker Configuration

```typescript
const ocr = createOCREngine({
  workerPath: '/custom/worker.js',
  numThreads: navigator.hardwareConcurrency || 4
});
```

### Memory Management

```typescript
// Monitor memory usage
const metrics = ocr.getPerformanceMetrics();
if (metrics.memoryUsage?.current > 500) { // MB
  // Free up memory
  ocr.dispose();
  ocr = createOCREngine();
  await ocr.initialize();
}
```

### Batch Processing with Progress

```typescript
async function processBatch(files: File[], onProgress: (progress: number) => void) {
  const ocr = createOCREngine();
  await ocr.initialize();
  
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await ocr.processImage(files[i]);
    results.push(result);
    
    onProgress(((i + 1) / files.length) * 100);
  }
  
  ocr.dispose();
  return results;
}
```

### Custom Model Loading

```typescript
// Load model from custom source
const ocr = createOCREngine({
  modelBasePath: 'https://my-cdn.com/ocr-models/'
});

// Or provide full paths
const customPaths = {
  det: 'https://my-cdn.com/models/detection.onnx',
  rec: 'https://my-cdn.com/models/recognition.onnx',
  cls: 'https://my-cdn.com/models/classification.onnx',
  dict: 'https://my-cdn.com/models/dictionary.txt'
};

await ocr.initializeWithPaths(customPaths);
```

## WebAssembly Configuration

### WASM Feature Detection

```typescript
const features = await detectWASMFeatures();
console.log('SIMD support:', features.simd);
console.log('Threads support:', features.threads);

// Use appropriate WASM variant
const wasmPath = features.simd && features.threads
  ? 'ort-wasm-simd-threaded.wasm'
  : 'ort-wasm.wasm';
```

### Custom WASM Paths

```typescript
const ocr = createOCREngine({
  wasmPaths: {
    'ort-wasm.wasm': '/wasm/ort-wasm.wasm',
    'ort-wasm-simd.wasm': '/wasm/ort-wasm-simd.wasm',
    'ort-wasm-threaded.wasm': '/wasm/ort-wasm-threaded.wasm',
    'ort-wasm-simd-threaded.wasm': '/wasm/ort-wasm-simd-threaded.wasm'
  }
});
```

## Browser-Specific APIs

### Safari/iOS Considerations

```typescript
// Check for iOS Safari limitations
if (isIOSSafari()) {
  // Limit memory usage on iOS
  const options: ProcessingOptions = {
    maxDimension: 1024,
    performance: {
      batchSize: 4 // Smaller batch size
    }
  };
  
  const result = await ocr.processImage(file, options);
}
```

### Chrome-Specific Features

```typescript
// Use Chrome's OffscreenCanvas for better performance
if ('OffscreenCanvas' in window) {
  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext('2d');
  // Process in background thread
}
```

## Testing

### Unit Testing

```typescript
import { createOCREngine } from 'client-side-ocr';
import { mockImage } from './test-utils';

describe('OCR Engine', () => {
  let ocr: OCREngine;
  
  beforeEach(() => {
    ocr = createOCREngine();
  });
  
  afterEach(() => {
    ocr.dispose();
  });
  
  test('should extract text from image', async () => {
    await ocr.initialize();
    
    const image = mockImage('Hello World');
    const result = await ocr.processImage(image);
    
    expect(result.text).toContain('Hello World');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

### E2E Testing

```typescript
// cypress/integration/ocr.spec.ts
describe('OCR Integration', () => {
  it('should process uploaded image', () => {
    cy.visit('/');
    
    // Upload test image
    cy.fixture('test-document.png').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'test-document.png',
        mimeType: 'image/png'
      });
    });
    
    // Wait for processing
    cy.get('[data-testid="ocr-result"]', { timeout: 10000 })
      .should('contain', 'Expected text from test document');
  });
});
```

## Migration Guide

### From v0.x to v1.0

```typescript
// Old API (v0.x)
import OCR from 'client-side-ocr';
const ocr = new OCR();
ocr.init().then(() => {
  ocr.recognize(image).then(text => {
    console.log(text);
  });
});

// New API (v1.0)
import { createOCREngine } from 'client-side-ocr';
const ocr = createOCREngine();
await ocr.initialize();
const result = await ocr.processImage(image);
console.log(result.text);
```

### From Tesseract.js

```typescript
// Tesseract.js
const worker = await Tesseract.createWorker();
await worker.loadLanguage('eng');
await worker.initialize('eng');
const { data: { text } } = await worker.recognize(image);

// Client-Side OCR
const ocr = createOCREngine();
await ocr.initialize('en-mobile');
const { text } = await ocr.processImage(image);
```

## Performance Benchmarks

### Processing Speed Comparison

| Image Size | PaddleOCR v5 | PaddleOCR v4 | Tesseract.js |
|------------|--------------|--------------|---------------|
| 640×480 | 180ms | 220ms | 1500ms |
| 1280×720 | 350ms | 450ms | 3200ms |
| 1920×1080 | 750ms | 950ms | 5500ms |
| 3840×2160 | 2100ms | 2800ms | 12000ms |

*Tested on Chrome 120, Intel i7-10700K, 32GB RAM*

### Memory Usage

| Model | Initial Load | Processing 1080p | Peak Memory |
|-------|--------------|------------------|-------------|
| ppocr-v5 | 120MB | 180MB | 250MB |
| ppocr-v4 | 100MB | 160MB | 220MB |
| en-mobile | 80MB | 140MB | 180MB |
| ppocr-v2-server | 200MB | 350MB | 500MB |

## Changelog

See [CHANGELOG.md](https://github.com/siva-sub/client-ocr/blob/main/CHANGELOG.md) for version history.

## Support

- GitHub Issues: [https://github.com/siva-sub/client-ocr/issues](https://github.com/siva-sub/client-ocr/issues)
- Stack Overflow: Tag with `client-side-ocr`
- Email: sivasub987@gmail.com