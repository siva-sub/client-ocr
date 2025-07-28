import { useState, useCallback } from 'react'
import { 
  Paper, Stack, Tabs, Alert, Select, Group, Text, Badge, Switch, 
  Divider, Button, Card, ActionIcon, Tooltip, Box,
  Container, Title, Modal, SimpleGrid,
  useMantineColorScheme, useMantineTheme, Affix,
  Collapse, SegmentedControl, Slider, Drawer, Burger,
  ScrollArea, Menu, Flex
} from '@mantine/core'
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Dropzone } from '@mantine/dropzone'
import { 
  IconSettings, IconInfoCircle, 
  IconBrain, IconUpload,
  IconCopy, IconFileTypePdf, IconFileTypeJs,
  IconFileTypeTxt, IconHistory, IconSun,
  IconMoon, IconAdjustmentsHorizontal, IconSparkles, IconWand,
  IconCamera, IconClipboard, IconCheck, IconShare
} from '@tabler/icons-react'
import { ResultViewer } from './ResultViewer'
import { PerformanceMonitor } from './PerformanceMonitor'
import { PwaInstallPrompt } from './PwaInstallPrompt'
import { LanguageSelector } from './LanguageSelector'
import { OCRProgress } from './OCRProgress'
import { RapidOCREngine, type OCREngineOptions, type OCRProgress as OCRProgressType } from '../core/rapid-ocr-engine'
import type { OCRResult } from '../types/ocr.types'
import type { LangType, OCRVersion, ModelType } from '../core/ocr-config'
import { ImageLoader } from '../core/image-loader'
import { pdfProcessor } from '../core/pdf-processor'

