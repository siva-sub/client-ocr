#!/bin/bash

echo "Fixing final TypeScript errors..."

# Remove unused imports from EnhancedOCRInterface
sed -i 's/, type PDFProcessingOptions//g' src/ui/EnhancedOCRInterface.tsx
sed -i '/import { arrayToBoundingBox/d' src/ui/EnhancedOCRInterface.tsx

# Fix import type issues in workers
sed -i 's/import { RapidOCRWorker, MetaONNXModel/import { RapidOCRWorker }\nimport type { MetaONNXModel/g' src/workers/classification.worker.v2.ts
sed -i 's/import { RapidOCRWorker, MetaONNXModel/import { RapidOCRWorker }\nimport type { MetaONNXModel/g' src/workers/detection.worker.v2.ts
sed -i 's/import { RapidOCRWorker, MetaONNXModel/import { RapidOCRWorker }\nimport type { MetaONNXModel/g' src/workers/recognition.worker.v2.ts

# Remove unused ProcessingOptions import from RapidOCRInterface
sed -i '/ProcessingOptions/d' src/ui/RapidOCRInterface.tsx

# Comment out unused variables
sed -i 's/const theme = useMantineTheme()/\/\/ const theme = useMantineTheme()/g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/const isTablet/\/\/ const isTablet/g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/const isDesktop/\/\/ const isDesktop/g' src/ui/EnhancedOCRInterface.tsx
sed -i 's/const \[files, setFiles\]/\/\/ const [files, setFiles]/g' src/ui/EnhancedOCRInterface.tsx

# Fix worker message types - add to WorkerMessage type
sed -i 's/type: '\''INIT'\'' | '\''PROCESS'\'' | '\''RESULT'\'' | '\''ERROR'\'' | '\''PROGRESS'\''/type: '\''INIT'\'' | '\''PROCESS'\'' | '\''RESULT'\'' | '\''ERROR'\'' | '\''PROGRESS'\'' | '\''CLASSIFY'\'' | '\''DETECT'\''/g' src/types/ocr.types.ts

# Comment out unused variables in workers
sed -i 's/const channels = 3/\/\/ const channels = 3/g' src/workers/detection.worker.v2.ts
sed -i 's/\bheight,/\/\/ height,/g' src/workers/recognition.worker.v2.ts
sed -i 's/const { inputData, imgWidth/const { inputData, imgWidth: _imgWidth/g' src/workers/recognition.worker.v2.ts
sed -i 's/const batchSize/\/\/ const batchSize/g' src/workers/recognition.worker.v2.ts

echo "Final fixes applied!"