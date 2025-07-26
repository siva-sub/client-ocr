import { Paper, Text, Stack, Group, Progress, ThemeIcon, Badge } from '@mantine/core'
import { IconClock, IconBrain, IconPhoto } from '@tabler/icons-react'
import type { OCRResult } from '../types/ocr.types'

interface PerformanceMonitorProps {
  result: OCRResult
}

export function PerformanceMonitor({ result }: PerformanceMonitorProps) {
  const performanceScore = Math.min(100, Math.round((1000 / result.processingTime) * 100))
  const performanceColor = performanceScore > 70 ? 'green' : performanceScore > 40 ? 'yellow' : 'red'

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Text fw={500}>Performance Metrics</Text>

        <Group gap="xl">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="xs">
              <ThemeIcon variant="light" size="sm">
                <IconClock size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">Processing Time</Text>
            </Group>
            <Text fw={500}>{Math.round(result.processingTime)}ms</Text>
          </Stack>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="xs">
              <ThemeIcon variant="light" size="sm">
                <IconBrain size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">Method Used</Text>
            </Group>
            <Badge variant="light" color={result.method === 'onnx' ? 'green' : 'blue'}>
              {result.method === 'onnx' ? 'ONNX Runtime' : 'Tesseract.js'}
            </Badge>
          </Stack>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="xs">
              <ThemeIcon variant="light" size="sm">
                <IconPhoto size={16} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">Image Size</Text>
            </Group>
            <Text fw={500}>
              {result.metadata?.imageWidth} × {result.metadata?.imageHeight}
            </Text>
          </Stack>
        </Group>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Performance Score</Text>
            <Text size="sm" fw={500}>{performanceScore}%</Text>
          </Group>
          <Progress value={performanceScore} color={performanceColor} size="lg" />
        </Stack>

        <Stack gap="xs">
          <Text size="sm" fw={500}>Region Confidence</Text>
          {result.regions.slice(0, 5).map((region, index) => {
            const confidence = Math.round(region.confidence * 100)
            const confidenceColor = confidence > 80 ? 'green' : confidence > 60 ? 'yellow' : 'red'
            
            return (
              <Group key={index} gap="xs">
                <Text size="xs" c="dimmed" style={{ minWidth: 100 }}>
                  {region.text.substring(0, 15)}...
                </Text>
                <Progress 
                  value={confidence} 
                  color={confidenceColor} 
                  size="sm" 
                  style={{ flex: 1 }}
                />
                <Text size="xs" fw={500}>{confidence}%</Text>
              </Group>
            )
          })}
          {result.regions.length > 5 && (
            <Text size="xs" c="dimmed" ta="center">
              ... and {result.regions.length - 5} more regions
            </Text>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}