// Enhanced drag & drop zone component
function EnhancedDropzone({ onDrop, isProcessing }: { onDrop: (files: File[]) => void, isProcessing: boolean }) {
  const theme = useMantineTheme()
  const [isDragging, setIsDragging] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <Dropzone
      onDrop={(files) => {
        if (files.length > 0) onDrop(files)
      }}
      onReject={(_files) => {
        notifications.show({
          title: 'Invalid file',
          message: 'Please upload an image file (JPG, PNG, WebP)',
          color: 'red'
        })
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      maxSize={10 * 1024 ** 2}
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
        'application/pdf': ['.pdf']
      }}
      loading={isProcessing}
    >
      <Card 
        p={isMobile ? "md" : "xl"} 
        radius="md" 
        withBorder
        style={{
          borderStyle: 'dashed',
          borderWidth: 2,
          backgroundColor: isDragging ? theme.colors.blue[0] : theme.white,
          transition: 'all 0.3s ease',
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
      >
        <Stack align="center" gap="md">
          <Box style={{ position: 'relative' }}>
            <IconCamera 
              size={isMobile ? 48 : 64} 
              stroke={1.5} 
              color={isDragging ? theme.colors.blue[6] : theme.colors.gray[5]}
              style={{ transition: 'all 0.3s ease' }}
            />
            {isDragging && (
              <IconSparkles 
                size={24} 
                color={theme.colors.blue[6]}
                style={{ 
                  position: 'absolute', 
                  top: -10, 
                  right: -10,
                  animation: 'pulse 1s infinite'
                }}
              />
            )}
          </Box>
          
          <div>
            <Text size={isMobile ? "lg" : "xl"} fw={500} ta="center">
              Drop images or PDFs here
            </Text>
            <Text size="sm" c="dimmed" ta="center" mt={7}>
              or click to select files
            </Text>
          </div>
          
          <Button 
            variant="light" 
            size={isMobile ? "xs" : "sm"}
            leftSection={<IconUpload size={16} />}
            disabled={isProcessing}
            fullWidth={isMobile}
          >
            Choose files
          </Button>
          
          <Text size="xs" c="dimmed" ta="center">
            Supports: JPG, PNG, WebP, GIF, BMP, PDF (max 10MB)
          </Text>
        </Stack>
      </Card>
    </Dropzone>
  )
}

// Result actions component
function ResultActions({ result, onCopy, onDownload }: { 
  result: OCRResult, 
  onCopy: () => void,
  onDownload: (format: 'txt' | 'json' | 'pdf') => void 
}) {
  const [copied, setCopied] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: 'OCR Result',
          text: result.fullText
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      notifications.show({
        title: 'Share',
        message: 'Sharing is available on mobile devices',
        color: 'blue'
      })
    }
  }
  
  if (isMobile) {
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="light" size="xs" fullWidth>
            Actions
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item 
            leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            onClick={handleCopy}
            color={copied ? "green" : undefined}
          >
            {copied ? "Copied!" : "Copy text"}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item 
            leftSection={<IconFileTypeTxt size={16} />}
            onClick={() => onDownload('txt')}
          >
            Download TXT
          </Menu.Item>
          <Menu.Item 
            leftSection={<IconFileTypeJs size={16} />}
            onClick={() => onDownload('json')}
          >
            Download JSON
          </Menu.Item>
          <Menu.Item 
            leftSection={<IconFileTypePdf size={16} />}
            onClick={() => onDownload('pdf')}
          >
            Download PDF
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item 
            leftSection={<IconShare size={16} />}
            onClick={handleShare}
          >
            Share
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  }
  
  return (
    <Group gap="xs">
      <Tooltip label={copied ? "Copied!" : "Copy to clipboard"}>
        <ActionIcon 
          variant="light" 
          onClick={handleCopy}
          color={copied ? "green" : "blue"}
        >
          {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Download as TXT">
        <ActionIcon variant="light" onClick={() => onDownload('txt')}>
          <IconFileTypeTxt size={18} />
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Download as JSON">
        <ActionIcon variant="light" onClick={() => onDownload('json')}>
          <IconFileTypeJs size={18} />
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Download as PDF">
        <ActionIcon variant="light" onClick={() => onDownload('pdf')}>
          <IconFileTypePdf size={18} />
        </ActionIcon>
      </Tooltip>
      
      <Tooltip label="Share">
        <ActionIcon variant="light" onClick={handleShare}>
          <IconShare size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

// Enhanced OCR Interface Component
export function EnhancedOCRInterface() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  // const theme = useMantineTheme()
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<OCRProgressType | null>(null)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [engine, setEngine] = useState<RapidOCREngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<string | null>('ocr')
  const [mobileMenuOpened, { toggle: toggleMobileMenu }] = useDisclosure(false)
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)')
  // const isTablet = useMediaQuery('(max-width: 1024px)')
  // const isDesktop = useMediaQuery('(min-width: 1025px)')
  
  // Configuration state with localStorage persistence
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
  const [useDetection, setUseDetection] = useLocalStorage({ 
    key: 'ocr-use-detection', 
    defaultValue: true 
  })
  const [useClassification, setUseClassification] = useLocalStorage({ 
    key: 'ocr-use-classification', 
    defaultValue: true 
  })
  
  // Advanced settings
  const [opened, { open, close }] = useDisclosure(false)
  const [textThreshold, setTextThreshold] = useState(0.5)
  const [unclipRatio, setUnclipRatio] = useState(1.6)
  const [enableWordSegmentation, setEnableWordSegmentation] = useState(false)
  
  // History
  const [history, setHistory] = useLocalStorage<Array<{
    id: string,
    text: string,
    timestamp: number,
    language: string
  }>>({ key: 'ocr-history', defaultValue: [] })
  
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
            use_det: useDetection,
            use_cls: useClassification,
            use_rec: true,
            text_score: textThreshold,
            return_word_box: enableWordSegmentation,
            min_height: 30,
            width_height_ratio: 8,
            max_side_len: 2000,
            min_side_len: 50,
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
  }, [language, ocrVersion, modelType, useDetection, useClassification, textThreshold, unclipRatio, enableWordSegmentation])

  const processImage = async (input: File | Blob | string | ArrayBuffer) => {
    if (!engine || !isInitialized) {
      await initializeEngine()
      if (!engine) return
    }

    setIsProcessing(true)
    setOcrProgress(null)
    setResult(null)

    try {
      const startTime = performance.now()
      
      // Use dynamic image loader like RapidOCR
      const loadedImage = await ImageLoader.load(input)
      
      // Apply preprocessing if enabled
      let imageData: ImageData
      if (input instanceof File && input.size > 5 * 1024 * 1024) {
        // Large files - optimize for memory
        const canvas = document.createElement('canvas')
        const maxDimension = 2048
        const scale = Math.min(1, maxDimension / Math.max(loadedImage.width, loadedImage.height))
        
        canvas.width = Math.floor(loadedImage.width * scale)
        canvas.height = Math.floor(loadedImage.height * scale)
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!
        imageData = new ImageData(loadedImage.data, loadedImage.width, loadedImage.height)
        ctx.putImageData(imageData, 0, 0)
        
        if (scale < 1) {
          // Downscale for large images
          ctx.scale(scale, scale)
          ctx.drawImage(canvas, 0, 0)
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        }
      } else {
        imageData = new ImageData(loadedImage.data, loadedImage.width, loadedImage.height)
      }
      
      // Apply OCR preprocessing
      if (textThreshold < 0.7) {
        imageData = ImageLoader.preprocessForOCR(imageData)
      }
      
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
          modelType,
          preprocessed: textThreshold < 0.7,
          originalType: loadedImage.originalType
        }
      }

      setResult(ocrResult)
      
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        text: ocrResult.fullText.substring(0, 100) + '...',
        timestamp: Date.now(),
        language
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 9)])

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

  const handleDrop = async (files: File[]) => {
    const file = files[0]
    
    // Dynamic type detection like RapidOCR
    if (ImageLoader.isPDF(file)) {
      await processPdf(file)
    } else {
      await processImage(file)
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
      
      const startTime = performance.now()
      
      // Check if PDF has text layer first
      const { pages, pdf } = await pdfProcessor.extractTextFromPDF(file, {
        scale: 2.0,
        batchSize: isMobile ? 1 : 3,
        preprocess: textThreshold < 0.7,
        onProgress: (progress) => {
          setOcrProgress({
            stage: 'recognition',
            progress: (progress.currentPage / progress.totalPages) * 100
          })
        }
      })
      
      // Check for native text
      const hasText = await pdfProcessor.hasSelectableText(pdf)
      const metadata = await pdfProcessor.getMetadata(pdf)
      
      notifications.show({
        title: 'Processing PDF',
        message: hasText 
          ? 'PDF contains text layer, extracting combined results...' 
          : 'Scanned PDF detected, performing OCR...',
        color: 'blue'
      })
      
      const allResults: string[] = []
      const nativeText = hasText ? await pdfProcessor.extractNativeText(pdf) : []
      
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const pageNum = page.pageNumber
        
        // Skip if native text is sufficient
        if (nativeText[i - 1] && nativeText[i - 1].length > 50) {
          allResults.push(`Page ${pageNum}:\n${nativeText[i - 1]}`)
          continue
        }
        
        // Process with OCR
        const pageResults = await engine.process(
          page.imageData.data,
          page.width,
          page.height
        )
        
        const pageText = pageResults.map(r => r.text).join(' ')
        allResults.push(`Page ${pageNum}:\n${pageText || nativeText[i - 1] || '[No text found]'}`)
      }
      
      // Combine results
      const combinedText = allResults.join('\n\n')
      const processingTime = performance.now() - startTime
      
      setResult({
        fullText: combinedText,
        regions: [],
        processingTime,
        method: 'rapidocr',
        metadata: {
          ...metadata,
          language,
          ocrVersion,
          modelType,
          hasNativeText: hasText,
          totalPages: pdf.numPages
        }
      })
      
      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        text: `PDF: ${metadata.title} (${pdf.numPages} pages)`,
        timestamp: Date.now(),
        language
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 9)])
      
      notifications.show({
        title: 'PDF Processing Complete',
        message: `Successfully processed ${pdf.numPages} pages in ${Math.round(processingTime)}ms`,
        color: 'green'
      })
      
      // Cleanup
      pdfProcessor.destroy(pdf)
      
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

  // Handle clipboard paste with dynamic type support
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    
    for (const item of Array.from(items)) {
      // Handle images
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          await processImage(file)
          break
        }
      }
      
      // Handle text URLs (image URLs)
      if (item.type === 'text/plain') {
        item.getAsString(async (text) => {
          if (text.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|bmp)$/i)) {
            try {
              await processImage(text)
            } catch (error) {
              console.error('Failed to process URL:', error)
            }
          }
        })
      }
    }
  }, [processImage])

  // Copy result to clipboard
  const copyToClipboard = () => {
    if (result?.fullText) {
      navigator.clipboard.writeText(result.fullText)
      notifications.show({
        title: 'Copied!',
        message: 'Text copied to clipboard',
        color: 'green'
      })
    }
  }

  // Download result
  const downloadResult = (format: 'txt' | 'json' | 'pdf') => {
    if (!result) return
    
    let content: string
    let filename: string
    let mimeType: string
    
    switch (format) {
      case 'txt':
        content = result.fullText
        filename = 'ocr-result.txt'
        mimeType = 'text/plain'
        break
      case 'json':
        content = JSON.stringify(result, null, 2)
        filename = 'ocr-result.json'
        mimeType = 'application/json'
        break
      case 'pdf':
        // TODO: Implement PDF generation
        notifications.show({
          title: 'Coming soon',
          message: 'PDF export will be available soon',
          color: 'blue'
        })
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

  // Check if we need to reinitialize when settings change
  const handleSettingChange = () => {
    setIsInitialized(false)
    if (engine) {
      engine.dispose()
      setEngine(null)
    }
  }

  // Add paste event listener
  useState(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  })

  return (
    <Container size="xl" px={isMobile ? "xs" : "md"} py={isMobile ? "md" : "xl"}>
      <Stack gap={isMobile ? "md" : "xl"}>
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap="md">
          <div style={{ flex: 1, minWidth: 200 }}>
            <Title order={1} size={isMobile ? "h3" : "h2"} fw={700}>
              Client-Side OCR
            </Title>
            <Text size={isMobile ? "sm" : "lg"} c="dimmed">
              Powerful text recognition powered by RapidOCR
            </Text>
          </div>
          
          <Group gap={isMobile ? "xs" : "sm"}>
            {!isMobile && (
              <Badge 
                size="lg" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<IconBrain size={16} />}
              >
                RapidOCR v2.0
              </Badge>
            )}
            
            <ActionIcon
              variant="default"
              size={isMobile ? "md" : "lg"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            
            {isMobile && (
              <Burger
                opened={mobileMenuOpened}
                onClick={toggleMobileMenu}
                size="sm"
              />
            )}
          </Group>
        </Flex>

        <PwaInstallPrompt />
        
        {/* Mobile Menu Drawer */}
        {isMobile && (
          <Drawer
            opened={mobileMenuOpened}
            onClose={toggleMobileMenu}
            title="Menu"
            padding="md"
            size="xs"
          >
            <Stack>
              <Button
                variant={activeTab === 'ocr' ? 'filled' : 'subtle'}
                leftSection={<IconCamera size={16} />}
                onClick={() => {
                  setActiveTab('ocr')
                  toggleMobileMenu()
                }}
                fullWidth
              >
                OCR
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'filled' : 'subtle'}
                leftSection={<IconSettings size={16} />}
                onClick={() => {
                  setActiveTab('settings')
                  toggleMobileMenu()
                }}
                fullWidth
              >
                Settings
              </Button>
              <Button
                variant={activeTab === 'history' ? 'filled' : 'subtle'}
                leftSection={<IconHistory size={16} />}
                onClick={() => {
                  setActiveTab('history')
                  toggleMobileMenu()
                }}
                fullWidth
              >
                History
              </Button>
              <Divider my="sm" />
              <Badge 
                size="lg" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<IconBrain size={16} />}
                fullWidth
                style={{ cursor: 'default' }}
              >
                RapidOCR v2.0
              </Badge>
            </Stack>
          </Drawer>
        )}
        
        {/* Main Content */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          {!isMobile && (
            <Tabs.List>
              <Tabs.Tab value="ocr" leftSection={<IconCamera size={16} />}>
                OCR
              </Tabs.Tab>
              <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
                Settings
              </Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
                History
              </Tabs.Tab>
            </Tabs.List>
          )}

          <Tabs.Panel value="ocr" pt="xl">
            <Stack gap="lg">
              {/* Language Selection Bar */}
              <Paper p={isMobile ? "sm" : "md"} withBorder radius="md">
                <Stack gap="sm">
                  <Flex 
                    direction={isMobile ? "column" : "row"} 
                    justify="space-between" 
                    align={isMobile ? "stretch" : "center"}
                    gap="sm"
                  >
                    <Stack gap="sm" style={{ flex: 1 }}>
                      <LanguageSelector
                        value={language}
                        onChange={(value) => {
                          setLanguage(value)
                          handleSettingChange()
                        }}
                      />
                      
                      <SegmentedControl
                        value={modelType}
                        onChange={(value) => {
                          setModelType(value as ModelType)
                          handleSettingChange()
                        }}
                        data={[
                          { label: 'Fast', value: 'mobile' },
                          { label: 'Accurate', value: 'server' }
                        ]}
                        fullWidth={isMobile}
                      />
                    </Stack>
                    
                    <Button
                      variant="light"
                      leftSection={<IconAdjustmentsHorizontal size={16} />}
                      onClick={open}
                      size={isMobile ? "sm" : "md"}
                      fullWidth={isMobile}
                    >
                      Advanced
                    </Button>
                  </Flex>
                </Stack>
              </Paper>
              
              {/* Drop Zone */}
              <EnhancedDropzone onDrop={handleDrop} isProcessing={isProcessing} />
              
              {/* Quick Actions */}
              <Flex 
                justify="center" 
                gap="xs" 
                wrap="wrap"
                direction={isMobile ? "column" : "row"}
              >
                <Button
                  variant="subtle"
                  size={isMobile ? "xs" : "sm"}
                  leftSection={<IconClipboard size={16} />}
                  onClick={() => {
                    // Enhanced clipboard handling
                    if ('clipboard' in navigator && 'read' in navigator.clipboard) {
                      navigator.clipboard.read().then(async (items) => {
                        for (const item of items) {
                          if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                            const blob = await item.getType(item.types[0])
                            await processImage(blob)
                            return
                          }
                        }
                        notifications.show({
                          title: 'Paste an image',
                          message: 'Copy an image and press Ctrl+V to process it',
                          color: 'blue'
                        })
                      }).catch(() => {
                        notifications.show({
                          title: 'Paste an image',
                          message: 'Copy an image and press Ctrl+V to process it',
                          color: 'blue'
                        })
                      })
                    } else {
                      notifications.show({
                        title: 'Paste an image',
                        message: 'Copy an image and press Ctrl+V to process it',
                        color: 'blue'
                      })
                    }
                  }}
                  fullWidth={isMobile}
                >
                  Paste from clipboard
                </Button>
                
                <Button
                  variant="subtle"
                  size={isMobile ? "xs" : "sm"}
                  leftSection={<IconWand size={16} />}
                  onClick={async () => {
                    // Camera support for mobile
                    if (navigator.mediaDevices) {
                      try {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.capture = 'environment'
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            await processImage(file)
                          }
                        }
                        input.click()
                      } catch (error) {
                        notifications.show({
                          title: 'Camera access failed',
                          message: 'Unable to access camera',
                          color: 'red'
                        })
                      }
                    } else {
                      notifications.show({
                        title: 'Camera not supported',
                        message: 'Your browser does not support camera access',
                        color: 'yellow'
                      })
                    }
                  }}
                  fullWidth={isMobile}
                >
                  Use camera
                </Button>
              </Flex>
              
              {/* Progress */}
              {(isProcessing || ocrProgress) && (
                <OCRProgress progress={ocrProgress} isProcessing={isProcessing} />
              )}
              
              {/* Result */}
              {result && (
                <Stack gap="md">
                  <Paper p={isMobile ? "sm" : "lg"} withBorder radius="md">
                    <Flex 
                      justify="space-between" 
                      mb="md"
                      direction={isMobile ? "column" : "row"}
                      gap="sm"
                    >
                      <Stack gap="xs">
                        <Text fw={600} size={isMobile ? "md" : "lg"}>Result</Text>
                        <Badge variant="light" size={isMobile ? "sm" : "md"}>
                          {result.regions.length} regions • {Math.round(result.processingTime)}ms
                        </Badge>
                      </Stack>
                      
                      <ResultActions 
                        result={result}
                        onCopy={copyToClipboard}
                        onDownload={downloadResult}
                      />
                    </Flex>
                    
                    <Box>
                      <Flex justify="space-between" mb="xs" align="center" wrap="wrap" gap="xs">
                        <Text size="sm" c="dimmed">Extracted Text</Text>
                        <Switch
                          size="sm"
                          label={isMobile ? "Preview" : "Show preview"}
                          checked={showPreview}
                          onChange={(e) => setShowPreview(e.currentTarget.checked)}
                        />
                      </Flex>
                      
                      <Collapse in={showPreview}>
                        <ScrollArea h={isMobile ? 200 : 300}>
                          <Paper p={isMobile ? "xs" : "md"} bg="gray.0" radius="sm">
                            <Text size={isMobile ? "xs" : "sm"} style={{ whiteSpace: 'pre-wrap' }}>
                              {result.fullText}
                            </Text>
                          </Paper>
                        </ScrollArea>
                      </Collapse>
                    </Box>
                  </Paper>
                  
                  <ResultViewer result={result} modelId={`${language}-${ocrVersion}-${modelType}`} />
                  <PerformanceMonitor result={result} />
                </Stack>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="xl">
            <Stack gap="md">
              <Paper p="lg" withBorder radius="md">
                <Stack gap="lg">
                  <div>
                    <Text fw={600} size="lg" mb="md">OCR Configuration</Text>
                    
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={isMobile ? "sm" : "md"}>
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
                          { value: 'mobile', label: 'Mobile (Fast, ~10MB)' },
                          { value: 'server', label: 'Server (Accurate, ~100MB)' }
                        ]}
                      />
                    </SimpleGrid>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Text fw={600} size="lg" mb="md">Processing Options</Text>
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
                      
                      <Switch
                        label="Word Segmentation"
                        description="Enable word-level text segmentation"
                        checked={enableWordSegmentation}
                        onChange={(event) => {
                          setEnableWordSegmentation(event.currentTarget.checked)
                          handleSettingChange()
                        }}
                      />
                    </Stack>
                  </div>
                  
                  <Alert icon={<IconInfoCircle size={16} />} variant="light">
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>Model Information</Text>
                      <Text size="xs" c="dimmed">
                        RapidOCR supports 14+ languages including Chinese, English, French, German, 
                        Japanese, Korean, Russian, Portuguese, Spanish, Italian, Indonesian, Vietnamese, 
                        Persian, Kannada, and Tamil.
                      </Text>
                      <Text size="xs" c="dimmed">
                        Models are automatically downloaded and cached on first use.
                      </Text>
                    </Stack>
                  </Alert>
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>
          
          <Tabs.Panel value="history" pt="xl">
            <Stack gap="md">
              <Paper p="lg" withBorder radius="md">
                <Group justify="space-between" mb="md">
                  <Text fw={600} size="lg">Recent Scans</Text>
                  <Button
                    variant="subtle"
                    size="sm"
                    color="red"
                    onClick={() => {
                      setHistory([])
                      notifications.show({
                        title: 'History cleared',
                        message: 'All history items have been removed',
                        color: 'green'
                      })
                    }}
                  >
                    Clear history
                  </Button>
                </Group>
                
                {history.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    No scan history yet
                  </Text>
                ) : (
                  <Stack gap="xs">
                    {history.map((item) => (
                      <Paper key={item.id} p="md" withBorder radius="sm">
                        <Group justify="space-between">
                          <div style={{ flex: 1 }}>
                            <Text size="sm" lineClamp={2}>
                              {item.text}
                            </Text>
                            <Group gap="xs" mt="xs">
                              <Badge size="xs" variant="light">
                                {item.language.toUpperCase()}
                              </Badge>
                              <Text size="xs" c="dimmed">
                                {new Date(item.timestamp).toLocaleString()}
                              </Text>
                            </Group>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* Advanced Settings Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title="Advanced Settings"
          size="md"
        >
          <Stack gap="md">
            <div>
              <Text size="sm" fw={500} mb="xs">
                Text Score Threshold
              </Text>
              <Slider
                value={textThreshold}
                onChange={setTextThreshold}
                min={0}
                max={1}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1' }
                ]}
                label={(value) => value.toFixed(1)}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Minimum confidence score for text detection
              </Text>
            </div>
            
            <div>
              <Text size="sm" fw={500} mb="xs">
                Unclip Ratio
              </Text>
              <Slider
                value={unclipRatio}
                onChange={setUnclipRatio}
                min={1}
                max={3}
                step={0.1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 1.6, label: '1.6' },
                  { value: 3, label: '3' }
                ]}
                label={(value) => value.toFixed(1)}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Text region expansion ratio for better coverage
              </Text>
            </div>
            
            <Button onClick={() => {
              handleSettingChange()
              close()
            }}>
              Apply Changes
            </Button>
          </Stack>
        </Modal>
      </Stack>
      
      {/* Floating help button */}
      <Affix position={{ bottom: isMobile ? 16 : 20, right: isMobile ? 16 : 20 }}>
        <Tooltip label="Help & Documentation">
          <ActionIcon 
            size={isMobile ? "lg" : "xl"} 
            radius="xl" 
            variant="filled"
            onClick={() => window.open('https://github.com/siva-sub/client-ocr', '_blank')}
          >
            <IconInfoCircle size={isMobile ? 20 : 24} />
          </ActionIcon>
        </Tooltip>
      </Affix>
    </Container>
  )
}

// Add pulse animation CSS
const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`
document.head.appendChild(style)