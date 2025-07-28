import { Select, Badge } from '@mantine/core'
import type { SelectProps } from '@mantine/core'
import { RapidOCREngine } from '../core/rapid-ocr-engine'
import type { LangType } from '../core/ocr-config'
import { useMediaQuery } from '@mantine/hooks'

interface LanguageSelectorProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value: LangType
  onChange: (value: LangType) => void
  supportedLanguages?: LangType[]
}

export function LanguageSelector({ 
  value, 
  onChange, 
  supportedLanguages,
  ...props 
}: LanguageSelectorProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Get available languages
  const allLanguages = RapidOCREngine.getAvailableLanguages()
  
  // Filter to supported languages if provided
  const languages = supportedLanguages 
    ? allLanguages.filter(lang => supportedLanguages.includes(lang.code))
    : allLanguages
  
  // Get popular languages
  const popularLanguages = ['en', 'ch', 'ja', 'ko', 'es', 'fr', 'de', 'ta']
  const isPopular = (code: string) => popularLanguages.includes(code)
  
  // Group languages by script type
  const groupedLanguages = [
    {
      group: 'Popular',
      items: languages.filter(lang => isPopular(lang.code))
    },
    {
      group: 'Latin Scripts',
      items: languages.filter(lang => ['en', 'latin', 'fr', 'de', 'es', 'it', 'pt'].includes(lang.code) && !isPopular(lang.code))
    },
    {
      group: 'East Asian',
      items: languages.filter(lang => ['ch', 'chinese_cht', 'ja', 'ko'].includes(lang.code) && !isPopular(lang.code))
    },
    {
      group: 'South Asian',
      items: languages.filter(lang => ['devanagari', 'ta', 'te', 'ka'].includes(lang.code) && !isPopular(lang.code))
    },
    {
      group: 'Middle Eastern',
      items: languages.filter(lang => ['arabic', 'fa'].includes(lang.code) && !isPopular(lang.code))
    },
    {
      group: 'Cyrillic',
      items: languages.filter(lang => ['cyrillic', 'eslav', 'ru'].includes(lang.code) && !isPopular(lang.code))
    },
    {
      group: 'Others',
      items: languages.filter(lang => ['id', 'vi'].includes(lang.code) && !isPopular(lang.code))
    }
  ].filter(group => group.items.length > 0)
  
  const data = groupedLanguages.map(group => ({
    group: group.group,
    items: group.items.map(lang => ({
      value: lang.code,
      label: lang.name,
      // Add visual indicators for special languages
      rightSection: lang.code === 'ta' ? (
        <Badge size="xs" variant="light">Tamil</Badge>
      ) : lang.code === 'en' ? (
        <Badge size="xs" variant="light" color="green">Default</Badge>
      ) : undefined
    }))
  }))
  
  return (
    <Select
      label={isMobile ? "Language" : "OCR Language"}
      description={isMobile ? undefined : "Select OCR language for better accuracy"}
      placeholder="Choose language"
      value={value}
      onChange={(val) => val && onChange(val as LangType)}
      data={data}
      searchable
      size={isMobile ? "sm" : "md"}
      comboboxProps={{ 
        transitionProps: { transition: 'scale-y', duration: 200 },
        dropdownPadding: isMobile ? 5 : 10
      }}
      {...props}
    />
  )
}