import { Stack, Progress, Text, Group, Paper, Badge } from '@mantine/core'
import { IconPhoto, IconRotate, IconTextRecognition } from '@tabler/icons-react'
import type { OCRProgress } from '../core/rapid-ocr-engine'

interface OCRProgressProps {
  progress: OCRProgress | null
  isProcessing: boolean
}

const STAGE_INFO = {
  detection: {
    label: 'Text Detection',
    description: 'Finding text regions in the image',
    icon: IconPhoto,
    color: 'blue'
  },
  classification: {
    label: 'Orientation Detection',
    description: 'Detecting text rotation',
    icon: IconRotate,
    color: 'orange'
  },
  recognition: {
    label: 'Text Recognition',
    description: 'Converting text regions to characters',
    icon: IconTextRecognition,
    color: 'green'
  }
}

export function OCRProgress({ progress, isProcessing }: OCRProgressProps) {
  if (!isProcessing && !progress) return null
  
  const currentStage = progress?.stage || 'detection'
  const stageInfo = STAGE_INFO[currentStage]
  const Icon = stageInfo.icon
  
  return (
    <Paper p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="xs">
            <Icon size={20} />
            <Text fw={500}>{stageInfo.label}</Text>
          </Group>
          <Badge size="sm" color={stageInfo.color as any}>
            {Math.round((progress?.progress || 0) * 100)}%
          </Badge>
        </Group>
        
        <Progress 
          value={(progress?.progress || 0) * 100} 
          animated 
          color={stageInfo.color}
        />
        
        <Text size="sm" c="dimmed">
          {stageInfo.description}
        </Text>
        
        <Group gap="xs" mt="xs">
          {Object.entries(STAGE_INFO).map(([stage, info]) => {
            const isActive = stage === currentStage
            const isPast = progress && ['classification', 'recognition'].includes(stage) && currentStage === 'detection' ? false :
                          progress && stage === 'detection' && ['classification', 'recognition'].includes(currentStage) ? true :
                          progress && stage === 'classification' && currentStage === 'recognition' ? true : false
            
            return (
              <Badge
                key={stage}
                variant={isActive ? 'filled' : isPast ? 'light' : 'outline'}
                color={info.color as any}
                size="xs"
              >
                {info.label}
              </Badge>
            )
          })}
        </Group>
      </Stack>
    </Paper>
  )
}