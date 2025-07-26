import { MantineProvider, Container, Title, Text, Stack } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/code-highlight/styles.css'
import { OCRInterface } from './ui/OCRInterface'
import { useEffect } from 'react'
import { registerServiceWorker } from './pwa'

function App() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker()
  }, [])

  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications />
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={1} ta="center">Client OCR</Title>
            <Text c="dimmed" ta="center" mt="sm">
              Client-side OCR processing with ONNX Runtime
            </Text>
            <Text c="dimmed" ta="center" size="xs" mt={4}>
              Powered by PaddleOCR v5 Models
            </Text>
          </div>
          <OCRInterface />
        </Stack>
      </Container>
    </MantineProvider>
  )
}

export default App