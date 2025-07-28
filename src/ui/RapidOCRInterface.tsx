import type { OCRResult } from '../types/ocr.types'
import { useState, useCallback } from 'react'
import { Paper, Stack, Tabs, Alert, Select, Group, Text, Badge, Switch, Divider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhoto, IconTextRecognition, IconSettings, IconInfoCircle, IconLanguage, IconBrain } from '@tabler/icons-react'
import { ImageUpload } from './ImageUpload'
import { PdfUpload } from './PdfUpload'
import { ResultViewer } from './ResultViewer'
import { PerformanceMonitor } from './PerformanceMonitor'
import { PwaInstallPrompt } from './PwaInstallPrompt'
import { LanguageSelector } from './LanguageSelector'
import { OCRProgress } from './OCRProgress'
import { RapidOCREngine, type OCREngineOptions, type OCRProgress as OCRProgressType } from '../core/rapid-ocr-engine'
import type { LangType, OCRVersion, ModelType } from '../core/ocr-config'

export function RapidOCRInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<OCRProgressType | null>(null)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [engine, setEngine] = useState<RapidOCREngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Configuration state
  const [language, setLanguage] = useState<LangType>('en')
  const [ocrVersion, setOcrVersion] = useState<OCRVersion>('PP-OCRv4')
  const [modelType, setModelType] = useState<ModelType>('mobile')
  const [useDetection, setUseDetection] = useState(true)
  const [useClassification, setUseClassification] = useState(true)
  
  const initializeEngine = useCallback(async () => {
    try {
      notifications.show({
        id: 'init',
        title: 'Initializing OCR Engine',
        message: `Loading ${language} models (${ocrVersion} ${modelType})...`,
        loading: true,
        autoClose: false
      })

      const options: OCREngineOptions = {
        lang: language,
        version: ocrVersion,
        modelType: modelType,
        modelBasePath: '/models',
        config: {
          global: {
            text_score: 0.5,
            use_det: useDetection,
            use_cls: useClassification,
            use_rec: true,
            min_height: 30,
            width_height_ratio: 8,
            max_side_len: 2000,
            min_side_len: 50,
            return_word_box: false,
            return_single_char_box: false
          }
        }
      }

      const newEngine = new RapidOCREngine(options)
      
      // Set progress callback
      newEngine.setProgressCallback((progress) => {
        setOcrProgress(progress)
      })
      
      await newEngine.initialize()
      
      setEngine(newEngine)
      setIsInitialized(true)
      
      notifications.update({
        id: 'init',
        title: 'OCR Engine Ready',
        message: `${language.toUpperCase()} models loaded successfully`,
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
      console.error('Engine initialization error:', error)
    }
  }, [language, ocrVersion, modelType, useDetection, useClassification])

  const processImage = async (file: File) => {
    if (!engine || !isInitialized) {
      await initializeEngine()
      if (!engine) return
    }

    setIsProcessing(true)
    setOcrProgress(null)
    setResult(null)

    try {
      const startTime = performance.now()
      
      // Convert file to image data
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          URL.revokeObjectURL(url)
          resolve()
        }
        img.onerror = reject
        img.src = url
      })
      
      // Create canvas and get image data
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Process with RapidOCR engine
      const results = await engine.process(
        imageData.data,
        imageData.width,
        imageData.height
      )
      
      // Convert to expected format
      const ocrResult: OCRResult = {
        regions: results.map(r => ({
          text: r.text,
          confidence: r.confidence,
          box: r.box
        })),
        fullText: results.map(r => r.text).join(' '),
        processingTime: performance.now() - startTime,
        method: 'rapidocr',
        metadata: {
          imageWidth: imageData.width,
          imageHeight: imageData.height,
          language,
          ocrVersion,
          modelType
        }
      }

      setResult(ocrResult)

      notifications.show({
        title: 'OCR Complete',
        message: `Processed in ${Math.round(ocrResult.processingTime)}ms - Found ${results.length} text regions`,
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'OCR Failed',
        message: (error as Error).message,
        color: 'red'
      })
      console.error('OCR processing error:', error)
    } finally {
      setIsProcessing(false)
      setOcrProgress(null)
    }
  }

  const processPdf = async (file: File) => {
    setIsProcessing(true)
    setOcrProgress(null)
    
    try {
      if (!engine || !isInitialized) {
        await initializeEngine()
        if (!engine) return
      }
      
      notifications.show({
        title: 'Processing PDF',
        message: 'Converting PDF pages to images...',
        color: 'blue'
      })
      
      // Load PDF.js
      const pdfjsLib = await import('pdfjs-dist')
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
        const scale = 2.0
        const viewport = page.getViewport({ scale })
        
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        const context = canvas.getContext('2d')!
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
        
        // Get image data and process
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const pageResults = await engine.process(
          imageData.data,
          imageData.width,
          imageData.height
        )
        
        const pageText = pageResults.map(r => r.text).join(' ')
        results.push(`Page ${pageNum}:\n${pageText}`)
      }
      
      // Combine results
      const combinedText = results.join('\n\n')
      
      setResult({
        fullText: combinedText,
        regions: [],
        processingTime: performance.now(),
        method: 'rapidocr'
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
      setOcrProgress(null)
    }
  }

  // Check if we need to reinitialize when settings change
  const handleSettingChange = () => {
    setIsInitialized(false)
    if (engine) {
      engine.dispose()
      setEngine(null)
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
            
            {(isProcessing || ocrProgress) && (
              <OCRProgress progress={ocrProgress} isProcessing={isProcessing} />
            )}
            
            {result && <ResultViewer result={result} modelId={`${language}-${ocrVersion}-${modelType}`} />}
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
                  <Group mb="md" justify="space-between">
                    <Text fw={500} size="lg">OCR Configuration</Text>
                    <Badge leftSection={<IconBrain size={14} />}>
                      RapidOCR Engine
                    </Badge>
                  </Group>
                  
                  <Stack gap="md">
                    <LanguageSelector
                      value={language}
                      onChange={(value) => {
                        setLanguage(value)
                        handleSettingChange()
                      }}
                    />
                    
                    <Select
                      label="OCR Version"
                      description="Choose OCR model version"
                      value={ocrVersion}
                      onChange={(value) => {
                        if (value) {
                          setOcrVersion(value as OCRVersion)
                          handleSettingChange()
                        }
                      }}
                      data={[
                        { value: 'PP-OCRv4', label: 'PP-OCRv4 (Stable)' },
                        { value: 'PP-OCRv5', label: 'PP-OCRv5 (Latest)' }
                      ]}
                    />
                    
                    <Select
                      label="Model Type"
                      description="Balance between speed and accuracy"
                      value={modelType}
                      onChange={(value) => {
                        if (value) {
                          setModelType(value as ModelType)
                          handleSettingChange()
                        }
                      }}
                      data={[
                        { 
                          value: 'mobile', 
                          label: 'Mobile (Fast)',
                          group: 'Performance'
                        },
                        { 
                          value: 'server', 
                          label: 'Server (Accurate)',
                          group: 'Performance'
                        }
                      ]}
                    />
                  </Stack>
                </div>
                
                <Divider />
                
                <div>
                  <Text fw={500} mb="sm">Processing Options</Text>
                  <Stack gap="sm">
                    <Switch
                      label="Text Detection"
                      description="Detect text regions in the image"
                      checked={useDetection}
                      onChange={(event) => {
                        setUseDetection(event.currentTarget.checked)
                        handleSettingChange()
                      }}
                    />
                    
                    <Switch
                      label="Rotation Detection"
                      description="Detect and correct 180° rotated text"
                      checked={useClassification}
                      onChange={(event) => {
                        setUseClassification(event.currentTarget.checked)
                        handleSettingChange()
                      }}
                    />
                  </Stack>
                </div>
                
                <Alert icon={<IconInfoCircle size={16} />} variant="light">
                  <Text size="sm" fw={500} mb={4}>Model Information</Text>
                  <Text size="sm">
                    • <strong>Languages</strong>: RapidOCR supports 14+ languages with specialized models
                  </Text>
                  <Text size="sm">
                    • <strong>PP-OCRv4</strong>: Stable version with wide language support
                  </Text>
                  <Text size="sm">
                    • <strong>PP-OCRv5</strong>: Latest version with improved accuracy (limited languages)
                  </Text>
                  <Text size="sm" mt={4}>
                    • <strong>Mobile Models</strong>: ~10MB, optimized for speed
                  </Text>
                  <Text size="sm">
                    • <strong>Server Models</strong>: ~100MB, optimized for accuracy
                  </Text>
                </Alert>
                
                {!isInitialized && (
                  <Alert icon={<IconLanguage size={16} />} color="yellow" variant="light">
                    <Text size="sm">
                      Engine not initialized. It will be initialized when you process an image.
                    </Text>
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}