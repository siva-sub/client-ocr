import { 
  Paper, Text, Stack, Group, Progress, ThemeIcon, Badge, 
  RingProgress, Timeline, Tooltip, Card, SimpleGrid,
  Divider, Tabs, Table, ScrollArea
} from '@mantine/core'
import { 
  IconClock, IconBrain, IconPhoto, IconFileText,
  IconZoomCheck, IconLanguage, IconAdjustments,
  IconChartBar, IconDatabase
} from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import type { OCRProgress } from '../core/rapid-ocr-engine'

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

interface EnhancedPerformanceMonitorProps {
  metrics?: ProcessingMetrics
  progress?: OCRProgress
  isProcessing: boolean
}

export function EnhancedPerformanceMonitor({ 
  metrics, 
  progress,
  isProcessing 
}: EnhancedPerformanceMonitorProps) {
  const [systemMetrics, setSystemMetrics] = useState({
    memory: 0,
    cpu: 0
  })

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        // Simulate system metrics (in a real app, these would come from actual monitoring)
        setSystemMetrics({
          memory: (performance as any).memory ? 
            Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100) : 
            Math.random() * 30 + 40,
          cpu: Math.random() * 20 + 30
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isProcessing])

  if (!metrics && !isProcessing) {
    return (
      <Card p="xl" withBorder>
        <Stack align="center" gap="md">
          <ThemeIcon size="xl" variant="light" color="gray">
            <IconChartBar size={32} />
          </ThemeIcon>
          <Text c="dimmed" ta="center">
            Performance metrics will appear here after processing
          </Text>
        </Stack>
      </Card>
    )
  }

  const performanceScore = metrics ? 
    Math.min(100, Math.round((1000 / metrics.totalTime) * 100)) : 0
  const performanceColor = performanceScore > 70 ? 'green' : 
    performanceScore > 40 ? 'yellow' : 'red'

  return (
    <Paper withBorder>
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="timing" leftSection={<IconClock size={16} />}>
            Timing
          </Tabs.Tab>
          <Tabs.Tab value="details" leftSection={<IconDatabase size={16} />}>
            Details
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" p="md">
          <Stack gap="md">
            {/* Real-time Progress */}
            {isProcessing && progress && (
              <Card withBorder>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={500}>Processing Progress</Text>
                    <Badge color="blue" variant="dot">
                      {progress.stage}
                    </Badge>
                  </Group>
                  <Progress 
                    value={progress.progress * 100} 
                    animated 
                    color="blue"
                  />
                  <Text size="sm" ta="center" c="dimmed">
                    {Math.round(progress.progress * 100)}%
                  </Text>
                </Stack>
              </Card>
            )}

            {/* Performance Score */}
            {metrics && (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Card withBorder>
                  <Stack align="center" gap="md">
                    <Text fw={500}>Performance Score</Text>
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[
                        { value: performanceScore, color: performanceColor }
                      ]}
                      label={
                        <Text ta="center" fw={700} size="xl">
                          {performanceScore}%
                        </Text>
                      }
                    />
                    <Badge color={performanceColor} variant="light">
                      {performanceScore > 70 ? 'Excellent' : 
                       performanceScore > 40 ? 'Good' : 'Needs Optimization'}
                    </Badge>
                  </Stack>
                </Card>

                <Card withBorder>
                  <Stack gap="sm">
                    <Text fw={500}>Key Metrics</Text>
                    <SimpleGrid cols={2} spacing="xs">
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light">
                          <IconClock size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed">Total Time</Text>
                          <Text fw={500}>{metrics.totalTime}ms</Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light">
                          <IconFileText size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed">Text Regions</Text>
                          <Text fw={500}>{metrics.textRegions}</Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light">
                          <IconZoomCheck size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed">Avg Confidence</Text>
                          <Text fw={500}>{Math.round(metrics.averageConfidence * 100)}%</Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light">
                          <IconPhoto size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed">Image Size</Text>
                          <Text fw={500}>{metrics.imageWidth}×{metrics.imageHeight}</Text>
                        </div>
                      </Group>
                    </SimpleGrid>
                  </Stack>
                </Card>
              </SimpleGrid>
            )}

            {/* System Metrics */}
            {isProcessing && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={500}>System Resources</Text>
                  <SimpleGrid cols={2} spacing="md">
                    <div>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" c="dimmed">Memory Usage</Text>
                        <Text size="sm" fw={500}>{systemMetrics.memory}%</Text>
                      </Group>
                      <Progress value={systemMetrics.memory} color="blue" />
                    </div>
                    
                    <div>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" c="dimmed">CPU Usage</Text>
                        <Text size="sm" fw={500}>{systemMetrics.cpu}%</Text>
                      </Group>
                      <Progress value={systemMetrics.cpu} color="orange" />
                    </div>
                  </SimpleGrid>
                </Stack>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="timing" p="md">
          {metrics && (
            <Stack gap="md">
              <Timeline active={-1} bulletSize={24} lineWidth={2}>
                <Timeline.Item 
                  bullet={<IconAdjustments size={12} />}
                  title="Preprocessing"
                  color={metrics.preprocessingTime ? "blue" : "gray"}
                >
                  <Text c="dimmed" size="sm">
                    {metrics.preprocessingTime || 0}ms
                    {metrics.preprocessingApplied && metrics.preprocessingApplied.length > 0 && (
                      <Text size="xs" c="dimmed">
                        Applied: {metrics.preprocessingApplied.join(', ')}
                      </Text>
                    )}
                  </Text>
                </Timeline.Item>

                <Timeline.Item 
                  bullet={<IconPhoto size={12} />}
                  title="Text Detection"
                  color="blue"
                >
                  <Text c="dimmed" size="sm">
                    {metrics.detectionTime}ms - Found {metrics.textRegions} regions
                  </Text>
                </Timeline.Item>

                <Timeline.Item 
                  bullet={<IconBrain size={12} />}
                  title="Orientation Classification"
                  color="blue"
                >
                  <Text c="dimmed" size="sm">
                    {metrics.classificationTime}ms
                  </Text>
                </Timeline.Item>

                <Timeline.Item 
                  bullet={<IconLanguage size={12} />}
                  title="Text Recognition"
                  color="blue"
                >
                  <Text c="dimmed" size="sm">
                    {metrics.recognitionTime}ms - {metrics.totalCharacters} characters
                  </Text>
                </Timeline.Item>

                <Timeline.Item 
                  bullet={<IconFileText size={12} />}
                  title="Post-processing"
                  color={metrics.postprocessingTime ? "blue" : "gray"}
                >
                  <Text c="dimmed" size="sm">
                    {metrics.postprocessingTime || 0}ms
                  </Text>
                </Timeline.Item>
              </Timeline>

              <Divider />

              <SimpleGrid cols={2} spacing="md">
                <Card withBorder>
                  <Stack gap="xs">
                    <Text fw={500} size="sm">Processing Breakdown</Text>
                    <Progress.Root size="xl">
                      <Tooltip label={`Detection: ${metrics.detectionTime}ms`}>
                        <Progress.Section 
                          value={(metrics.detectionTime / metrics.totalTime) * 100} 
                          color="cyan"
                        />
                      </Tooltip>
                      <Tooltip label={`Classification: ${metrics.classificationTime}ms`}>
                        <Progress.Section 
                          value={(metrics.classificationTime / metrics.totalTime) * 100} 
                          color="blue"
                        />
                      </Tooltip>
                      <Tooltip label={`Recognition: ${metrics.recognitionTime}ms`}>
                        <Progress.Section 
                          value={(metrics.recognitionTime / metrics.totalTime) * 100} 
                          color="indigo"
                        />
                      </Tooltip>
                    </Progress.Root>
                  </Stack>
                </Card>

                <Card withBorder>
                  <Stack gap="xs">
                    <Text fw={500} size="sm">Speed Metrics</Text>
                    <Text size="xs" c="dimmed">
                      Characters/second: {Math.round((metrics.totalCharacters / metrics.totalTime) * 1000)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Regions/second: {Math.round((metrics.textRegions / metrics.totalTime) * 1000)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Pixels/ms: {Math.round(metrics.pixelCount / metrics.totalTime)}
                    </Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="details" p="md">
          {metrics && (
            <ScrollArea h={400}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Metric</Table.Th>
                    <Table.Th>Value</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>Language</Table.Td>
                    <Table.Td>
                      <Badge variant="light">{metrics.language}</Badge>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Model Version</Table.Td>
                    <Table.Td>{metrics.modelVersion}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Model Type</Table.Td>
                    <Table.Td>{metrics.modelType}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Image Dimensions</Table.Td>
                    <Table.Td>{metrics.imageWidth} × {metrics.imageHeight}px</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total Pixels</Table.Td>
                    <Table.Td>{metrics.pixelCount.toLocaleString()}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Text Regions</Table.Td>
                    <Table.Td>{metrics.textRegions}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total Characters</Table.Td>
                    <Table.Td>{metrics.totalCharacters}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Average Confidence</Table.Td>
                    <Table.Td>{(metrics.averageConfidence * 100).toFixed(2)}%</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Cache Hit</Table.Td>
                    <Table.Td>
                      <Badge color={metrics.cacheHit ? 'green' : 'gray'}>
                        {metrics.cacheHit ? 'Yes' : 'No'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                  {metrics.preprocessingApplied && (
                    <Table.Tr>
                      <Table.Td>Preprocessing</Table.Td>
                      <Table.Td>{metrics.preprocessingApplied.join(', ')}</Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  )
}