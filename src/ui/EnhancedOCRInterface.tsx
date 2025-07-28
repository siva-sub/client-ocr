import type { OCRResult } from '../types/ocr.types'
import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Paper, 
  Stack, 
  Tabs, 
  Alert, 
  Select, 
  Group, 
  Text, 
  Badge, 
  Switch, 
  Divider, 
  Title, 
  Button, 
  Tooltip, 
  Container,
  Grid,
  SegmentedControl,
  ActionIcon,
  Modal
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { 
  IconPhoto, 
  IconTextRecognition, 
  IconSettings, 
  IconInfoCircle, 
  IconLanguage, 
  IconBrain, 
  IconBrandGithub, 
  IconDownload, 
  IconSparkles,
  IconTable,
  IconLayout,
  IconCamera,
  IconClipboard,
  IconHistory,
  IconTrash,
  IconUpload,
  IconCapture,
  IconDatabase
} from '@tabler/icons-react'
import { useDropzone } from 'react-dropzone'
import { PdfUpload } from './PdfUpload'
import { ResultViewer } from './ResultViewer'
import { PerformanceMonitor } from './PerformanceMonitor'
import { PwaInstallPrompt } from './PwaInstallPrompt'
import { LanguageSelector } from './LanguageSelector'
import { OCRProgress } from './OCRProgress'
import { RapidOCREngine, type OCREngineOptions, type OCRProgress as OCRProgressType } from '../core/rapid-ocr-engine'
import type { LangType, OCRVersion, ModelType } from '../core/ocr-config'
import { getModelsByCategory, getModelById } from '../core/model-registry'
import { TABLE_MODELS } from '../core/table-models'
import { LAYOUT_MODELS } from '../core/layout-models'
import { detectLayout } from '../services/layoutDetection'
import { detectTable } from '../services/tableDetection'
import { DEFAULT_MODELS, MODEL_SOURCES } from '../config/model-defaults'

interface HistoryItem {
  id: string
  timestamp: Date
  result: OCRResult
  imageUrl: string
  processingMode: string
}

interface TableResult {
  html: string
  cellBboxes: number[][]
  logicPoints: number[][]
  elapse: number
}

interface LayoutResult {
  boxes: number[][]
  classNames: string[]
  scores: number[]
  elapse: number
}

