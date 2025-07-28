import { useState, useEffect } from 'react'
import { Paper, Group, Text, Button, CloseButton, Transition, Stack, Flex } from '@mantine/core'
import { IconDownload, IconDeviceMobile, IconRocket } from '@tabler/icons-react'
import { getPWAInstallPrompt, clearPWAInstallPrompt } from '../pwa'
import { useMediaQuery } from '@mantine/hooks'

export function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

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

    // Also check if already installed
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      setShowPrompt(false)
    }

    return () => clearInterval(interval)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      // Track installation
      if ('gtag' in window) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'installed'
        })
      }
    }

    clearPWAInstallPrompt()
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't clear the prompt, so we can show it again later
  }

  if (isMobile) {
    return (
      <Transition mounted={showPrompt} transition="slide-up" duration={400}>
        {(styles) => (
          <Paper
            style={{
              ...styles,
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: '16px 16px 0 0'
            }}
            p="md"
            shadow="xl"
            bg="blue.0"
          >
            <Stack gap="sm">
              <Flex justify="space-between" align="flex-start">
                <IconDeviceMobile size={32} color="var(--mantine-color-blue-6)" />
                <CloseButton onClick={handleDismiss} />
              </Flex>
              
              <div>
                <Text fw={600} size="lg">Install Client OCR</Text>
                <Text size="sm" c="dimmed" mt={4}>
                  Add to your home screen for instant access, offline support, and a native app experience
                </Text>
              </div>
              
              <Group gap="xs" mt="xs">
                <Button
                  variant="filled"
                  size="md"
                  leftSection={<IconDownload size={18} />}
                  onClick={handleInstall}
                  fullWidth
                >
                  Install App
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}
      </Transition>
    )
  }

  return (
    <Transition mounted={showPrompt} transition="slide-down" duration={400}>
      {(styles) => (
        <Paper
          style={styles}
          p="lg"
          withBorder
          shadow="md"
          radius="md"
          bg="blue.0"
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md">
              <IconRocket size={28} color="var(--mantine-color-blue-6)" />
              <div>
                <Text fw={600} size="lg">Install Client OCR</Text>
                <Text size="sm" c="dimmed">
                  Install the app for offline access, faster loading, and native features
                </Text>
              </div>
            </Group>
            <Group gap="xs">
              <Button
                variant="light"
                size="sm"
                onClick={handleDismiss}
              >
                Later
              </Button>
              <Button
                variant="filled"
                size="sm"
                leftSection={<IconDownload size={16} />}
                onClick={handleInstall}
              >
                Install Now
              </Button>
            </Group>
          </Group>
        </Paper>
      )}
    </Transition>
  )
}