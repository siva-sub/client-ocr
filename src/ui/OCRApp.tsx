import { useState, useRef, useEffect } from 'react'
import { 
  AppShell, Container, Stack, Title, Group, Badge,
  ActionIcon, Tooltip, useMantineColorScheme, Tabs,
  LoadingOverlay, Alert, Button, Modal,
  Drawer, ScrollArea, Divider, Card, Text, Progress,
  Affix, rem, Select
} from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { 
  IconSun, IconMoon, IconSettings,
  IconHistory, IconBrain, IconChartBar, IconAdjustments,
  IconFileText, IconBrandGithub, IconSparkles,
  IconArrowUp
} from '@tabler/icons-react'

// Components
import { EnhancedDropzone } from './EnhancedDropzone'
import { ResultViewer } from './ResultViewer'
import { PreprocessingControls } from './PreprocessingControls'
import { EnhancedPerformanceMonitor } from './EnhancedPerformanceMonitor'
import { LanguageSelector } from './LanguageSelector'
import { PwaInstallPrompt } from './PwaInstallPrompt'

// Core
import { RapidOCREngine } from '../core/rapid-ocr-engine'
import { ImageLoader } from '../core/image-loader'
import { ImagePreprocessor } from '../core/preprocessing/image-preprocessor'
// import { pdfProcessor } from '../core/pdf-processor'
import type { OCRResult } from '../types/ocr.types'
import type { LangType, OCRVersion, ModelType } from '../core/ocr-config'
import type { PreprocessingOptions } from '../core/preprocessing/image-preprocessor'
// Types
interface ProcessingMetrics {
  totalTime: number
  detectionTime: number
  classificationTime: number
  recognitionTime: number
  preprocessingTime?: number
  postprocessingTime?: number
  imageWidth: number
  imageHeight: number
  pixelCount: number
  textRegions: number
  totalCharacters: number
  averageConfidence: number
  language: string
  modelVersion: string
  modelType: string
  memoryUsed?: number
  cpuUsage?: number
  preprocessingApplied?: string[]
  cacheHit?: boolean
}

interface ProcessingHistory {
  id: string
  timestamp: Date
  fileName: string
  result: OCRResult
  metrics: ProcessingMetrics
  preprocessingOptions?: PreprocessingOptions
}

