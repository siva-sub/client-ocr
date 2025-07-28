import { useState, useRef } from 'react'
import { 
  Card, Stack, Text, Button, Box, Group, Badge, Transition,
  useMantineTheme, Progress, SimpleGrid
} from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import type { FileWithPath } from '@mantine/dropzone'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { 
  IconUpload, IconPhoto, IconFileTypePdf, IconSparkles,
  IconCamera, IconLink, IconFileText, IconFileZip
} from '@tabler/icons-react'

interface EnhancedDropzoneProps {
  onDrop: (files: File[]) => void
  isProcessing: boolean
  accept?: string[]
  maxSize?: number
  multiple?: boolean
}

const FILE_ICONS: Record<string, any> = {
  'image': IconPhoto,
  'pdf': IconFileTypePdf,
  'text': IconFileText,
  'zip': IconFileZip,
  'default': IconFileText
}

export function EnhancedDropzone({ 
  onDrop, 
  isProcessing,
  accept = [
    'image/*',
    'application/pdf',
    MIME_TYPES.png,
    MIME_TYPES.jpeg,
    MIME_TYPES.webp,
    MIME_TYPES.gif,
    'image/bmp',
    'image/tiff'
  ],
  maxSize = 50 * 1024 ** 2, // 50MB
  multiple = false
}: EnhancedDropzoneProps) {
  const theme = useMantineTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const urlInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          onDrop(acceptedFiles)
          setFiles([])
          setUploadProgress(0)
        }
      }, 100)
    }
  }

  const handleUrlSubmit = async () => {
    const url = urlInputRef.current?.value
    if (!url) return

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], url.split('/').pop() || 'image', { type: blob.type })
      handleDrop([file])
      if (urlInputRef.current) urlInputRef.current.value = ''
    } catch (error) {
      notifications.show({
        title: 'Failed to load URL',
        message: 'Please check the URL and try again',
        color: 'red'
      })
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return FILE_ICONS.image
    if (file.type === 'application/pdf') return FILE_ICONS.pdf
    if (file.type.startsWith('text/')) return FILE_ICONS.text
    return FILE_ICONS.default
  }

  return (
    <Stack gap="md">
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => {
          const file = files[0]
          let message = 'Invalid file'
          
          if (file.errors[0]?.code === 'file-too-large') {
            message = `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
          } else if (file.errors[0]?.code === 'file-invalid-type') {
            message = 'File type not supported'
          }
          
          notifications.show({
            title: 'Upload failed',
            message,
            color: 'red'
          })
        }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        maxSize={maxSize}
        accept={accept}
        loading={isProcessing}
        multiple={multiple}
      >
        <Card 
          p={isMobile ? "md" : "xl"} 
          radius="md" 
          withBorder
          style={{
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: isDragging ? theme.colors.blue[6] : theme.colors.gray[3],
            backgroundColor: isDragging ? theme.colors.blue[0] : 'transparent',
            transition: 'all 0.3s ease',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress
              value={uploadProgress}
              size="xs"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0
              }}
            />
          )}

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
                Drop files here or click to select
              </Text>
              <Text size="sm" c="dimmed" ta="center" mt={7}>
                Images, PDFs, or paste an image URL
              </Text>
            </div>
            
            <SimpleGrid cols={isMobile ? 1 : 3} spacing="xs" w="100%">
              <Button 
                variant="light" 
                size={isMobile ? "xs" : "sm"}
                leftSection={<IconUpload size={16} />}
                disabled={isProcessing}
                fullWidth
              >
                Choose files
              </Button>
              
              <Button 
                variant="subtle" 
                size={isMobile ? "xs" : "sm"}
                leftSection={<IconCamera size={16} />}
                disabled={isProcessing}
                fullWidth
                onClick={(e) => {
                  e.stopPropagation()
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.capture = 'environment'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleDrop([file])
                  }
                  input.click()
                }}
              >
                Camera
              </Button>
              
              <Button 
                variant="subtle" 
                size={isMobile ? "xs" : "sm"}
                leftSection={<IconLink size={16} />}
                disabled={isProcessing}
                fullWidth
                onClick={(e) => {
                  e.stopPropagation()
                  const url = prompt('Enter image URL:')
                  if (url) {
                    urlInputRef.current = { value: url } as HTMLInputElement
                    handleUrlSubmit()
                  }
                }}
              >
                From URL
              </Button>
            </SimpleGrid>
            
            <Group gap="xs" mt="xs">
              <Badge variant="light" size="sm">
                JPG, PNG, WebP, GIF, BMP, TIFF
              </Badge>
              <Badge variant="light" size="sm" color="orange">
                PDF
              </Badge>
              <Badge variant="light" size="sm" color="gray">
                Max {maxSize / 1024 / 1024}MB
              </Badge>
            </Group>
          </Stack>

          {files.length > 0 && (
            <Transition mounted={true} transition="slide-up" duration={400}>
              {(styles) => (
                <Box style={styles} mt="md">
                  <Stack gap="xs">
                    {files.map((file, index) => {
                      const Icon = getFileIcon(file)
                      return (
                        <Group key={index} gap="xs">
                          <Icon size={16} />
                          <Text size="sm" truncate style={{ flex: 1 }}>
                            {file.name}
                          </Text>
                          <Badge size="xs" variant="light">
                            {(file.size / 1024).toFixed(1)}KB
                          </Badge>
                        </Group>
                      )
                    })}
                  </Stack>
                </Box>
              )}
            </Transition>
          )}
        </Card>
      </Dropzone>
    </Stack>
  )
}