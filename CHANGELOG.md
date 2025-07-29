# Changelog

## [2.0.0] - 2025-01-28

### Added
- **PPU PaddleOCR Model Support**: Added full support for PPU PaddleOCR models with specialized preprocessing
- **Extended Language Support**: Expanded from 14 to 100+ languages with comprehensive model coverage
- **Stack Overflow Prevention**: Safe handling of large documents without memory errors
- **Enhanced Documentation**: 
  - Comprehensive usage guide with examples
  - Detailed API reference
  - Troubleshooting guide covering common issues and fixes
  - Model documentation with architecture details
- **Model Width Limiting**: Automatic width limiting for PPU models to prevent memory issues
- **Improved Error Handling**: Better error messages and recovery strategies

### Changed
- **PPU Model Preprocessing**: Fixed incorrect text recognition by implementing proper grayscale conversion (red channel only) and 0-based dictionary indexing
- **Array Operations**: Replaced spread operators with loops to prevent stack overflow on large arrays
- **Debug Logging**: Made debug output safer by skipping operations on large tensors
- **Documentation Structure**: Reorganized docs into separate files for better navigation
- **Version Bump**: Major version update to 2.0.0 reflecting significant changes

### Fixed
- **PPU Model Recognition**: Fixed critical issue where PPU models were returning gibberish text ("Sdrs", "NBQ", etc.) instead of correct predictions
- **Stack Overflow Errors**: Fixed "Maximum call stack size exceeded" errors when processing large documents
- **Memory Management**: Improved memory handling for large image processing
- **TypeScript Compatibility**: Fixed Float32Array type issues

### Technical Details
- PPU models now use red channel only for grayscale conversion (not standard luminance formula)
- PPU models use 0-based dictionary indexing (not 1-based with blank token offset)
- Maximum width limited to 800px for PPU models to prevent memory issues
- Safer array operations throughout the codebase to handle large data
- Enhanced preprocessing pipeline with model-specific normalization

## [1.3.0] - 2025-01-15

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

## [1.2.7] - 2024-12-20

### Added
- RapidOCR integration with 14 language support
- Meta ONNX model support with embedded dictionaries
- Word-level segmentation
- Text rotation detection (0° and 180°)
- Batch processing optimization
- Progressive Web App (PWA) support
- Offline capability with service workers
- Camera capture functionality
- PDF processing support

### Changed
- Improved model downloading with progress tracking
- Better caching strategy using IndexedDB
- Enhanced preprocessing pipeline
- Migrated to Vite for faster builds
- Updated to React 19
- Improved UI with Mantine v8

## [1.0.0] - 2023-10-01

### Added
- Initial release
- Basic OCR functionality with ONNX Runtime
- Support for English and Chinese
- Simple web interface