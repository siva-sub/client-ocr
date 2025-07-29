import { useState } from 'react'
import { Paper, Text, Group, Stack, Image, Button, rem } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react'

interface ImageUploadProps {
  onUpload: (file: File) => void
  isProcessing: boolean
  isInitialized?: boolean
}

export function ImageUpload({ onUpload, isProcessing, isInitialized = true }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleDrop = (files: File[]) => {
    const selectedFile = files[0]
    setFile(selectedFile)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleProcess = () => {
    if (file) {
      onUpload(file)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setFile(null)
  }

  if (preview) {
    return (
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Image
            src={preview}
            alt="Preview"
            mah={400}
            fit="contain"
            radius="md"
          />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {file?.name} ({Math.round((file?.size || 0) / 1024)}KB)
            </Text>
            <Group>
              <Button
                leftSection={<IconTrash size={16} />}
                variant="light"
                color="red"
                size="sm"
                onClick={handleClear}
                disabled={isProcessing}
              >
                Clear
              </Button>
              <Button
                leftSection={<IconPhoto size={16} />}
                size="sm"
                onClick={handleProcess}
                loading={isProcessing}
              >
                Process Image
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
    )
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      disabled={isProcessing || !isInitialized}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {!isInitialized ? 'Initializing OCR Engine...' : 'Drag image here or click to select'}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {!isInitialized ? 'Please wait while the engine loads' : 'Attach an image file, it should not exceed 5mb'}
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}