import { Stack, Paper, Text, Group, Badge, Accordion, Code, ScrollArea } from '@mantine/core'
import { IconFileText, IconClock, IconTextRecognition } from '@tabler/icons-react'

interface PdfResult {
  pages: Array<{
    page: number
    text: string
    regions: Array<{
      text: string
      confidence: number
      box: number[]
    }>
  }>
  totalPages: number
  processingTime: number
  totalRegions: number
}

interface PdfResultViewerProps {
  result: PdfResult
}

export function PdfResultViewer({ result }: PdfResultViewerProps) {
  return (
    <Stack gap="md">
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <IconFileText size={20} />
            <Text fw={600}>PDF Processing Results</Text>
          </Group>
          <Group gap="xs">
            <Badge variant="light" leftSection={<IconFileText size={14} />}>
              {result.totalPages} pages
            </Badge>
            <Badge variant="light" color="blue" leftSection={<IconTextRecognition size={14} />}>
              {result.totalRegions} regions
            </Badge>
            <Badge variant="light" color="green" leftSection={<IconClock size={14} />}>
              {(result.processingTime / 1000).toFixed(2)}s
            </Badge>
          </Group>
        </Group>

        <Accordion defaultValue="page-1">
          {result.pages.map((page) => (
            <Accordion.Item key={page.page} value={`page-${page.page}`}>
              <Accordion.Control>
                <Group justify="space-between">
                  <Text>Page {page.page}</Text>
                  <Badge size="sm" variant="dot">
                    {page.regions.length} regions
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <ScrollArea h={300}>
                  <Code block style={{ whiteSpace: 'pre-wrap' }}>
                    {page.text || 'No text detected on this page'}
                  </Code>
                </ScrollArea>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>
    </Stack>
  )
}