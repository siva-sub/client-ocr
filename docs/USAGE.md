# Client-Side OCR Usage Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Using the Library](#using-the-library)
3. [React Integration](#react-integration)
4. [Web Application Usage](#web-application-usage)
5. [Advanced Features](#advanced-features)
6. [Model Selection](#model-selection)
7. [Language Support](#language-support)
8. [Performance Tips](#performance-tips)
9. [Examples](#examples)

## Getting Started

### Installation

```bash
npm install client-side-ocr
# or
yarn add client-side-ocr
# or
pnpm add client-side-ocr
```

### Basic Setup

```typescript
import { createOCREngine } from 'client-side-ocr';

// Create an OCR engine instance
const ocr = createOCREngine({
  language: 'en',           // Language code
  modelVersion: 'PP-OCRv4', // Model version
  modelType: 'mobile'       // 'mobile' or 'server'
});

// Initialize the engine (downloads models if needed)
await ocr.initialize();

// Process an image
const result = await ocr.processImage(imageFile);
console.log(result.text);
```

## Using the Library

### Creating an OCR Engine

The library supports two types of OCR engines:

#### RapidOCR Engine (Recommended)

```typescript
import { createRapidOCREngine } from 'client-side-ocr';

const ocr = createRapidOCREngine({
  language: 'en',           // Language code (see supported languages)
  modelVersion: 'PP-OCRv4', // 'PP-OCRv4' or 'PP-OCRv5'
  modelType: 'mobile',      // 'mobile' (faster) or 'server' (more accurate)
  baseUrl: '/models',       // Optional: custom model directory
  cacheModels: true         // Optional: cache models in IndexedDB
});
```

#### PPU Engine (Alternative)

```typescript
import { createPPUEngine } from 'client-side-ocr';

const ocr = createPPUEngine({
  modelPath: '/models/ppu', // Path to PPU models
  cacheModels: true
});
```

### Processing Images

#### Basic Image Processing

```typescript
// From File input
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files[0];
const result = await ocr.processImage(file);

// From URL
const imageUrl = 'https://example.com/image.jpg';
const result = await ocr.processImage(imageUrl);

// From Canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const blob = await new Promise(resolve => canvas.toBlob(resolve));
const result = await ocr.processImage(blob);

// From ImageData
const imageData = ctx.getImageData(0, 0, width, height);
const result = await ocr.processImage(imageData);
```

#### Advanced Processing Options

```typescript
const result = await ocr.processImage(file, {
  // Text classification (rotation detection)
  enableTextClassification: true,
  
  // Word-level segmentation
  enableWordSegmentation: true,
  
  // Return confidence scores
  returnConfidence: true,
  
  // Preprocessing options
  preprocessConfig: {
    detectImageNetNorm: true,    // Use ImageNet normalization for detection
    recStandardNorm: true,       // Standard normalization for recognition
    maxSideLen: 960,            // Maximum image side length
    detectImageMode: 'scale'     // 'scale' or 'pad'
  },
  
  // Postprocessing options
  postprocessConfig: {
    unclipRatio: 2.0,           // Text region expansion ratio
    boxThresh: 0.7,             // Confidence threshold for boxes
    minBoxSize: 10              // Minimum box size in pixels
  }
});

// Access results
console.log(result.text);            // Full extracted text
console.log(result.confidence);      // Overall confidence score
console.log(result.lines);           // Array of text lines with positions
console.log(result.wordBoxes);       // Word-level bounding boxes
console.log(result.angle);           // Detected rotation (0° or 180°)
console.log(result.processingTime);  // Time breakdown by stage
```

### Processing PDFs

```typescript
import { processPDF } from 'client-side-ocr';

const pdfFile = document.getElementById('pdf-input').files[0];

// Process all pages
const results = await processPDF(pdfFile, ocr, {
  maxPages: 10,              // Limit pages to process
  renderScale: 2.0,          // Scale for rendering (higher = better quality)
  onProgress: (progress) => {
    console.log(`Processing: ${progress.current}/${progress.total} pages`);
  }
});

// Results is an array with one entry per page
results.forEach((pageResult, index) => {
  console.log(`Page ${index + 1}:`, pageResult.text);
});
```

## React Integration

### Using the React Component

```tsx
import { RapidOCRInterface } from 'client-side-ocr/react';

function App() {
  const handleResult = (result) => {
    console.log('OCR Result:', result.text);
    console.log('Confidence:', result.confidence);
    console.log('Processing time:', result.processingTime);
  };

  return (
    <RapidOCRInterface
      defaultLanguage="en"
      modelVersion="PP-OCRv4"
      onResult={handleResult}
      onError={(error) => console.error(error)}
      enableWordSegmentation={true}
      enableTextClassification={true}
      theme="light"
    />
  );
}
```

### Custom React Hook

```tsx
import { useOCR } from 'client-side-ocr/react';

function MyComponent() {
  const { 
    processImage, 
    processing, 
    progress, 
    result, 
    error 
  } = useOCR({
    language: 'en',
    modelVersion: 'PP-OCRv4'
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processImage(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={processing} />
      {processing && <p>Processing... {Math.round(progress * 100)}%</p>}
      {result && <pre>{result.text}</pre>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Web Application Usage

### Main Interface

The web application provides three main tabs:

#### 1. OCR Processing Tab
- **Drag & Drop**: Simply drag and drop images or PDFs onto the upload area
- **File Selection**: Click "Choose files" to browse and select files
- **Camera Capture**: Use "Camera" button to capture from device camera
- **URL Input**: Click "From URL" to process images from web URLs
- **Paste from Clipboard**: Ctrl+V to paste images directly

#### 2. Preprocessing Tab
- Enable/disable image preprocessing
- Configure enhancement options:
  - Auto-enhancement
  - Denoising
  - Deskewing
  - Contrast adjustment
- Preview preprocessed images

#### 3. Performance Tab
- View real-time performance metrics
- Processing time breakdown by stage
- Memory usage statistics
- Model loading times

### Settings

Access settings via the gear icon:
- **Language Selection**: Choose from 100+ supported languages
- **Model Version**: Select between PP-OCRv4 and PP-OCRv5
- **Model Type**: Choose mobile (faster) or server (more accurate)
- **Cache Settings**: Enable/disable model caching
- **Export Options**: Configure output format

## Advanced Features

### Batch Processing

```typescript
// Process multiple images in parallel
const images = Array.from(fileInput.files);
const results = await Promise.all(
  images.map(img => ocr.processImage(img))
);

// Or use batch method for optimized processing
const batchResults = await ocr.processBatch(images, {
  maxConcurrent: 3,  // Process 3 images at a time
  onProgress: (current, total) => {
    console.log(`Processing ${current}/${total}`);
  }
});
```

### Custom Preprocessing

```typescript
import { preprocessImage } from 'client-side-ocr/preprocessing';

// Apply custom preprocessing before OCR
const enhanced = await preprocessImage(imageFile, {
  grayscale: true,
  denoise: true,
  deskew: true,
  contrast: 1.2,
  brightness: 0,
  sharpen: true
});

const result = await ocr.processImage(enhanced);
```

### Word-Level Analysis

```typescript
const result = await ocr.processImage(file, {
  enableWordSegmentation: true
});

// Analyze individual words
result.wordBoxes.forEach(wordBox => {
  console.log(`Word: ${wordBox.text}`);
  console.log(`Position: ${wordBox.box}`);
  console.log(`Confidence: ${wordBox.confidence}`);
  
  // Check if it's a number, email, etc.
  if (/^\d+$/.test(wordBox.text)) {
    console.log('Found number:', wordBox.text);
  }
});
```

### Streaming Results

```typescript
// Process large documents with streaming
const stream = await ocr.processImageStream(largeFile, {
  chunkSize: 100, // Process 100 text regions at a time
  onChunk: (chunk) => {
    // Handle each chunk of results
    displayResults(chunk);
  }
});

await stream.complete();
```

## Model Selection

### Choosing the Right Model

| Model | Use Case | Speed | Accuracy | Size |
|-------|----------|-------|----------|------|
| PP-OCRv4 Mobile | Quick scanning, real-time | ⚡⚡⚡ | ⭐⭐⭐ | ~15MB |
| PP-OCRv4 Server | Documents, high quality | ⚡⚡ | ⭐⭐⭐⭐ | ~30MB |
| PP-OCRv5 Mobile | Latest, balanced | ⚡⚡⚡ | ⭐⭐⭐⭐ | ~18MB |
| PP-OCRv5 Server | Best accuracy | ⚡ | ⭐⭐⭐⭐⭐ | ~35MB |
| PPU Models | English documents | ⚡⚡⚡ | ⭐⭐⭐⭐ | ~20MB |

### Dynamic Model Switching

```typescript
// Start with fast mobile model
let ocr = createRapidOCREngine({
  language: 'en',
  modelVersion: 'PP-OCRv4',
  modelType: 'mobile'
});

// Switch to server model for important documents
async function processImportantDoc(file) {
  // Cleanup previous engine
  await ocr.cleanup();
  
  // Create new engine with server model
  ocr = createRapidOCREngine({
    language: 'en',
    modelVersion: 'PP-OCRv4',
    modelType: 'server'
  });
  
  await ocr.initialize();
  return ocr.processImage(file);
}
```

## Language Support

### Supported Languages

The library supports 100+ languages. Here are some common ones:

```typescript
// Single language
const ocrEnglish = createRapidOCREngine({ language: 'en' });
const ocrChinese = createRapidOCREngine({ language: 'ch' });
const ocrJapanese = createRapidOCREngine({ language: 'ja' });
const ocrKorean = createRapidOCREngine({ language: 'ko' });
const ocrFrench = createRapidOCREngine({ language: 'fr' });
const ocrGerman = createRapidOCREngine({ language: 'de' });
const ocrSpanish = createRapidOCREngine({ language: 'es' });
const ocrRussian = createRapidOCREngine({ language: 'ru' });
const ocrArabic = createRapidOCREngine({ language: 'ar' });
const ocrHindi = createRapidOCREngine({ language: 'hi' });
```

### Language Detection

```typescript
import { detectLanguage } from 'client-side-ocr/utils';

// Detect language from image
const detectedLang = await detectLanguage(imageFile);
console.log('Detected language:', detectedLang);

// Create OCR engine with detected language
const ocr = createRapidOCREngine({ 
  language: detectedLang 
});
```

## Performance Tips

### 1. Image Optimization

```typescript
// Resize large images before processing
import { resizeImage } from 'client-side-ocr/utils';

const optimized = await resizeImage(largeImage, {
  maxWidth: 2048,
  maxHeight: 2048,
  maintainAspectRatio: true
});

const result = await ocr.processImage(optimized);
```

### 2. Model Caching

```typescript
// Enable model caching for faster subsequent loads
const ocr = createRapidOCREngine({
  language: 'en',
  cacheModels: true,  // Cache in IndexedDB
  cacheExpiry: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Check if models are cached
const isCached = await ocr.areModelsCached();
console.log('Models cached:', isCached);
```

### 3. Web Worker Optimization

```typescript
// Configure worker pool for better performance
const ocr = createRapidOCREngine({
  language: 'en',
  workerConfig: {
    numWorkers: navigator.hardwareConcurrency || 4,
    workerPath: '/workers/',  // Custom worker path
    terminateOnIdle: true,    // Free memory when idle
    idleTimeout: 30000        // 30 seconds
  }
});
```

### 4. Memory Management

```typescript
// Process large batches with memory limits
const results = [];
const batchSize = 5;

for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  const batchResults = await Promise.all(
    batch.map(f => ocr.processImage(f))
  );
  results.push(...batchResults);
  
  // Optional: Force garbage collection
  if (global.gc) global.gc();
}

// Cleanup when done
await ocr.cleanup();
```

## Examples

### Receipt Scanner

```typescript
async function scanReceipt(imageFile) {
  const ocr = createRapidOCREngine({ 
    language: 'en',
    modelType: 'server'  // Better for small text
  });
  
  await ocr.initialize();
  
  const result = await ocr.processImage(imageFile, {
    enableWordSegmentation: true,
    preprocessConfig: {
      contrast: 1.5,     // Enhance faded receipts
      sharpen: true
    }
  });
  
  // Extract structured data
  const receiptData = {
    total: extractTotal(result.text),
    date: extractDate(result.text),
    items: extractLineItems(result.lines),
    merchant: extractMerchant(result.text)
  };
  
  return receiptData;
}
```

### Business Card Reader

```typescript
async function readBusinessCard(imageFile) {
  const result = await ocr.processImage(imageFile, {
    enableWordSegmentation: true
  });
  
  // Extract contact info using patterns
  const contact = {
    name: findName(result.lines),
    email: findEmail(result.text),
    phone: findPhone(result.text),
    company: findCompany(result.lines),
    address: findAddress(result.lines)
  };
  
  return contact;
}

function findEmail(text) {
  const match = text.match(/\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/);
  return match ? match[0] : null;
}

function findPhone(text) {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : null;
}
```

### Document Batch Processor

```typescript
async function processDocumentBatch(files) {
  const ocr = createRapidOCREngine({ 
    language: 'en',
    modelVersion: 'PP-OCRv5',
    modelType: 'server'
  });
  
  await ocr.initialize();
  
  const results = [];
  const errors = [];
  
  for (const [index, file] of files.entries()) {
    try {
      console.log(`Processing ${index + 1}/${files.length}: ${file.name}`);
      
      const result = await ocr.processImage(file, {
        enableTextClassification: true,  // Auto-rotate
        enableWordSegmentation: true
      });
      
      results.push({
        filename: file.name,
        text: result.text,
        confidence: result.confidence,
        wordCount: result.wordBoxes?.length || 0
      });
      
    } catch (error) {
      errors.push({
        filename: file.name,
        error: error.message
      });
    }
  }
  
  // Generate report
  const report = {
    processed: results.length,
    failed: errors.length,
    totalWords: results.reduce((sum, r) => sum + r.wordCount, 0),
    averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
    results,
    errors
  };
  
  await ocr.cleanup();
  return report;
}
```

### Real-time Camera OCR

```typescript
async function setupCameraOCR() {
  const video = document.getElementById('camera-feed') as HTMLVideoElement;
  const ocr = createRapidOCREngine({ 
    language: 'en',
    modelType: 'mobile'  // Fast for real-time
  });
  
  await ocr.initialize();
  
  // Setup camera
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'environment' } 
  });
  video.srcObject = stream;
  
  // Process frames
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  setInterval(async () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = await ocr.processImage(imageData);
      
      if (result.text) {
        displayResult(result.text);
      }
    }
  }, 1000); // Process once per second
}
```

## Next Steps

- Check the [API Reference](./API.md) for detailed method documentation
- See [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues
- Explore [Model Documentation](./MODELS.md) for model details
- Visit the [live demo](https://siva-sub.github.io/client-ocr/) to try it out