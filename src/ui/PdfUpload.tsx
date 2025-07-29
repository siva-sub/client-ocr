import { Text, Group, rem } from '@mantine/core'
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone'
import { IconUpload, IconFileTypePdf, IconX } from '@tabler/icons-react'

interface PdfUploadProps {
  onUpload: (file: File) => void
  isProcessing: boolean
  isInitialized?: boolean
}

export function PdfUpload({ onUpload, isProcessing, isInitialized = true }: PdfUploadProps) {
  return (
    <Dropzone
      onDrop={(files) => onUpload(files[0])}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={10 * 1024 ** 2}
      accept={PDF_MIME_TYPE}
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
          <IconFileTypePdf
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {!isInitialized ? 'Initializing OCR Engine...' : 'Drag PDF here or click to select'}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {!isInitialized ? 'Please wait while the engine loads' : 'Attach a PDF file, it should not exceed 10mb'}
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}