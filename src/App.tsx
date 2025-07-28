import { MantineProvider, ColorSchemeScript, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/code-highlight/styles.css'
import { OCRApp } from './ui/OCRApp'

// Custom theme with modern design
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  defaultRadius: 'md',
  colors: {
    blue: [
      '#e5f4ff',
      '#cde2ff',
      '#9bc2ff',
      '#64a0ff',
      '#3984fe',
      '#1d72fe',
      '#0969ff',
      '#0058e4',
      '#004ecc',
      '#0043b5'
    ]
  },
  shadows: {
    md: '0 4px 23px 0 rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
})

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-right" />
        <OCRApp />
      </MantineProvider>
    </>
  )
}

export default App