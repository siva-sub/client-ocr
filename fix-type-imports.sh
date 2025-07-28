#!/bin/bash

# Fix type imports for verbatimModuleSyntax

echo "Fixing type imports..."

# Fix imports from ocr-config
sed -i 's/import { LangType, OCRVersion, ModelType/import type { LangType, OCRVersion, ModelType/g' src/core/language-models.ts
sed -i 's/import { LangType, OCRVersion, ModelType/import type { LangType, OCRVersion, ModelType/g' src/core/model-downloader.ts
sed -i 's/import { getLanguageModels, LANGUAGE_MODELS, ModelInfo, LangModelInfo/import { getLanguageModels, LANGUAGE_MODELS }\nimport type { ModelInfo, LangModelInfo/g' src/core/model-downloader.ts
sed -i 's/import { OCRConfig/import type { OCRConfig/g' src/workers/classification.worker.v2.ts
sed -i 's/import { OCRConfig/import type { OCRConfig/g' src/workers/detection.worker.v2.ts
sed -i 's/import { OCRConfig/import type { OCRConfig/g' src/workers/recognition.worker.v2.ts

# Fix MetaONNXModel imports
sed -i 's/import { MetaONNXModel/import type { MetaONNXModel/g' src/workers/classification.worker.v2.ts
sed -i 's/import { MetaONNXModel/import type { MetaONNXModel/g' src/workers/detection.worker.v2.ts
sed -i 's/import { MetaONNXModel/import type { MetaONNXModel/g' src/workers/recognition.worker.v2.ts

# Fix SelectProps import
sed -i 's/import { Select, SelectProps/import { Select }\nimport type { SelectProps/g' src/ui/LanguageSelector.tsx

# Fix unused imports
sed -i 's/, BoundingBox//g' src/workers/classification.worker.v2.ts
sed -i 's/, IconRocket//g' src/ui/RapidOCRInterface.tsx

echo "Type imports fixed!"