export function EnhancedOCRInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<OCRProgressType | null>(null)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [tableResult, setTableResult] = useState<TableResult | null>(null)
  const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null)
  const [engine, setEngine] = useState<RapidOCREngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  
  // Configuration state
  const [language, setLanguage] = useState<LangType>('en')
  const [ocrVersion, setOcrVersion] = useState<OCRVersion>('PP-OCRv4')
  const [modelType, setModelType] = useState<ModelType>('mobile')
  const [useDetection, setUseDetection] = useState(true)
  const [useClassification, setUseClassification] = useState(true)
  const [processingMode, setProcessingMode] = useState<'ocr' | 'table' | 'layout' | 'all'>('ocr')
  
  // Advanced model selections - Default from configuration
  const [ocrDetModel, setOcrDetModel] = useState(DEFAULT_MODELS.ocr.detection)
  const [ocrRecModel, setOcrRecModel] = useState(DEFAULT_MODELS.ocr.recognition)
  const [tableModel, setTableModel] = useState(DEFAULT_MODELS.table)
  const [layoutModel, setLayoutModel] = useState(DEFAULT_MODELS.layout)
  
  // Camera and clipboard refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (file.type === 'application/pdf') {
          await processPdf(file)
        } else {
          handleImageSelect(file)
        }
      }
    }
  })
  
  const initializeEngine = useCallback(async () => {
    try {
      // Check if we should use local models
      const selectedDetModel = getModelById(ocrDetModel)
      const selectedRecModel = getModelById(ocrRecModel)
      
      if (selectedDetModel?.source.type === 'local' || selectedRecModel?.source.type === 'local') {
        // Use local models - for now, show a notification
        notifications.show({
          id: 'init',
          title: 'Loading Local Models',
          message: `Loading ${selectedDetModel?.name} and ${selectedRecModel?.name}...`,
          loading: true,
          autoClose: false
        })
        
        // TODO: Implement local model loading
        // For now, we'll fall back to the standard engine
      }

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
  }, [language, ocrVersion, modelType, useDetection, useClassification, ocrDetModel, ocrRecModel])

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const processImage = async (file?: File) => {
    const imageFile = file || selectedImage
    if (!imageFile || !imagePreview) return

    setIsProcessing(true)
    setOcrProgress(null)
    setResult(null)
    setTableResult(null)
    setLayoutResult(null)

    try {
      const startTime = performance.now()
      
      if (processingMode === 'ocr' || processingMode === 'all') {
        // Initialize engine if needed
        if (!engine || !isInitialized) {
          await initializeEngine()
          if (!engine) return
        }

        // Convert file to image data
        const img = new Image()
        const url = URL.createObjectURL(imageFile)
        
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
        const results = await engine!.process(
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
        
        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: new Date(),
          result: ocrResult,
          imageUrl: imagePreview,
          processingMode: processingMode
        }
        setHistory(prev => [historyItem, ...prev].slice(0, 10))
      }

      if (processingMode === 'table' || processingMode === 'all') {
        // Process table detection
        const tableStartTime = performance.now()
        const tableDetectionResult = await detectTable(imagePreview, {
          model: tableModel as keyof typeof TABLE_MODELS,
          maxLen: 896,
          thresh: 0.5,
          minAreaThresh: 100,
          boxType: 'quad'
        })
        
        setTableResult({
          ...tableDetectionResult,
          elapse: performance.now() - tableStartTime
        })
      }

      if (processingMode === 'layout' || processingMode === 'all') {
        // Process layout analysis
        const layoutStartTime = performance.now()
        const layoutDetectionResult = await detectLayout(imagePreview, {
          model: layoutModel,
          confThresh: 0.7,
          iouThresh: 0.5
        })
        
        setLayoutResult({
          ...layoutDetectionResult,
          elapse: performance.now() - layoutStartTime
        })
      }

      notifications.show({
        title: 'Processing Complete',
        message: `${processingMode === 'all' ? 'All analyses' : processingMode.toUpperCase()} completed successfully`,
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'Processing Failed',
        message: (error as Error).message,
        color: 'red'
      })
      console.error('Processing error:', error)
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
        const pageResults = await engine!.process(
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

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraActive(true)
    } catch (error) {
      notifications.show({
        title: 'Camera Error',
        message: 'Failed to access camera',
        color: 'red'
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const captureFromCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(videoRef.current, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
          handleImageSelect(file)
          stopCamera()
        }
      }, 'image/jpeg')
    }
  }

  // Clipboard paste
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          handleImageSelect(blob)
        }
      }
    }
  }, [handleImageSelect])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  // Check if we need to reinitialize when settings change
  const handleSettingChange = () => {
    setIsInitialized(false)
    if (engine) {
      engine.dispose()
      setEngine(null)
    }
  }

  const ocrDetModels = getModelsByCategory('ocr-det')
  const ocrRecModels = getModelsByCategory('ocr-rec')

  return (
    <Container size="xl">
      <Stack gap="md">
        <PwaInstallPrompt />
        
        {/* Header Section */}
        <Paper p="lg" withBorder>
          <Group justify="space-between">
            <div>
              <Group gap="md">
                <Title order={2} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconSparkles size={32} stroke={1.5} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  Enhanced OCR Suite
                </Title>
                <Badge variant="light" color="blue" size="lg">
                  v1.3.0
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                High-performance text recognition, table detection, and layout analysis in your browser
              </Text>
            </div>
            <Group>
              <Tooltip label="Processing History">
                <ActionIcon 
                  variant="default" 
                  size="lg"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <IconHistory size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="View on GitHub">
                <Button
                  component="a"
                  href="https://github.com/siva-sub/client-ocr"
                  target="_blank"
                  variant="default"
                  leftSection={<IconBrandGithub size={18} />}
                >
                  GitHub
                </Button>
              </Tooltip>
              <Tooltip label="Install as PWA">
                <Button
                  variant="light"
                  leftSection={<IconDownload size={18} />}
                  onClick={() => {
                    const event = new Event('pwa-install-prompt')
                    window.dispatchEvent(event)
                  }}
                >
                  Install App
                </Button>
              </Tooltip>
            </Group>
          </Group>
        </Paper>

        {/* Processing Mode Selector */}
        <Paper p="md" withBorder>
          <Stack gap="sm">
            <Text size="sm" fw={500}>Processing Mode</Text>
            <SegmentedControl
              value={processingMode}
              onChange={(value) => setProcessingMode(value as typeof processingMode)}
              data={[
                { label: 'OCR Text', value: 'ocr' },
                { label: 'Table Detection', value: 'table' },
                { label: 'Layout Analysis', value: 'layout' },
                { label: 'All-in-One', value: 'all' }
              ]}
              fullWidth
            />
          </Stack>
        </Paper>
      
      <Tabs defaultValue="capture">
        <Tabs.List>
          <Tabs.Tab value="capture" leftSection={<IconPhoto size={16} />}>
            Capture
          </Tabs.Tab>
          <Tabs.Tab value="pdf" leftSection={<IconTextRecognition size={16} />}>
            PDF OCR
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
          <Tabs.Tab value="models" leftSection={<IconDatabase size={16} />}>
            Model Manager
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="capture" pt="md">
          <Stack gap="md">
            {/* Input Methods */}
            <Paper p="md" withBorder>
              <Group grow>
                <Button
                  leftSection={<IconUpload size={18} />}
                  onClick={open}
                  variant="light"
                >
                  Browse Files
                </Button>
                <Button
                  leftSection={<IconCamera size={18} />}
                  onClick={isCameraActive ? stopCamera : startCamera}
                  variant={isCameraActive ? 'filled' : 'light'}
                  color={isCameraActive ? 'red' : 'blue'}
                >
                  {isCameraActive ? 'Stop Camera' : 'Use Camera'}
                </Button>
                <Button
                  leftSection={<IconClipboard size={18} />}
                  variant="light"
                  onClick={() => {
                    notifications.show({
                      title: 'Paste Ready',
                      message: 'Press Ctrl+V to paste an image',
                      color: 'blue'
                    })
                  }}
                >
                  Paste Image
                </Button>
              </Group>
            </Paper>

            {/* Dropzone / Camera View */}
            {isCameraActive ? (
              <Paper p="md" withBorder>
                <Stack>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', maxHeight: '400px', borderRadius: 'var(--mantine-radius-md)' }}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    leftSection={<IconCapture size={20} />}
                    onClick={captureFromCamera}
                  >
                    Capture Photo
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  border: '2px dashed var(--mantine-color-gray-4)',
                  borderRadius: 'var(--mantine-radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'var(--mantine-color-gray-0)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <Stack align="center">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Group>
                      <Button
                        variant="light"
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage(null)
                          setImagePreview(null)
                        }}
                      >
                        Remove
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack align="center" gap="xs">
                    <IconPhoto size={48} stroke={1.5} style={{ opacity: 0.5 }} />
                    <Text size="lg" c="dimmed">
                      {isDragActive ? 'Drop image here' : 'Drag & drop an image or click to browse'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Supports PNG, JPG, JPEG, GIF, BMP, WebP
                    </Text>
                  </Stack>
                )}
              </div>
            )}

            {/* Process Button */}
            {selectedImage && (
              <Button
                size="lg"
                fullWidth
                loading={isProcessing}
                disabled={!selectedImage || isProcessing}
                onClick={() => processImage()}
                leftSection={<IconSparkles size={20} />}
              >
                Process with {processingMode === 'all' ? 'All Analyses' : processingMode.toUpperCase()}
              </Button>
            )}
            
            {(isProcessing || ocrProgress) && (
              <OCRProgress progress={ocrProgress} isProcessing={isProcessing} />
            )}
            
            {/* Results Display */}
            {result && processingMode !== 'table' && processingMode !== 'layout' && (
              <>
                <ResultViewer result={result} modelId={`${language}-${ocrVersion}-${modelType}`} />
                <PerformanceMonitor result={result} />
              </>
            )}

            {tableResult && (processingMode === 'table' || processingMode === 'all') && (
              <Paper p="md" withBorder>
                <Stack>
                  <Group justify="space-between">
                    <Group>
                      <IconTable size={20} />
                      <Text fw={500}>Table Detection Result</Text>
                    </Group>
                    <Badge>Processed in {tableResult.elapse.toFixed(2)}ms</Badge>
                  </Group>
                  <div dangerouslySetInnerHTML={{ __html: tableResult.html }} />
                  <Text size="sm" c="dimmed">
                    Detected {tableResult.cellBboxes.length} cells
                  </Text>
                </Stack>
              </Paper>
            )}

            {layoutResult && (processingMode === 'layout' || processingMode === 'all') && (
              <Paper p="md" withBorder>
                <Stack>
                  <Group justify="space-between">
                    <Group>
                      <IconLayout size={20} />
                      <Text fw={500}>Layout Analysis Result</Text>
                    </Group>
                    <Badge>Processed in {layoutResult.elapse.toFixed(2)}ms</Badge>
                  </Group>
                  <Stack gap="xs">
                    {layoutResult.classNames.map((className, idx) => (
                      <Group key={idx} justify="space-between">
                        <Text size="sm">{className}</Text>
                        <Badge variant="light">{(layoutResult.scores[idx] * 100).toFixed(1)}%</Badge>
                      </Group>
                    ))}
                  </Stack>
                  <Text size="sm" c="dimmed">
                    Detected {layoutResult.boxes.length} regions
                  </Text>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="pdf" pt="md">
          <PdfUpload onUpload={processPdf} isProcessing={isProcessing} />
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <Stack gap="md">
            <Paper p="lg" withBorder radius="md" style={{ borderColor: 'var(--mantine-color-gray-3)' }}>
              <Stack gap="md">
                <div>
                  <Group mb="md" justify="space-between">
                    <div>
                      <Text fw={600} size="lg">OCR Configuration</Text>
                      <Text size="sm" c="dimmed">Customize your OCR engine settings</Text>
                    </div>
                    <Badge leftSection={<IconBrain size={14} />} size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
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
                        { value: 'mobile', label: 'Mobile (Fast)' },
                        { value: 'server', label: 'Server (Accurate)' }
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
                
                {!isInitialized && (
                  <Alert icon={<IconLanguage size={16} />} color="yellow" variant="light" radius="md">
                    <Text size="sm">
                      Engine not initialized. It will be initialized when you process an image.
                    </Text>
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="models" pt="md">
          <Stack gap="md">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Text fw={600} size="lg">Model Configuration</Text>
                  <Text size="sm" c="dimmed">Select models for different processing tasks</Text>
                </div>

                <Divider label="OCR Models" labelPosition="left" />
                
                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Detection Model"
                      description="For text region detection"
                      value={ocrDetModel}
                      onChange={(v) => setOcrDetModel(v || 'rapidocr-ppv5-det')}
                      data={ocrDetModels.map(m => ({
                        value: m.id,
                        label: `${m.name} (${m.source.type})`
                      }))}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Recognition Model"
                      description="For text recognition"
                      value={ocrRecModel}
                      onChange={(v) => setOcrRecModel(v || 'rapidocr-ppv5-rec')}
                      data={ocrRecModels.map(m => ({
                        value: m.id,
                        label: `${m.name} (${m.source.type})`
                      }))}
                    />
                  </Grid.Col>
                </Grid>

                <Divider label="Table Models" labelPosition="left" />
                
                <Select
                  label="Table Detection Model"
                  description="For table structure recognition"
                  value={tableModel}
                  onChange={(v) => setTableModel(v || 'slanetplus')}
                  data={Object.entries(TABLE_MODELS).map(([key, model]) => ({
                    value: key,
                    label: model.description
                  }))}
                />

                <Divider label="Layout Models" labelPosition="left" />
                
                <Select
                  label="Layout Analysis Model"
                  description="For document layout detection"
                  value={layoutModel}
                  onChange={(v) => setLayoutModel(v || 'doclayout_docstructbench')}
                  data={Object.entries(LAYOUT_MODELS).map(([key, model]) => ({
                    value: key,
                    label: model.description
                  }))}
                />

                <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                  <Text size="sm">
                    Local models are stored in the public/models directory and loaded directly from disk for faster performance.
                  </Text>
                </Alert>

                <Divider label="Model Sources" labelPosition="left" />
                
                <Stack gap="xs">
                  {Object.entries(MODEL_SOURCES).map(([key, source]) => (
                    <Group key={key} justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>{source.name}</Text>
                        <Text size="xs" c="dimmed">{source.description}</Text>
                      </div>
                      <Button
                        component="a"
                        href={source.url}
                        target="_blank"
                        size="xs"
                        variant="subtle"
                        leftSection={<IconBrandGithub size={14} />}
                      >
                        View on GitHub
                      </Button>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* History Modal */}
      <Modal
        opened={showHistory}
        onClose={() => setShowHistory(false)}
        title="Processing History"
        size="lg"
      >
        <Stack>
          {history.length === 0 ? (
            <Text c="dimmed" ta="center">No processing history yet</Text>
          ) : (
            history.map((item) => (
              <Paper key={item.id} p="sm" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      {item.processingMode.toUpperCase()} Processing
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.timestamp.toLocaleString()}
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => {
                      setImagePreview(item.imageUrl)
                      setResult(item.result)
                      setShowHistory(false)
                    }}
                  >
                    Load
                  </Button>
                </Group>
              </Paper>
            ))
          )}
        </Stack>
      </Modal>
    </Stack>
    </Container>
  )
}