#!/bin/bash

echo "Fixing TypeScript build errors..."

# Fix type-only imports in model-downloader
sed -i '3d' src/core/model-downloader.ts

# Fix icon imports in EnhancedOCRInterface
sed -i 's/IconCameraScan/IconCamera/g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/IconFileTypeJson/IconFileTypeJs/g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/IconFileTypeText/IconFileTypeTxt/g' src/ui/EnhancedOCRInterface.tsx

# Fix EnhancedDropzone icon
sed -i 's/IconCameraScan/IconCamera/g' src/ui/EnhancedDropzone.tsx

# Remove unused imports from EnhancedOCRInterface
sed -i '/useRef/s/, useRef//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, Progress//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, Loader//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, Chip//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, Transition//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, useMantineTheme//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, rem//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, MantineProvider//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, NumberInput//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, Center//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, useHover//g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/, MIME_TYPES//g' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconPhoto.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconTextRecognition.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconLanguage.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconRocket.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconX.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconFile.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconDownload.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconEye.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconEyeOff.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/IconMenu2.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/ImageUpload.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx
sed -i '/PdfUpload.*EnhancedOCRInterface/d' src/ui/EnhancedOCRInterface.tsx

# Fix OCRResult type in RapidOCRInterface
sed -i '1i\import type { OCRResult } from '\''../types/ocr.types'\''' src/ui/RapidOCRInterface.tsx

# Fix getUserMedia condition
sed -i 's/if (navigator.mediaDevices.getUserMedia)/if (navigator.mediaDevices \&\& navigator.mediaDevices.getUserMedia)/g' src/ui/EnhancedOCRInterface.tsx

echo "Build errors fixed!"