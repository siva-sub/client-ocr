# Changelog

## [1.3.0] - 2025-07-28

### Added
- **Table Detection**: Integrated RapidTable for table structure recognition
  - PP-Structure models for English and Chinese
  - SLANet+ model for enhanced accuracy
  - HTML table output with cell detection
- **Layout Analysis**: Integrated RapidLayout for document layout detection
  - PP Layout CDLA model
  - YOLOv8n Layout model for academic papers
  - DocLayout-YOLO for DocStructBench
  - Detects text, titles, tables, figures, and formulas
- **Unified Model Registry**: Centralized management of all OCR models
  - Local models from OnnxOCR directory
  - Local models from ppu-paddle-ocr directory  
  - Remote models from RapidOCR
- **Enhanced UI**: 
  - Processing mode selector (OCR, Table, Layout, All-in-One)
  - Model Manager tab with GitHub links to sources
  - Model source information display
- **Configurable Defaults**: 
  - PPU Paddle OCR English mobile set as default
  - Language-based automatic model selection
  - Customizable model configuration

### Changed
- Updated PP-OCRv5 model URLs to use master branch
- Enhanced OCR interface with unified features
- Improved model selection UI with source information

### Technical
- Added table detection worker with ONNX support
- Added layout detection worker with multi-model support
- Created model configuration system
- Integrated camera, clipboard, and history features

## [1.2.7] - Previous Release
- RapidOCR integration
- Multi-language support
- PWA functionality