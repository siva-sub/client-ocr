# Client-Side OCR - Usage Guide

A powerful, privacy-focused OCR (Optical Character Recognition) web application that runs entirely in your browser. No server uploads, no data tracking - your documents stay on your device.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic OCR Processing](#basic-ocr-processing)
  - [Image Preprocessing](#image-preprocessing)
  - [Language Support](#language-support)
  - [PDF Processing](#pdf-processing)
  - [Performance Monitoring](#performance-monitoring)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### 🚀 Core Features
- **100% Client-Side Processing**: All OCR processing happens in your browser
- **Multi-Language Support**: Supports 100+ languages including English, Chinese, Japanese, Korean, Tamil, Hindi, Arabic, and more
- **High Performance**: Uses ONNX Runtime with WebAssembly for fast processing
- **Multiple Input Methods**: 
  - Drag & drop files
  - File selection
  - Camera capture (mobile)
  - URL input
  - Clipboard paste
- **File Format Support**:
  - Images: JPG, PNG, WebP, GIF, BMP, TIFF
  - Documents: PDF (with text layer detection)
- **Progressive Web App (PWA)**: Install and use offline

### 🎨 Advanced Features
- **Image Preprocessing**:
  - Auto-enhancement detection
  - Grayscale conversion
  - Noise reduction
  - Contrast adjustment
  - Image sharpening
  - Auto-deskew
  - Background removal
- **Performance Monitoring**:
  - Real-time processing metrics
  - Stage-by-stage progress tracking
  - Resource usage monitoring
- **Export Options**:
  - Copy to clipboard
  - Export as TXT
  - Export as JSON (with coordinates)
- **Dark Mode Support**
- **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

### Using npm

```bash
npm install client-side-ocr
```

### Using yarn

```bash
yarn add client-side-ocr
```

### Using pnpm

```bash
pnpm add client-side-ocr
```

### CDN Usage

```html
<!-- Add to your HTML -->
<script type="module">
  import { RapidOCREngine } from 'https://unpkg.com/client-side-ocr@latest/dist/index.js';
</script>
```

## Usage

### Basic OCR Processing

```javascript
import { RapidOCREngine } from 'client-side-ocr';

// Initialize the OCR engine
const ocr = new RapidOCREngine({
  lang: 'en',  // Language code
  version: 'PP-OCRv4',  // Model version
  modelType: 'mobile'  // 'mobile' for speed, 'server' for accuracy
});

// Initialize models (one-time setup)
await ocr.initialize();

// Process an image
const imageElement = document.getElementById('myImage');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = imageElement.width;
canvas.height = imageElement.height;
ctx.drawImage(imageElement, 0, 0);

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const results = await ocr.process(
  imageData.data,
  imageData.width,
  imageData.height
);

// Results contain text and bounding boxes
results.forEach(result => {
  console.log('Text:', result.text);
  console.log('Confidence:', result.confidence);
  console.log('Bounding box:', result.box);
});
```

### Image Preprocessing

```javascript
import { ImagePreprocessor } from 'client-side-ocr';

// Auto-preprocess for best results
const { processed, appliedOptions } = await ImagePreprocessor.autoPreprocess(imageData);

// Or manually configure preprocessing
const preprocessed = await ImagePreprocessor.preprocess(imageData, {
  grayscale: true,
  denoise: true,
  contrast: true,
  contrastAlpha: 1.5,
  sharpen: true,
  deskew: true,
  threshold: true,
  thresholdValue: 127
});
```

### Language Support

```javascript
// Get available languages
const languages = RapidOCREngine.getAvailableLanguages();

// Check if a language is supported
if (RapidOCREngine.isLanguageSupported('ta', 'PP-OCRv4')) {
  const tamilOCR = new RapidOCREngine({ lang: 'ta' });
}

// Multi-language text (Chinese example)
const chineseOCR = new RapidOCREngine({ 
  lang: 'ch',
  modelType: 'server' // Better for complex scripts
});
```

### PDF Processing

```javascript
import { pdfProcessor } from 'client-side-ocr';

// Load and process PDF
const pdfFile = document.getElementById('pdfInput').files[0];
const { pages, pdf } = await pdfProcessor.extractTextFromPDF(pdfFile, {
  scale: 2.0,  // Higher scale for better OCR
  maxPages: 10,  // Limit pages
  onProgress: (progress) => {
    console.log(`Processing page ${progress.currentPage}/${progress.totalPages}`);
  }
});

// Check if PDF has selectable text
const hasText = await pdfProcessor.hasSelectableText(pdf);
if (hasText) {
  const nativeText = await pdfProcessor.extractNativeText(pdf);
  console.log('Extracted text:', nativeText);
} else {
  // Process with OCR
  for (const page of pages) {
    const results = await ocr.process(
      page.imageData.data,
      page.width,
      page.height
    );
  }
}

// Clean up
pdfProcessor.destroy(pdf);
```

### Performance Monitoring

```javascript
// Set progress callback
ocr.setProgressCallback((progress) => {
  console.log(`${progress.stage}: ${Math.round(progress.progress * 100)}%`);
});

// Monitor download progress for models
ocr.setDownloadProgressCallback((progress) => {
  console.log(`Downloading ${progress.file}: ${progress.progress}%`);
});

// Check if models are cached
const modelsAvailable = await ocr.areModelsAvailable();
if (!modelsAvailable) {
  await ocr.downloadModels();
}
```

## API Documentation

### RapidOCREngine

#### Constructor Options

```typescript
interface OCREngineOptions {
  lang?: LangType;         // Language code (default: 'en')
  version?: OCRVersion;    // Model version (default: 'PP-OCRv4')
  modelType?: ModelType;   // 'mobile' | 'server' (default: 'mobile')
  config?: Partial<OCRConfig>;  // Advanced configuration
  modelBasePath?: string;  // Custom model path
  enableWordBoxes?: boolean;  // Enable word-level boxes
}
```

#### Methods

- `initialize(): Promise<void>` - Initialize the OCR engine
- `process(imageData: Uint8ClampedArray, width: number, height: number): Promise<OCRResult[]>` - Process an image
- `setProgressCallback(callback: (progress: OCRProgress) => void): void` - Set progress callback
- `setDownloadProgressCallback(callback: (progress: DownloadProgress) => void): void` - Set download progress callback
- `areModelsAvailable(): Promise<boolean>` - Check if models are cached
- `downloadModels(): Promise<void>` - Download models if not cached
- `dispose(): void` - Clean up resources

### ImagePreprocessor

#### Methods

- `preprocess(imageData: ImageData, options: PreprocessingOptions): Promise<ImageData>` - Apply preprocessing
- `autoPreprocess(imageData: ImageData): Promise<{ processed: ImageData, appliedOptions: PreprocessingOptions }>` - Auto-detect best preprocessing

#### Preprocessing Options

```typescript
interface PreprocessingOptions {
  grayscale?: boolean;         // Convert to grayscale
  threshold?: boolean;         // Apply binary threshold
  thresholdValue?: number;     // Threshold value (0-255)
  denoise?: boolean;           // Remove noise
  denoiseStrength?: number;    // Noise reduction strength
  contrast?: boolean;          // Enhance contrast
  contrastAlpha?: number;      // Contrast factor
  contrastBeta?: number;       // Brightness adjustment
  sharpen?: boolean;           // Sharpen image
  deskew?: boolean;            // Auto-straighten text
  removeBackground?: boolean;  // Simple background removal
  scale?: number;              // Image scale factor
}
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Base URL for deployment
VITE_BASE_URL=/client-ocr/

# Model CDN (optional, defaults to jsDelivr)
VITE_MODEL_CDN=https://cdn.jsdelivr.net/npm/

# Enable debug mode
VITE_DEBUG=false
```

### Language Configuration

Languages are configured in `src/core/language-models.ts`. Each language includes:

```typescript
{
  name: string;           // Display name
  nativeName: string;     // Native script name
  direction: 'ltr'|'rtl'; // Text direction
  models: {
    det: {...},  // Detection models
    rec: {...},  // Recognition models
    cls: {...}   // Classification models
  }
}
```

## Development

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/client-side-ocr.git
cd client-side-ocr

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
client-side-ocr/
├── src/
│   ├── core/                 # Core OCR functionality
│   │   ├── rapid-ocr-engine.ts
│   │   ├── language-models.ts
│   │   ├── preprocessing/
│   │   └── postprocessing/
│   ├── workers/              # Web Workers for processing
│   ├── ui/                   # React components
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── dist/                     # Build output
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## Deployment

### GitHub Pages

```bash
# Build and deploy to GitHub Pages
npm run build
npm run deploy
```

### Self-Hosting

1. Build the project:
```bash
npm run build
```

2. Serve the `dist` folder with any static file server:
```bash
npx serve dist -p 3000
```

### Docker

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t client-ocr .
docker run -p 8080:80 client-ocr
```

## Performance Tips

1. **Use appropriate model type**:
   - `mobile`: Faster, good for real-time processing
   - `server`: More accurate, better for complex documents

2. **Preprocess images**:
   - Use auto-preprocessing for best results
   - Enable specific options based on your input

3. **Optimize for your use case**:
   - For mobile: Use lower resolution images
   - For accuracy: Use higher resolution and server models

4. **Cache models**:
   - Models are cached in IndexedDB after first download
   - Check `areModelsAvailable()` before processing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15.4+
- Edge 90+

WebAssembly and Web Workers are required.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RapidOCR](https://github.com/RapidAI/RapidOCR) for the OCR models
- [ONNX Runtime Web](https://github.com/microsoft/onnxruntime) for inference
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) for image processing
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF handling

## Support

- 📧 Email: support@clientsideocr.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/client-side-ocr/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/client-side-ocr/discussions)
- 📖 Docs: [Documentation](https://clientsideocr.com/docs)