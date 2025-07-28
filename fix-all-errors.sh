#!/bin/bash

echo "Fixing all TypeScript errors..."

# Fix RapidOCRInterface unused imports and types
sed -i 's/import { ProcessingOptions }/import type { ProcessingOptions }/g' src/ui/RapidOCRInterface.tsx
sed -i '/IconRocket/d' src/ui/RapidOCRInterface.tsx

# Remove unused imports in workers
sed -i '/BoundingBox.*classification\.worker/d' src/workers/classification.worker.v2.ts
sed -i '/^import.*DetPreProcess/d' src/workers/detection.worker.ts
sed -i '/^import.*DBPostProcess/d' src/workers/detection.worker.ts

# Remove unused variables from model-downloader
sed -i 's/import { getLanguageModels, LANGUAGE_MODELS }/import { getLanguageModels }/g' src/core/model-downloader.ts
sed -i '/LangModelInfo.*never read/d' src/core/model-downloader.ts

# Fix worker message types
sed -i 's/"CLASSIFY"/"INIT" | "PROCESS" | "RESULT" | "ERROR" | "PROGRESS"/g' src/workers/classification.worker.v2.ts
sed -i 's/"DETECT"/"INIT" | "PROCESS" | "RESULT" | "ERROR" | "PROGRESS"/g' src/workers/detection.worker.v2.ts

echo "Fixes applied!"