export function OCRApp() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<{ stage: 'detection' | 'classification' | 'recognition' | 'loading'; progress: number } | null>(null)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [metrics, setMetrics] = useState<ProcessingMetrics | null>(null)
  const [history, setHistory] = useLocalStorage<ProcessingHistory[]>({
    key: 'ocr-history',
    defaultValue: []
  })
  
  // Settings
  const [language, setLanguage] = useLocalStorage<LangType>({
    key: 'ocr-language',
    defaultValue: 'en'
  })
  const [ocrVersion, setOcrVersion] = useLocalStorage<OCRVersion>({
    key: 'ocr-version',
    defaultValue: 'PP-OCRv4'
  })
  const [modelType, setModelType] = useLocalStorage<ModelType>({
    key: 'ocr-model-type',
    defaultValue: 'mobile'
  })
  const [preprocessingOptions, setPreprocessingOptions] = useLocalStorage<PreprocessingOptions>({
    key: 'preprocessing-options',
    defaultValue: {}
  })
  const [autoPreprocess, setAutoPreprocess] = useLocalStorage({
    key: 'auto-preprocess',
    defaultValue: false
  })
  
  // UI state
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false)
  const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false)
  // const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false)
  const [previewImage] = useState<string | null>(null)
  
  // Refs
  const engineRef = useRef<RapidOCREngine | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize OCR engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        const engine = new RapidOCREngine({
          lang: language,
          version: ocrVersion,
          modelType: modelType,
          enableWordBoxes: true
        })
        
        engine.setProgressCallback((progress) => {
          setProgress(progress)
        })
        
        await engine.initialize()
        engineRef.current = engine
        
      } catch (error) {
        console.error('Failed to initialize OCR engine:', error)
        notifications.show({
          title: 'Initialization Error',
          message: 'Failed to initialize OCR engine',
          color: 'red'
        })
      }
    }
    
    initEngine()
    
    return () => {
      engineRef.current?.dispose()
    }
  }, [language, ocrVersion, modelType])

  const processImage = async (file: File) => {
    if (!engineRef.current) {
      notifications.show({
        title: 'Error',
        message: 'OCR engine not initialized',
        color: 'red'
      })
      return
    }

    setIsProcessing(true)
    setProgress({ stage: 'loading', progress: 0 })
    
    const startTime = performance.now()
    const timings = {
      preprocessing: 0,
      detection: 0,
      classification: 0,
      recognition: 0,
      total: 0
    }

    try {
      // Load image
      const loadedImage = await ImageLoader.load(file)
      let imageData = new ImageData(
        new Uint8ClampedArray(loadedImage.data),
        loadedImage.width,
        loadedImage.height
      )
      
      // Apply preprocessing
      const preprocessStart = performance.now()
      let appliedPreprocessing: PreprocessingOptions = {}
      
      if (autoPreprocess) {
        const result = await ImagePreprocessor.autoPreprocess(imageData)
        imageData = result.processed
        appliedPreprocessing = result.appliedOptions
      } else if (Object.keys(preprocessingOptions).length > 0) {
        imageData = await ImagePreprocessor.preprocess(imageData, preprocessingOptions)
        appliedPreprocessing = preprocessingOptions
      }
      
      timings.preprocessing = performance.now() - preprocessStart
      
      // Process with OCR
      const ocrStart = performance.now()
      const ocrResults = await engineRef.current.process(
        imageData.data,
        imageData.width,
        imageData.height
      )
      
      // Calculate individual stage timings (approximate)
      const ocrTime = performance.now() - ocrStart
      timings.detection = ocrTime * 0.4
      timings.classification = ocrTime * 0.2
      timings.recognition = ocrTime * 0.4
      timings.total = performance.now() - startTime
      
      // Create result
      const fullText = ocrResults.map(r => r.text).join('\n')
      const avgConfidence = ocrResults.reduce((sum, r) => sum + r.confidence, 0) / (ocrResults.length || 1)
      
      const result: OCRResult = {
        fullText,
        regions: ocrResults,
        processingTime: timings.total,
        method: 'onnx' as const,
        metadata: {
          imageWidth: imageData.width,
          imageHeight: imageData.height,
          language,
          version: ocrVersion,
          modelType
        }
      }
      
      // Create metrics
      const metrics: ProcessingMetrics = {
        totalTime: timings.total,
        detectionTime: timings.detection,
        classificationTime: timings.classification,
        recognitionTime: timings.recognition,
        preprocessingTime: timings.preprocessing,
        imageWidth: imageData.width,
        imageHeight: imageData.height,
        pixelCount: imageData.width * imageData.height,
        textRegions: ocrResults.length,
        totalCharacters: fullText.length,
        averageConfidence: avgConfidence,
        language,
        modelVersion: ocrVersion,
        modelType,
        preprocessingApplied: Object.keys(appliedPreprocessing).filter(
          key => appliedPreprocessing[key as keyof PreprocessingOptions]
        )
      }
      
      setResult(result)
      setMetrics(metrics)
      
      // Add to history
      const historyEntry: ProcessingHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        fileName: file.name,
        result,
        metrics,
        preprocessingOptions: appliedPreprocessing
      }
      
      setHistory((prev) => [historyEntry, ...prev].slice(0, 50))
      
      notifications.show({
        title: 'Success',
        message: `Processed ${ocrResults.length} text regions`,
        color: 'green'
      })
      
    } catch (error) {
      console.error('Processing error:', error)
      notifications.show({
        title: 'Processing Error',
        message: error instanceof Error ? error.message : 'Failed to process image',
        color: 'red'
      })
    } finally {
      setIsProcessing(false)
      setProgress(null)
    }
  }

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      processImage(files[0])
    }
  }

  const handlePreprocessPreview = async () => {
    // Implementation for preview
    notifications.show({
      title: 'Preview',
      message: 'Preprocessing preview coming soon',
      color: 'blue'
    })
  }

  const handleAutoPreprocess = () => {
    setAutoPreprocess(!autoPreprocess)
    notifications.show({
      title: autoPreprocess ? 'Auto-preprocessing disabled' : 'Auto-preprocessing enabled',
      message: autoPreprocess ? 
        'Manual preprocessing settings will be used' : 
        'Optimal settings will be detected automatically',
      color: 'blue'
    })
  }

  /*
  const _exportResults = (format: 'txt' | 'json' | 'pdf') => {
    if (!result) return
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    let content: string
    let mimeType: string
    let filename: string
    
    switch (format) {
      case 'txt':
        content = result.fullText
        mimeType = 'text/plain'
        filename = `ocr-result-${timestamp}.txt`
        break
      case 'json':
        content = JSON.stringify(result, null, 2)
        mimeType = 'application/json'
        filename = `ocr-result-${timestamp}.json`
        break
      default:
        return
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  */

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%" px="sm">
          <Group h="100%" justify="space-between">
            <Group gap="xs">
              <IconBrain size={24} />
              <Title order={4} hiddenFrom="sm">OCR</Title>
              <Title order={3} visibleFrom="sm">Client-Side OCR</Title>
              <Badge variant="light" color="blue" size="sm">v2.0</Badge>
            </Group>
            
            <Group visibleFrom="sm">
              <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
                <ActionIcon
                  variant="default"
                  size="lg"
                  onClick={() => toggleColorScheme()}
                >
                  {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Settings">
                <ActionIcon
                  variant="default"
                  size="lg"
                  onClick={openSettings}
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="History">
                <ActionIcon
                  variant="default"
                  size="lg"
                  onClick={openHistory}
                >
                  <IconHistory size={18} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="GitHub">
                <ActionIcon
                  component="a"
                  href="https://github.com/siva-sub/client-ocr"
                  target="_blank"
                  variant="default"
                  size="lg"
                >
                  <IconBrandGithub size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
            
            <Group hiddenFrom="sm">
                <ActionIcon
                  variant="default"
                  size="md"
                  onClick={() => toggleColorScheme()}
                >
                  {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                </ActionIcon>
                <ActionIcon
                  variant="default"
                  size="md"
                  onClick={openSettings}
                >
                  <IconSettings size={16} />
                </ActionIcon>
              </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" px="xs">
          <Stack gap="xl">
            {/* Main Content */}
            <Tabs defaultValue="ocr">
              <Tabs.List>
                <Tabs.Tab value="ocr" leftSection={<IconFileText size={16} />}>
                  OCR Processing
                </Tabs.Tab>
                <Tabs.Tab value="preprocessing" leftSection={<IconAdjustments size={16} />}>
                  Preprocessing
                </Tabs.Tab>
                <Tabs.Tab value="performance" leftSection={<IconChartBar size={16} />}>
                  Performance
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="ocr" pt="xl">
                <Stack gap="lg">
                  <EnhancedDropzone 
                    onDrop={handleFileDrop}
                    isProcessing={isProcessing}
                  />
                  
                  <LoadingOverlay visible={isProcessing} />
                  
                  {progress && (
                    <Card withBorder>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text fw={500}>Processing: {progress.stage}</Text>
                          <Text size="sm" c="dimmed">{Math.round(progress.progress * 100)}%</Text>
                        </Group>
                        <Progress value={progress.progress * 100} animated />
                      </Stack>
                    </Card>
                  )}
                  
                  {result && (
                    <ResultViewer 
                      result={result}
                    />
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="preprocessing" pt="xl">
                <Stack gap="lg">
                  <Alert icon={<IconSparkles size={16} />} variant="light">
                    Preprocessing can significantly improve OCR accuracy for low-quality images
                  </Alert>
                  
                  <PreprocessingControls
                    options={preprocessingOptions}
                    onChange={setPreprocessingOptions}
                    onPreview={handlePreprocessPreview}
                    onAuto={handleAutoPreprocess}
                    isProcessing={isProcessing}
                  />
                  
                  {previewImage && (
                    <Card withBorder>
                      <img 
                        src={previewImage} 
                        alt="Preprocessed preview"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </Card>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="performance" pt="xl">
                <EnhancedPerformanceMonitor
                  metrics={metrics || undefined}
                  progress={progress && progress.stage !== 'loading' ? 
                    progress as { stage: 'detection' | 'classification' | 'recognition'; progress: number } : 
                    undefined}
                  isProcessing={isProcessing}
                />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppShell.Main>

      {/* Settings Modal */}
      <Modal 
        opened={settingsOpened} 
        onClose={closeSettings}
        title="OCR Settings"
        size="md"
      >
        <Stack gap="md">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
          />
          
          <Divider label="Model Settings" />
          
          <Select
            label="OCR Version"
            value={ocrVersion}
            onChange={(value) => setOcrVersion(value as OCRVersion)}
            data={[
              { value: 'PP-OCRv5', label: 'PP-OCRv5 (Latest)' },
              { value: 'PP-OCRv4', label: 'PP-OCRv4' }
            ]}
          />
          
          <Select
            label="Model Type"
            value={modelType}
            onChange={(value) => setModelType(value as ModelType)}
            data={[
              { value: 'mobile', label: 'Mobile (Fast)' },
              { value: 'server', label: 'Server (Accurate)' }
            ]}
          />
        </Stack>
      </Modal>

      {/* History Drawer */}
      <Drawer
        opened={historyOpened}
        onClose={closeHistory}
        title="Processing History"
        size="lg"
        position="right"
      >
        <ScrollArea h="calc(100vh - 80px)">
          <Stack gap="md">
            {history.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No processing history yet
              </Text>
            ) : (
              history.map((entry) => (
                <Card key={entry.id} withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text fw={500}>{entry.fileName}</Text>
                      <Badge variant="light">
                        {new Date(entry.timestamp).toLocaleString()}
                      </Badge>
                    </Group>
                    
                    <Text size="sm" lineClamp={2}>
                      {entry.result.fullText}
                    </Text>
                    
                    <Group gap="xs">
                      <Badge size="sm" variant="light" color="blue">
                        {entry.metrics.textRegions} regions
                      </Badge>
                      <Badge size="sm" variant="light" color="green">
                        {entry.metrics.totalTime}ms
                      </Badge>
                      <Badge size="sm" variant="light" color="orange">
                        {Math.round(entry.metrics.averageConfidence * 100)}% confidence
                      </Badge>
                    </Group>
                    
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setResult(entry.result)
                        setMetrics(entry.metrics)
                        closeHistory()
                      }}
                    >
                      View Result
                    </Button>
                  </Stack>
                </Card>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Drawer>

      {/* Scroll to top */}
      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          <IconArrowUp size={18} />
        </ActionIcon>
      </Affix>

      {/* PWA Install Prompt */}
      <PwaInstallPrompt />
    </AppShell>
  )
}