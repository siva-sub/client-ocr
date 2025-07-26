import { useState, useEffect } from 'react'
import { Paper, Group, Text, Button, CloseButton, Transition } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import { getPWAInstallPrompt, clearPWAInstallPrompt } from '../pwa'

export function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const checkInstallPrompt = () => {
      const prompt = getPWAInstallPrompt()
      if (prompt) {
        setDeferredPrompt(prompt)
        setShowPrompt(true)
      }
    }

    // Check immediately
    checkInstallPrompt()

    // Check periodically
    const interval = setInterval(checkInstallPrompt, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    clearPWAInstallPrompt()
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't clear the prompt, so we can show it again later
  }

  return (
    <Transition mounted={showPrompt} transition="slide-down" duration={400}>
      {(styles) => (
        <Paper
          style={styles}
          p="md"
          withBorder
          shadow="sm"
          radius="md"
          bg="blue.0"
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md">
              <IconDownload size={24} color="var(--mantine-color-blue-6)" />
              <div>
                <Text fw={500}>Install Client OCR</Text>
                <Text size="sm" c="dimmed">
                  Install the app for offline access and better performance
                </Text>
              </div>
            </Group>
            <Group gap="xs">
              <Button
                variant="filled"
                size="sm"
                leftSection={<IconDownload size={16} />}
                onClick={handleInstall}
              >
                Install
              </Button>
              <CloseButton onClick={handleDismiss} />
            </Group>
          </Group>
        </Paper>
      )}
    </Transition>
  )
}