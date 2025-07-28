import React, { useState, useCallback } from 'react'
import { 
  Container, 
  Title, 
  Paper, 
  Group, 
  Button, 
  Select, 
  Tabs,
  Stack,
  Alert,
  Progress,
  Text,
  Badge,
  Card,
  Grid,
  Divider,
  Overlay,
  LoadingOverlay
} from '@mantine/core'
import { 
  IconPhoto, 
  IconTable, 
  IconLayout, 
  IconFileText,
  IconSparkles,
  IconAlertCircle
} from '@tabler/icons-react'
import { useOCR } from '../hooks/useOCR'
import { MODEL_REGISTRY, getModelsByCategory } from '../core/model-registry'
import { TABLE_MODELS } from '../core/table-models'
import { LAYOUT_MODELS } from '../core/layout-models'
import type { OCRConfig } from '../core/ocr-config'

interface ProcessingResult {
  type: 'ocr' | 'table' | 'layout'
  data: any
  elapse: number
}

export function EnhancedOCRInterface() {
  const [activeTab, setActiveTab] = useState<string | null>('ocr')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<ProcessingResult[]>([])
  
  // Model selections
  const [ocrDetModel, setOcrDetModel] = useState('rapidocr-ppv5-det')
  const [ocrRecModel, setOcrRecModel] = useState('rapidocr-ppv5-rec')
  const [tableModel, setTableModel] = useState('slanetplus')
  const [layoutModel, setLayoutModel] = useState('doclayout_docstructbench')
  
  const { processImage, isProcessing } = useOCR()

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleProcess = useCallback(async () => {
    if (!selectedImage || !imagePreview) return
    
    setProcessing(true)
    setResults([])
    
    try {
      switch (activeTab) {
        case 'ocr':
          // Perform OCR
          const ocrResult = await processImage(imagePreview)
          setResults([{
            type: 'ocr',
            data: ocrResult,
            elapse: ocrResult.elapse || 0
          }])
          break
          
        case 'table':
          // Perform table detection
          // TODO: Implement table detection
          console.log('Table detection not yet implemented')
          break
          
        case 'layout':
          // Perform layout analysis
          // TODO: Implement layout analysis
          console.log('Layout analysis not yet implemented')
          break
          
        case 'all':
          // Perform all analyses
          // TODO: Implement combined analysis
          console.log('Combined analysis not yet implemented')
          break
      }
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setProcessing(false)
    }
  }, [selectedImage, imagePreview, activeTab, processImage])

  const ocrDetModels = getModelsByCategory('ocr-det')
  const ocrRecModels = getModelsByCategory('ocr-rec')

  return (
    <Container size="xl" py="md">
      <Stack>
        <Group justify="space-between" align="center">
          <Title order={2} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSparkles size={32} stroke={1.5} style={{ color: 'var(--mantine-color-blue-6)' }} />
            Enhanced OCR Suite
          </Title>
          <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            v1.2.7
          </Badge>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="ocr" leftSection={<IconFileText size={16} />}>
              OCR Processing
            </Tabs.Tab>
            <Tabs.Tab value="table" leftSection={<IconTable size={16} />}>
              Table Detection
            </Tabs.Tab>
            <Tabs.Tab value="layout" leftSection={<IconLayout size={16} />}>
              Layout Analysis
            </Tabs.Tab>
            <Tabs.Tab value="all" leftSection={<IconSparkles size={16} />}>
              All-in-One
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ocr" pt="md">
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Detection Model"
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
                  value={ocrRecModel}
                  onChange={(v) => setOcrRecModel(v || 'rapidocr-ppv5-rec')}
                  data={ocrRecModels.map(m => ({
                    value: m.id,
                    label: `${m.name} (${m.source.type})`
                  }))}
                />
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="table" pt="md">
            <Select
              label="Table Model"
              value={tableModel}
              onChange={(v) => setTableModel(v || 'slanetplus')}
              data={Object.entries(TABLE_MODELS).map(([key, model]) => ({
                value: key,
                label: model.description
              }))}
            />
          </Tabs.Panel>

          <Tabs.Panel value="layout" pt="md">
            <Select
              label="Layout Model"
              value={layoutModel}
              onChange={(v) => setLayoutModel(v || 'doclayout_docstructbench')}
              data={Object.entries(LAYOUT_MODELS).map(([key, model]) => ({
                value: key,
                label: model.description
              }))}
            />
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="md">
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              All-in-One mode will run layout analysis first, then apply OCR to text regions and table detection to table regions.
            </Alert>
          </Tabs.Panel>
        </Tabs>

        <Paper shadow="sm" p="md" withBorder>
          <Stack>
            <div
              style={{
                border: '2px dashed var(--mantine-color-gray-4)',
                borderRadius: 'var(--mantine-radius-md)',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageSelect(file)
                }}
              />
              
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              ) : (
                <Stack align="center" gap="xs">
                  <IconPhoto size={48} stroke={1.5} style={{ opacity: 0.5 }} />
                  <Text size="lg" c="dimmed">Click to select an image</Text>
                </Stack>
              )}
            </div>

            <Button 
              size="lg"
              fullWidth
              disabled={!selectedImage || processing}
              onClick={handleProcess}
              loading={processing}
            >
              Process Image
            </Button>
          </Stack>
        </Paper>

        {results.length > 0 && (
          <Paper shadow="sm" p="md" withBorder>
            <Title order={3} mb="md">Results</Title>
            {results.map((result, index) => (
              <div key={index}>
                {result.type === 'ocr' && (
                  <Stack>
                    <Group justify="space-between">
                      <Badge>OCR Result</Badge>
                      <Text size="sm" c="dimmed">
                        Processed in {result.elapse.toFixed(2)}ms
                      </Text>
                    </Group>
                    <Paper p="md" withBorder>
                      <Text style={{ whiteSpace: 'pre-wrap' }}>
                        {result.data.text || 'No text detected'}
                      </Text>
                    </Paper>
                  </Stack>
                )}
              </div>
            ))}
          </Paper>
        )}
      </Stack>

      <LoadingOverlay visible={processing} />
    </Container>
  )
}