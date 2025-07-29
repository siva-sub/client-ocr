# Client-Side OCR API Reference

## Table of Contents

1. [OCR Engines](#ocr-engines)
2. [Core Classes](#core-classes)
3. [Processing Methods](#processing-methods)
4. [Configuration Options](#configuration-options)
5. [Result Types](#result-types)
6. [Utility Functions](#utility-functions)
7. [React Components](#react-components)
8. [Events and Callbacks](#events-and-callbacks)
9. [Error Handling](#error-handling)

## OCR Engines

### `createRapidOCREngine(config: RapidOCRConfig): RapidOCREngine`

Creates a RapidOCR engine instance with multi-language support.

```typescript
interface RapidOCRConfig {
  language: LanguageCode;        // Language code (e.g., 'en', 'ch', 'ja')
  modelVersion?: 'PP-OCRv4' | 'PP-OCRv5';  // Default: 'PP-OCRv4'
  modelType?: 'mobile' | 'server';          // Default: 'mobile'
  baseUrl?: string;              // Base URL for model files
  cacheModels?: boolean;         // Cache models in IndexedDB
  workerConfig?: WorkerConfig;   // Web Worker configuration
}
```

**Example:**
```typescript
const ocr = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'mobile',
  cacheModels: true
});
```

### `createPPUEngine(config: PPUConfig): PPUEngine`

Creates a PPU PaddleOCR engine instance (English only).

```typescript
interface PPUConfig {
  modelPath: string;        // Path to PPU model files
  cacheModels?: boolean;    // Cache models in IndexedDB
  workerConfig?: WorkerConfig;
}
```

### `createOCREngine(config: OCRConfig): OCREngine`

Generic factory function that creates appropriate engine based on config.

## Core Classes

### `RapidOCREngine`

Main OCR engine class for RapidOCR models.

#### Methods

##### `initialize(): Promise<void>`
Initializes the engine and downloads models if needed.

```typescript
await ocr.initialize();
```

##### `processImage(input: ImageInput, options?: ProcessOptions): Promise<OCRResult>`
Processes an image and returns OCR results.

```typescript
const result = await ocr.processImage(file, {
  enableWordSegmentation: true,
  enableTextClassification: true
});
```

##### `processBatch(inputs: ImageInput[], options?: BatchOptions): Promise<OCRResult[]>`
Processes multiple images in parallel.

```typescript
const results = await ocr.processBatch(images, {
  maxConcurrent: 3,
  onProgress: (current, total) => console.log(`${current}/${total}`)
});
```

##### `cleanup(): Promise<void>`
Cleans up resources and terminates workers.

```typescript
await ocr.cleanup();
```

##### `areModelsCached(): Promise<boolean>`
Checks if models are cached locally.

##### `clearCache(): Promise<void>`
Clears cached models from IndexedDB.

### `ModelDownloader`

Handles model downloading and caching.

#### Methods

##### `downloadModels(config: ModelConfig): Promise<ModelPaths>`
Downloads OCR models with progress tracking.

```typescript
const downloader = new ModelDownloader({
  onProgress: (progress) => console.log(`${progress.percent}% complete`)
});

const paths = await downloader.downloadModels({
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'mobile'
});
```

### `MetaONNXLoader`

Loads ONNX models with embedded metadata.

#### Static Methods

##### `loadModel(modelPath: string): Promise<MetaONNXModel>`
Loads an ONNX model with metadata support.

##### `getDictionary(model: MetaONNXModel, dictPath?: string): Promise<string[]>`
Extracts dictionary from model metadata or external file.

##### `hasEmbeddedDictionary(model: MetaONNXModel): boolean`
Checks if model has embedded dictionary.

## Processing Methods

### Image Input Types

```typescript
type ImageInput = 
  | File                    // File from input element
  | Blob                    // Blob data
  | string                  // URL or base64 data URI
  | HTMLImageElement        // Image element
  | HTMLCanvasElement       // Canvas element
  | ImageData              // Raw image data
  | ArrayBuffer;           // Binary image data
```

### Process Options

```typescript
interface ProcessOptions {
  // Feature flags
  enableWordSegmentation?: boolean;      // Enable word-level segmentation
  enableTextClassification?: boolean;    // Enable rotation detection
  returnConfidence?: boolean;            // Return confidence scores
  
  // Preprocessing configuration
  preprocessConfig?: PreprocessConfig;
  
  // Postprocessing configuration  
  postprocessConfig?: PostprocessConfig;
  
  // Performance options
  useGPU?: boolean;                     // Use WebGL acceleration
  batchSize?: number;                   // Recognition batch size
}
```

### Preprocessing Configuration

```typescript
interface PreprocessConfig {
  // Detection preprocessing
  detectImageNetNorm?: boolean;         // Use ImageNet normalization
  maxSideLen?: number;                  // Max image side length (default: 960)
  detectImageMode?: 'scale' | 'pad';    // Resize mode
  
  // Recognition preprocessing
  recStandardNorm?: boolean;            // Standard normalization
  recImageShape?: [number, number, number]; // [C, H, W]
  
  // General preprocessing
  grayscale?: boolean;                  // Convert to grayscale
  denoise?: boolean;                    // Apply denoising
  deskew?: boolean;                     // Correct skew
  contrast?: number;                    // Contrast adjustment (0.5-2.0)
  brightness?: number;                  // Brightness adjustment (-100 to 100)
  sharpen?: boolean;                    // Apply sharpening
}
```

### Postprocessing Configuration

```typescript
interface PostprocessConfig {
  // DB postprocessing
  unclipRatio?: number;                 // Text region expansion (default: 2.0)
  boxThresh?: number;                   // Box confidence threshold (default: 0.7)
  minBoxSize?: number;                  // Minimum box size in pixels
  
  // Text postprocessing
  mergeRotatedBoxes?: boolean;          // Merge boxes for rotated text
  filterOverlapping?: boolean;          // Remove overlapping boxes
  sortMode?: 'top-to-bottom' | 'left-to-right';
}
```

## Configuration Options

### Language Codes

```typescript
type LanguageCode = 
  | 'ch'    // Chinese (Simplified & Traditional)
  | 'en'    // English
  | 'ja'    // Japanese
  | 'ko'    // Korean
  | 'fr'    // French
  | 'de'    // German
  | 'es'    // Spanish
  | 'pt'    // Portuguese
  | 'it'    // Italian
  | 'ru'    // Russian
  | 'ar'    // Arabic
  | 'hi'    // Hindi
  | 'vi'    // Vietnamese
  | 'id'    // Indonesian
  | 'fa'    // Persian
  | 'ka'    // Kannada
  // ... 100+ more languages
```

### Worker Configuration

```typescript
interface WorkerConfig {
  numWorkers?: number;          // Number of workers (default: CPU cores)
  workerPath?: string;          // Custom worker script path
  terminateOnIdle?: boolean;    // Terminate idle workers
  idleTimeout?: number;         // Idle timeout in ms
  wasmPath?: string;           // Custom WASM file path
}
```

## Result Types

### OCRResult

Main result object returned by processing methods.

```typescript
interface OCRResult {
  // Text content
  text: string;                        // Full extracted text
  lines: TextLine[];                   // Text lines with positions
  wordBoxes?: WordBox[];              // Word-level boxes (if enabled)
  
  // Metadata
  confidence: number;                  // Overall confidence (0-1)
  angle?: 0 | 180;                    // Detected rotation
  language?: string;                   // Detected language
  
  // Performance metrics
  processingTime: ProcessingTime;      // Time breakdown
  
  // Debug info
  debugInfo?: DebugInfo;              // Additional debug data
}
```

### TextLine

Individual text line with position and confidence.

```typescript
interface TextLine {
  text: string;                        // Line text content
  box: BoundingBox;                    // Position coordinates
  confidence: number;                  // Line confidence (0-1)
  words?: WordBox[];                   // Word boxes within line
}
```

### BoundingBox

Quadrilateral bounding box for text regions.

```typescript
interface BoundingBox {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

interface Point {
  x: number;
  y: number;
}
```

### WordBox

Word-level segmentation result.

```typescript
interface WordBox {
  text: string;                        // Word text
  box: BoundingBox;                    // Word position
  confidence: number;                  // Word confidence
  isNumeric?: boolean;                 // Is pure number
  isAlpha?: boolean;                   // Is pure letters
  language?: string;                   // Detected language
}
```

### ProcessingTime

Performance metrics breakdown.

```typescript
interface ProcessingTime {
  total: number;                       // Total time in ms
  detection: number;                   // Detection stage time
  recognition: number;                 // Recognition stage time
  classification?: number;             // Classification time
  preprocessing?: number;              // Preprocessing time
  postprocessing?: number;            // Postprocessing time
  modelLoading?: number;              // Model loading time
}
```

## Utility Functions

### Image Processing

#### `preprocessImage(input: ImageInput, config: PreprocessConfig): Promise<ImageData>`
Applies preprocessing to an image.

```typescript
const enhanced = await preprocessImage(image, {
  grayscale: true,
  denoise: true,
  contrast: 1.5
});
```

#### `resizeImage(input: ImageInput, options: ResizeOptions): Promise<Blob>`
Resizes an image while maintaining quality.

```typescript
interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number;  // 0-1 for lossy formats
}
```

#### `detectTextOrientation(input: ImageInput): Promise<0 | 90 | 180 | 270>`
Detects text orientation in an image.

### Text Processing

#### `mergeTextLines(lines: TextLine[], options?: MergeOptions): string`
Merges text lines into paragraphs.

```typescript
interface MergeOptions {
  lineSpacing?: number;        // Threshold for paragraph breaks
  horizontalSpacing?: number;  // Threshold for word spacing
  preserveLayout?: boolean;    // Maintain spatial layout
}
```

#### `extractPatterns(text: string): PatternMatches`
Extracts common patterns from text.

```typescript
interface PatternMatches {
  emails: string[];
  phones: string[];
  urls: string[];
  dates: string[];
  numbers: string[];
  currencies: string[];
}
```

### Language Detection

#### `detectLanguage(input: ImageInput | string): Promise<LanguageCode>`
Detects the primary language of text.

```typescript
const language = await detectLanguage(image);
// or
const language = await detectLanguage("Hello world");
```

#### `getSupportedLanguages(): LanguageInfo[]`
Returns list of supported languages.

```typescript
interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  supportedModels: ModelVersion[];
}
```

## React Components

### `<RapidOCRInterface>`

Full-featured OCR interface component.

```tsx
interface RapidOCRInterfaceProps {
  // Configuration
  defaultLanguage?: LanguageCode;
  modelVersion?: ModelVersion;
  modelType?: ModelType;
  
  // Features
  enableWordSegmentation?: boolean;
  enableTextClassification?: boolean;
  enablePreprocessing?: boolean;
  showPerformanceMetrics?: boolean;
  
  // Callbacks
  onResult?: (result: OCRResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: Progress) => void;
  
  // UI customization
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
  customStyles?: React.CSSProperties;
}
```

### `<OCRDropzone>`

Drag-and-drop file upload component.

```tsx
interface OCRDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string[];              // MIME types
  maxFiles?: number;
  maxSize?: number;              // Bytes
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}
```

### `<OCRResultViewer>`

Component for displaying OCR results.

```tsx
interface OCRResultViewerProps {
  result: OCRResult;
  showConfidence?: boolean;
  showBoundingBoxes?: boolean;
  highlightMode?: 'word' | 'line' | 'none';
  onTextSelect?: (text: string) => void;
  editable?: boolean;
}
```

### React Hooks

#### `useOCR(config?: OCRConfig): UseOCRResult`

React hook for OCR functionality.

```typescript
interface UseOCRResult {
  // Methods
  processImage: (input: ImageInput) => Promise<OCRResult>;
  processBatch: (inputs: ImageInput[]) => Promise<OCRResult[]>;
  cancel: () => void;
  
  // State
  processing: boolean;
  progress: number;  // 0-1
  result: OCRResult | null;
  error: Error | null;
  
  // Engine management
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  initialized: boolean;
}
```

## Events and Callbacks

### Progress Events

```typescript
interface Progress {
  stage: 'download' | 'initialize' | 'process';
  current: number;
  total: number;
  percent: number;
  message?: string;
}

// Usage
const ocr = createRapidOCREngine({
  language: 'en',
  onProgress: (progress) => {
    console.log(`${progress.stage}: ${progress.percent}%`);
  }
});
```

### Model Download Progress

```typescript
interface DownloadProgress {
  file: string;              // Current file
  bytesLoaded: number;
  bytesTotal: number;
  filesCompleted: number;
  filesTotal: number;
  percent: number;
}
```

## Error Handling

### Error Types

```typescript
class OCRError extends Error {
  code: OCRErrorCode;
  details?: any;
}

enum OCRErrorCode {
  // Initialization errors
  MODEL_DOWNLOAD_FAILED = 'MODEL_DOWNLOAD_FAILED',
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  WORKER_INIT_FAILED = 'WORKER_INIT_FAILED',
  
  // Processing errors
  INVALID_IMAGE = 'INVALID_IMAGE',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  TIMEOUT = 'TIMEOUT',
  
  // Resource errors
  OUT_OF_MEMORY = 'OUT_OF_MEMORY',
  WEBGL_NOT_SUPPORTED = 'WEBGL_NOT_SUPPORTED',
  WORKER_NOT_SUPPORTED = 'WORKER_NOT_SUPPORTED',
  
  // Configuration errors
  INVALID_LANGUAGE = 'INVALID_LANGUAGE',
  INVALID_MODEL = 'INVALID_MODEL',
  INVALID_CONFIG = 'INVALID_CONFIG'
}
```

### Error Handling Examples

```typescript
try {
  const result = await ocr.processImage(file);
} catch (error) {
  if (error instanceof OCRError) {
    switch (error.code) {
      case OCRErrorCode.INVALID_IMAGE:
        console.error('Invalid image format');
        break;
      case OCRErrorCode.OUT_OF_MEMORY:
        console.error('Image too large, try reducing size');
        break;
      default:
        console.error('OCR failed:', error.message);
    }
  }
}
```

### Retry Logic

```typescript
async function processWithRetry(
  image: ImageInput, 
  maxRetries = 3
): Promise<OCRResult> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ocr.processImage(image);
    } catch (error) {
      lastError = error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  
  throw lastError;
}
```

## Advanced Topics

### Custom Model Integration

```typescript
// Register custom ONNX model
const customOCR = new RapidOCREngine({
  customModels: {
    detection: '/models/custom-det.onnx',
    recognition: '/models/custom-rec.onnx',
    dictionary: '/models/custom-dict.txt'
  }
});
```

### WebAssembly Configuration

```typescript
// Configure ONNX Runtime WASM settings
const ocr = createRapidOCREngine({
  language: 'en',
  wasmConfig: {
    numThreads: 4,
    simd: true,
    proxy: true,
    fetchOptions: {
      cache: 'force-cache'
    }
  }
});
```

### Performance Monitoring

```typescript
// Enable detailed performance metrics
const ocr = createRapidOCREngine({
  language: 'en',
  debug: true,
  collectMetrics: true
});

const result = await ocr.processImage(image);
console.log('Detailed metrics:', result.debugInfo.metrics);
```