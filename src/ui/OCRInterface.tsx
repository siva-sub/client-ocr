import { useState } from 'react'
import { Paper, Stack, Tabs, Progress, Alert, Select, Group, Text, Badge } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhoto, IconTextRecognition, IconSettings, IconInfoCircle, IconRocket, IconServer } from '@tabler/icons-react'
import { ImageUpload } from './ImageUpload'
import { PdfUpload } from './PdfUpload'
import { ResultViewer } from './ResultViewer'
import { PerformanceMonitor } from './PerformanceMonitor'
import { PwaInstallPrompt } from './PwaInstallPrompt'
import { InferenceEngine } from '../core/inference-engine'
import { MODEL_CONFIGS, getModelConfig, getDefaultModelId } from '../core/model-config'
import type { OCRResult, ProcessingOptions } from '../types/ocr.types'

export function OCRInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [inferenceEngine] = useState(() => new InferenceEngine())
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState(getDefaultModelId())
  const [processingOptions] = useState<ProcessingOptions>({
    enableDeskew: true,
    enableFallback: true,
    confidenceThreshold: 0.5,
    language: 'eng'
  })

  const initializeEngine = async (modelId?: string) => {
    const targetModelId = modelId || selectedModelId
    const modelConfig = getModelConfig(targetModelId)
    
    if (!modelConfig) {
      notifications.show({
        title: 'Invalid Model',
        message: 'Selected model configuration not found',
        color: 'red'
      })
      return
    }

    try {
      notifications.show({
        id: 'init',
        title: 'Initializing OCR',
        message: `Loading ${modelConfig.name} models...`,
        loading: true,
        autoClose: false
      })

      await inferenceEngine.initialize(modelConfig.paths, targetModelId)

      setIsInitialized(true)
      notifications.update({
        id: 'init',
        title: 'OCR Ready',
        message: `${modelConfig.name} loaded successfully`,
        color: 'green',
        autoClose: 3000,
        loading: false
      })
    } catch (error) {
      notifications.update({
        id: 'init',
        title: 'Initialization Failed',
        message: (error as Error).message,
        color: 'red',
        autoClose: 5000,
        loading: false
      })
    }
  }

  const processImage = async (file: File) => {
    if (!isInitialized) {
      await initializeEngine()
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const startTime = performance.now()
      
      // Create progress interval
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const ocrResult = await inferenceEngine.processImage(file, processingOptions)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Add processing time
      ocrResult.processingTime = performance.now() - startTime

      setResult(ocrResult)

      notifications.show({
        title: 'OCR Complete',
        message: `Processed in ${Math.round(ocrResult.processingTime)}ms using ${ocrResult.method}`,
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'OCR Failed',
        message: (error as Error).message,
        color: 'red'
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const processPdf = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)
    
    try {
      // Initialize engine if needed
      if (!isInitialized) {
        await initializeEngine()
      }
      
      setProgress(10)
      
      notifications.show({
        title: 'Processing PDF',
        message: 'Converting PDF pages to images...',
        color: 'blue'
      })
      
      // Load PDF.js
      const pdfjsLib = await import('pdfjs-dist')
      // Use the bundled worker to avoid CORS issues
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
      
      // Load PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      const totalPages = pdf.numPages
      const results: string[] = []
      
      // Process each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        
        // Render page to canvas
        const scale = 2.0 // Higher scale for better OCR
        const viewport = page.getViewport({ scale })
        
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        const context = canvas.getContext('2d')!
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
        
        // Process canvas directly with OCR
        const pageResult = await inferenceEngine.processImage(canvas, processingOptions)
        results.push(`Page ${pageNum}:\n${pageResult.fullText}`)
        
        setProgress(10 + (pageNum / totalPages) * 80)
      }
      
      // Combine results
      const combinedText = results.join('\n\n')
      
      setResult({
        fullText: combinedText,
        regions: [],
        processingTime: performance.now(),
        method: 'onnx'
      })
      
      notifications.show({
        title: 'PDF Processing Complete',
        message: `Successfully processed ${totalPages} pages`,
        color: 'green'
      })
      
    } catch (error) {
      console.error('PDF processing error:', error)
      notifications.show({
        title: 'PDF Processing Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        color: 'red'
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <Stack gap="md">
      <PwaInstallPrompt />
      
      <Tabs defaultValue="image">
        <Tabs.List>
          <Tabs.Tab value="image" leftSection={<IconPhoto size={16} />}>
            Image OCR
          </Tabs.Tab>
          <Tabs.Tab value="pdf" leftSection={<IconTextRecognition size={16} />}>
            PDF OCR
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="image" pt="md">
          <Stack gap="md">
            <ImageUpload onUpload={processImage} isProcessing={isProcessing} />
            
            {isProcessing && (
              <Paper p="md" withBorder>
                <Stack gap="xs">
                  <Progress value={progress} animated />
                  <Alert icon={<IconInfoCircle size={16} />} variant="light">
                    Processing image... This may take a few moments.
                  </Alert>
                </Stack>
              </Paper>
            )}
            
            {result && <ResultViewer result={result} modelId={selectedModelId} />}
            {result && <PerformanceMonitor result={result} />}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="pdf" pt="md">
          <PdfUpload onUpload={processPdf} isProcessing={isProcessing} />
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <Stack gap="md">
            <Paper p="md" withBorder>
              <Stack gap="md">
                <div>
                  <Text fw={500} mb="xs">Model Selection</Text>
                  <Select
                    label="OCR Model"
                    description="Choose between accuracy and speed"
                    value={selectedModelId}
                    onChange={(value) => {
                      if (value) {
                        setSelectedModelId(value)
                        setIsInitialized(false)
                        setResult(null)
                      }
                    }}
                    data={[
                      {
                        group: 'Mobile Models',
                        items: MODEL_CONFIGS.filter(config => config.type === 'mobile').map(config => ({
                          value: config.id,
                          label: config.name
                        }))
                      },
                      {
                        group: 'Server Models',
                        items: MODEL_CONFIGS.filter(config => config.type === 'server').map(config => ({
                          value: config.id,
                          label: config.name
                        }))
                      }
                    ]}
                  />
                </div>
                
                {getModelConfig(selectedModelId) && (
                  <Paper p="sm" bg="gray.0" withBorder>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Selected Model Details</Text>
                        <Group gap="xs">
                          <Badge 
                            color={getModelConfig(selectedModelId)?.type === 'server' ? 'blue' : 'green'}
                            leftSection={getModelConfig(selectedModelId)?.type === 'server' ? <IconServer size={12} /> : <IconRocket size={12} />}
                          >
                            {getModelConfig(selectedModelId)?.type}
                          </Badge>
                          <Badge variant="light">
                            {getModelConfig(selectedModelId)?.version}
                          </Badge>
                        </Group>
                      </Group>
                      
                      <Text size="sm" c="dimmed">
                        {getModelConfig(selectedModelId)?.description}
                      </Text>
                      
                      <Group gap="xl">
                        <div>
                          <Text size="xs" c="dimmed">Accuracy</Text>
                          <Badge size="sm" variant="dot">
                            {getModelConfig(selectedModelId)?.accuracy}
                          </Badge>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Speed</Text>
                          <Badge size="sm" variant="dot" color="teal">
                            {getModelConfig(selectedModelId)?.speed}
                          </Badge>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Languages</Text>
                          <Group gap={4}>
                            {getModelConfig(selectedModelId)?.languages.map(lang => (
                              <Badge key={lang} size="sm" variant="light">
                                {lang.toUpperCase()}
                              </Badge>
                            ))}
                          </Group>
                        </div>
                      </Group>
                      
                      <div>
                        <Text size="xs" c="dimmed" mb={4}>Model Sizes</Text>
                        <Text size="xs">
                          Detection: {getModelConfig(selectedModelId)?.sizes.detection} | 
                          Recognition: {getModelConfig(selectedModelId)?.sizes.recognition} | 
                          Classification: {getModelConfig(selectedModelId)?.sizes.classification}
                        </Text>
                      </div>
                    </Stack>
                  </Paper>
                )}
                
                <Alert icon={<IconInfoCircle size={16} />} variant="light">
                  <Text size="sm" fw={500} mb={4}>Model Selection Guide</Text>
                  <Text size="sm">
                    • <strong>Mobile Models</strong>: Fast loading and inference, suitable for most use cases
                  </Text>
                  <Text size="sm">
                    • <strong>Server Models</strong>: Higher accuracy but larger download size and slower inference
                  </Text>
                  <Text size="sm" mt={4}>
                    Switching models will require re-initialization.
                  </Text>
                </Alert>
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}