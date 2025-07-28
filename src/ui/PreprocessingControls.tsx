import { 
  Card, Stack, Switch, Slider, Text, Button, Group, 
  Collapse, ActionIcon, Tooltip, Badge, Divider 
} from '@mantine/core'
import { 
  IconAdjustments, IconWand, IconChevronDown, 
  IconChevronUp, IconRefresh, IconEye 
} from '@tabler/icons-react'
import { useState } from 'react'
import type { PreprocessingOptions } from '../core/preprocessing/image-preprocessor'

interface PreprocessingControlsProps {
  options: PreprocessingOptions
  onChange: (options: PreprocessingOptions) => void
  onPreview?: () => void
  onAuto?: () => void
  isProcessing?: boolean
}

export function PreprocessingControls({
  options,
  onChange,
  onPreview,
  onAuto,
  isProcessing = false
}: PreprocessingControlsProps) {
  const [expanded, setExpanded] = useState(false)
  
  const updateOption = (key: keyof PreprocessingOptions, value: any) => {
    onChange({ ...options, [key]: value })
  }

  const activeCount = Object.entries(options).filter(([key, value]) => {
    if (typeof value === 'boolean') return value
    if (key === 'scale') return value !== 1
    return false
  }).length

  return (
    <Card radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconAdjustments size={20} />
            <Text fw={500}>Preprocessing</Text>
            {activeCount > 0 && (
              <Badge size="sm" variant="filled">
                {activeCount} active
              </Badge>
            )}
          </Group>
          
          <Group gap="xs">
            {onAuto && (
              <Tooltip label="Auto-detect best settings">
                <ActionIcon 
                  variant="light" 
                  onClick={onAuto}
                  disabled={isProcessing}
                >
                  <IconWand size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            
            {onPreview && (
              <Tooltip label="Preview processed image">
                <ActionIcon 
                  variant="light" 
                  onClick={onPreview}
                  disabled={isProcessing}
                >
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            
            <ActionIcon
              variant="subtle"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          </Group>
        </Group>

        <Collapse in={expanded}>
          <Stack gap="md">
            {/* Basic Options */}
            <div>
              <Text size="sm" fw={500} mb="xs">Basic Enhancements</Text>
              <Stack gap="xs">
                <Switch
                  label="Convert to Grayscale"
                  checked={options.grayscale ?? true}
                  onChange={(e) => updateOption('grayscale', e.currentTarget.checked)}
                />
                
                <Switch
                  label="Remove Noise"
                  checked={options.denoise ?? false}
                  onChange={(e) => updateOption('denoise', e.currentTarget.checked)}
                />
                
                {options.denoise && (
                  <Slider
                    label="Noise Reduction Strength"
                    value={options.denoiseStrength ?? 10}
                    onChange={(value) => updateOption('denoiseStrength', value)}
                    min={1}
                    max={30}
                    marks={[
                      { value: 5, label: 'Light' },
                      { value: 15, label: 'Medium' },
                      { value: 25, label: 'Strong' }
                    ]}
                    ml="md"
                    mb="sm"
                  />
                )}
                
                <Switch
                  label="Enhance Contrast"
                  checked={options.contrast ?? false}
                  onChange={(e) => updateOption('contrast', e.currentTarget.checked)}
                />
                
                {options.contrast && (
                  <>
                    <Slider
                      label="Contrast Level"
                      value={options.contrastAlpha ?? 1.5}
                      onChange={(value) => updateOption('contrastAlpha', value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      marks={[
                        { value: 1, label: 'Normal' },
                        { value: 2, label: 'High' }
                      ]}
                      ml="md"
                    />
                    
                    <Slider
                      label="Brightness"
                      value={options.contrastBeta ?? 0}
                      onChange={(value) => updateOption('contrastBeta', value)}
                      min={-50}
                      max={50}
                      marks={[
                        { value: -25, label: 'Darker' },
                        { value: 0, label: 'Normal' },
                        { value: 25, label: 'Brighter' }
                      ]}
                      ml="md"
                      mb="sm"
                    />
                  </>
                )}
                
                <Switch
                  label="Sharpen Image"
                  checked={options.sharpen ?? false}
                  onChange={(e) => updateOption('sharpen', e.currentTarget.checked)}
                />
              </Stack>
            </div>

            <Divider />

            {/* Advanced Options */}
            <div>
              <Text size="sm" fw={500} mb="xs">Advanced Options</Text>
              <Stack gap="xs">
                <Switch
                  label="Binary Threshold"
                  checked={options.threshold ?? false}
                  onChange={(e) => updateOption('threshold', e.currentTarget.checked)}
                  description="Convert to pure black and white"
                />
                
                {options.threshold && (
                  <Slider
                    label="Threshold Value"
                    value={options.thresholdValue ?? 127}
                    onChange={(value) => updateOption('thresholdValue', value)}
                    min={0}
                    max={255}
                    marks={[
                      { value: 64, label: 'Dark' },
                      { value: 127, label: 'Mid' },
                      { value: 192, label: 'Light' }
                    ]}
                    ml="md"
                    mb="sm"
                  />
                )}
                
                <Switch
                  label="Auto-Deskew"
                  checked={options.deskew ?? false}
                  onChange={(e) => updateOption('deskew', e.currentTarget.checked)}
                  description="Automatically straighten tilted text"
                />
                
                <Switch
                  label="Remove Background"
                  checked={options.removeBackground ?? false}
                  onChange={(e) => updateOption('removeBackground', e.currentTarget.checked)}
                  description="Simple background removal"
                />
              </Stack>
            </div>

            <Divider />

            {/* Scale Option */}
            <div>
              <Text size="sm" fw={500} mb="xs">Image Scale</Text>
              <Slider
                value={options.scale ?? 1}
                onChange={(value) => updateOption('scale', value)}
                min={0.5}
                max={2}
                step={0.1}
                marks={[
                  { value: 0.5, label: '50%' },
                  { value: 1, label: '100%' },
                  { value: 1.5, label: '150%' },
                  { value: 2, label: '200%' }
                ]}
                mb="sm"
              />
            </div>

            <Group justify="flex-end">
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconRefresh size={14} />}
                onClick={() => onChange({})}
              >
                Reset All
              </Button>
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  )
}