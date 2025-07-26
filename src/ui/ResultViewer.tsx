import { Paper, Title, Text, Stack, Group, Badge, CopyButton, ActionIcon, Tooltip } from '@mantine/core'
import { CodeHighlightTabs } from '@mantine/code-highlight'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { getModelConfig } from '../core/model-config'
import type { OCRResult } from '../types/ocr.types'

interface ResultViewerProps {
  result: OCRResult
  modelId?: string
}

export function ResultViewer({ result, modelId }: ResultViewerProps) {
  const modelConfig = modelId ? getModelConfig(modelId) : null
  const structuredData = {
    regions: result.regions.map(r => ({
      text: r.text,
      confidence: Math.round(r.confidence * 100) + '%',
      position: {
        x: Math.round(r.box.topLeft.x),
        y: Math.round(r.box.topLeft.y),
        width: Math.round(r.box.topRight.x - r.box.topLeft.x),
        height: Math.round(r.box.bottomLeft.y - r.box.topLeft.y)
      }
    })),
    metadata: result.metadata
  }

  const jsonCode = JSON.stringify(structuredData, null, 2)

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>OCR Results</Title>
          <Group gap="xs">
            {modelConfig && (
              <Badge variant="light" color="grape">
                {modelConfig.name}
              </Badge>
            )}
            <Badge color={result.method === 'onnx' ? 'green' : 'blue'}>
              {result.method.toUpperCase()}
            </Badge>
            <Badge variant="light">
              {result.regions.length} regions
            </Badge>
          </Group>
        </Group>

        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={500}>Extracted Text</Text>
            <CopyButton value={result.fullText} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          
          <Paper p="sm" bg="gray.0" withBorder>
            <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {result.fullText || 'No text detected'}
            </Text>
          </Paper>
        </Stack>

        <CodeHighlightTabs
          code={[
            {
              fileName: 'structured-data.json',
              code: jsonCode,
              language: 'json'
            },
            {
              fileName: 'raw-text.txt',
              code: result.fullText || 'No text detected',
              language: 'text'
            }
          ]}
        />

        {result.metadata?.deskewAngle && Math.abs(result.metadata.deskewAngle) > 0.5 && (
          <Paper p="sm" bg="blue.0" withBorder>
            <Text size="sm" c="blue.7">
              Image was automatically deskewed by {result.metadata.deskewAngle.toFixed(1)}°
            </Text>
          </Paper>
        )}
      </Stack>
    </Paper>
  )
}