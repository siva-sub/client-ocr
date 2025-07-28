import { Stack, Progress, Text, Group, Paper, Badge, Button } from '@mantine/core'
import { IconDownload, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import type { DownloadProgress } from '../core/model-downloader'

interface ModelDownloadProgressProps {
  downloads: DownloadProgress[]
  onRetry?: (modelName: string) => void
}

const STATUS_COLORS = {
  downloading: 'blue',
  verifying: 'orange',
  complete: 'green',
  error: 'red'
}

const STATUS_LABELS = {
  downloading: 'Downloading',
  verifying: 'Verifying',
  complete: 'Complete',
  error: 'Failed'
}

export function ModelDownloadProgress({ downloads, onRetry }: ModelDownloadProgressProps) {
  if (downloads.length === 0) return null
  
  const totalProgress = downloads.reduce((sum, d) => {
    if (d.status === 'complete') return sum + 1
    if (d.total > 0) return sum + (d.progress / d.total)
    return sum
  }, 0) / downloads.length * 100
  
  return (
    <Paper p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="xs">
            <IconDownload size={20} />
            <Text fw={500}>Downloading Models</Text>
          </Group>
          <Badge size="sm" color="blue">
            {Math.round(totalProgress)}%
          </Badge>
        </Group>
        
        <Progress value={totalProgress} animated />
        
        <Stack gap="xs">
          {downloads.map((download) => (
            <Group key={download.modelName} justify="space-between">
              <Group gap="xs">
                <Text size="sm">{download.modelName}</Text>
                {download.status === 'complete' && (
                  <IconCheck size={16} color="var(--mantine-color-green-6)" />
                )}
                {download.status === 'error' && (
                  <IconAlertCircle size={16} color="var(--mantine-color-red-6)" />
                )}
              </Group>
              
              <Group gap="xs">
                {download.total > 0 && download.status === 'downloading' && (
                  <Text size="xs" c="dimmed">
                    {formatBytes(download.progress)} / {formatBytes(download.total)}
                  </Text>
                )}
                
                <Badge
                  size="xs"
                  color={STATUS_COLORS[download.status] as any}
                  variant={download.status === 'complete' ? 'light' : 'filled'}
                >
                  {STATUS_LABELS[download.status]}
                </Badge>
                
                {download.status === 'error' && onRetry && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => onRetry(download.modelName)}
                  >
                    Retry
                  </Button>
                )}
              </Group>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}