// Default model configuration
// Users can override these by changing selections in the Model Manager tab

export const DEFAULT_MODELS = {
  // OCR Models - Default to PPU Paddle OCR English mobile for best performance
  ocr: {
    detection: 'ppu-ppv5-det',      // PP-OCRv5 Mobile Detection from ppu-paddle-ocr
    recognition: 'ppu-ppv4-rec-en', // PP-OCRv4 English Recognition from ppu-paddle-ocr
    classification: 'onnxocr-ppv5-cls' // PP-OCRv5 Classification from onnxocr
  },
  
  // Table Detection Model
  table: 'slanetplus', // SLANet+ for table structure recognition
  
  // Layout Analysis Model
  layout: 'doclayout_docstructbench' // DocLayout-YOLO for document layout
}

// Model source information for UI display
export const MODEL_SOURCES = {
  'ppu-paddle-ocr': {
    name: 'PPU Paddle OCR',
    description: 'Optimized mobile models from @ppu-paddle-ocr',
    url: 'https://github.com/ppu-paddle-ocr'
  },
  'onnxocr': {
    name: 'OnnxOCR',
    description: 'High-performance ONNX models',
    url: 'https://github.com/OnnxOCR'
  },
  'rapidocr': {
    name: 'RapidOCR',
    description: 'Remote models from ModelScope',
    url: 'https://github.com/RapidAI/RapidOCR'
  },
  'rapidtable': {
    name: 'RapidTable',
    description: 'Table structure recognition models',
    url: 'https://github.com/RapidAI/RapidTable'
  },
  'rapidlayout': {
    name: 'RapidLayout',
    description: 'Document layout analysis models',
    url: 'https://github.com/RapidAI/RapidLayout'
  }
}

// Configuration for automatic model selection based on language
export const LANGUAGE_MODEL_MAP: Record<string, { det: string, rec: string }> = {
  'en': {
    det: 'ppu-ppv5-det',
    rec: 'ppu-ppv4-rec-en'
  },
  'ch': {
    det: 'onnxocr-ppv5-det',
    rec: 'onnxocr-ppv5-rec'
  },
  'jp': {
    det: 'onnxocr-ppv5-det',
    rec: 'rapidocr-ppv5-rec'
  },
  'ko': {
    det: 'onnxocr-ppv5-det',
    rec: 'rapidocr-ppv5-rec'
  },
  // Add more language mappings as needed
}