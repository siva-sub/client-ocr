export type EngineType = 'onnxruntime'
export type LangType = 'ch' | 'en' | 'ja' | 'ko' | 'arabic' | 'chinese_cht' | 'cyrillic' | 'devanagari' | 'latin' | 'ta' | 'te' | 'eslav' | 'ka'
export type ModelType = 'mobile' | 'server'
export type OCRVersion = 'PP-OCRv4' | 'PP-OCRv5'

export interface DetConfig {
  engine_type: EngineType
  lang_type: LangType
  model_type: ModelType
  ocr_version: OCRVersion
  limit_side_len: number
  limit_type: 'min' | 'max'
  std: [number, number, number]
  mean: [number, number, number]
  scale?: number
  thresh: number
  box_thresh: number
  max_candidates: number
  unclip_ratio: number
  use_dilation: boolean
  score_mode: 'fast' | 'accurate'
  padding_vertical?: number
  padding_horizontal?: number
  minimum_area_threshold?: number
}

export interface ClsConfig {
  engine_type: EngineType
  lang_type: LangType
  model_type: ModelType
  ocr_version: OCRVersion
  cls_image_shape: [number, number, number]
  cls_batch_num: number
  cls_thresh: number
  label_list: string[]
}

export interface RecConfig {
  engine_type: EngineType
  lang_type: LangType
  model_type: ModelType
  ocr_version: OCRVersion
  rec_img_shape: [number, number, number]
  rec_batch_num: number
  rec_keys_path?: string
}

export interface OCRConfig {
  global: {
    text_score: number
    use_det: boolean
    use_cls: boolean
    use_rec: boolean
    min_height: number
    width_height_ratio: number
    max_side_len: number
    min_side_len: number
    return_word_box: boolean
    return_single_char_box: boolean
  }
  det: DetConfig
  cls: ClsConfig
  rec: RecConfig
}

// Default configuration matching RapidOCR
export const DEFAULT_OCR_CONFIG: OCRConfig = {
  global: {
    text_score: 0.5,
    use_det: true,
    use_cls: true,
    use_rec: true,
    min_height: 30,
    width_height_ratio: 8,
    max_side_len: 2000,
    min_side_len: 30,
    return_word_box: false,
    return_single_char_box: false
  },
  det: {
    engine_type: 'onnxruntime',
    lang_type: 'en',
    model_type: 'mobile',
    ocr_version: 'PP-OCRv4',
    limit_side_len: 736,
    limit_type: 'min',
    std: [0.5, 0.5, 0.5], // RapidOCR normalization
    mean: [0.5, 0.5, 0.5], // RapidOCR normalization  
    scale: 1.0 / 255.0, // 1/255
    thresh: 0.3,
    box_thresh: 0.5,
    max_candidates: 1000,
    unclip_ratio: 1.6,
    use_dilation: true,
    score_mode: 'fast',
    padding_vertical: 0.4,
    padding_horizontal: 0.6,
    minimum_area_threshold: 20
  },
  cls: {
    engine_type: 'onnxruntime',
    lang_type: 'en',
    model_type: 'mobile',
    ocr_version: 'PP-OCRv4',
    cls_image_shape: [3, 48, 192],
    cls_batch_num: 6,
    cls_thresh: 0.9,
    label_list: ['0', '180']
  },
  rec: {
    engine_type: 'onnxruntime',
    lang_type: 'en',
    model_type: 'mobile',
    ocr_version: 'PP-OCRv4',
    rec_img_shape: [3, 48, 320],
    rec_batch_num: 6
  }
}

// Language-specific configurations
export const LANGUAGE_CONFIGS: Record<LangType, { det?: Partial<DetConfig>, cls?: Partial<ClsConfig>, rec?: Partial<RecConfig> }> = {
  'ch': {
    det: { lang_type: 'ch' } as Partial<DetConfig>,
    cls: { lang_type: 'ch' } as Partial<ClsConfig>,
    rec: { lang_type: 'ch' } as Partial<RecConfig>
  },
  'en': {
    det: { lang_type: 'en' } as Partial<DetConfig>,
    cls: { lang_type: 'en' } as Partial<ClsConfig>,
    rec: { lang_type: 'en' } as Partial<RecConfig>
  },
  'ja': {
    det: { lang_type: 'ja' } as Partial<DetConfig>,
    cls: { lang_type: 'ja' } as Partial<ClsConfig>,
    rec: { lang_type: 'ja' } as Partial<RecConfig>
  },
  'ko': {
    det: { lang_type: 'ko' } as Partial<DetConfig>,
    cls: { lang_type: 'ko' } as Partial<ClsConfig>,
    rec: { lang_type: 'ko' } as Partial<RecConfig>
  },
  'arabic': {
    det: { lang_type: 'arabic' } as Partial<DetConfig>,
    cls: { lang_type: 'arabic' } as Partial<ClsConfig>,
    rec: { lang_type: 'arabic' } as Partial<RecConfig>
  },
  'chinese_cht': {
    det: { lang_type: 'chinese_cht' } as Partial<DetConfig>,
    cls: { lang_type: 'chinese_cht' } as Partial<ClsConfig>,
    rec: { lang_type: 'chinese_cht' } as Partial<RecConfig>
  },
  'cyrillic': {
    det: { lang_type: 'cyrillic' } as Partial<DetConfig>,
    cls: { lang_type: 'cyrillic' } as Partial<ClsConfig>,
    rec: { lang_type: 'cyrillic' } as Partial<RecConfig>
  },
  'devanagari': {
    det: { lang_type: 'devanagari' } as Partial<DetConfig>,
    cls: { lang_type: 'devanagari' } as Partial<ClsConfig>,
    rec: { lang_type: 'devanagari' } as Partial<RecConfig>
  },
  'latin': {
    det: { lang_type: 'latin' } as Partial<DetConfig>,
    cls: { lang_type: 'latin' } as Partial<ClsConfig>,
    rec: { lang_type: 'latin' } as Partial<RecConfig>
  },
  'ta': {
    det: { lang_type: 'ta' } as Partial<DetConfig>,
    cls: { lang_type: 'ta' } as Partial<ClsConfig>,
    rec: { lang_type: 'ta' } as Partial<RecConfig>
  },
  'te': {
    det: { lang_type: 'te' } as Partial<DetConfig>,
    cls: { lang_type: 'te' } as Partial<ClsConfig>,
    rec: { lang_type: 'te' } as Partial<RecConfig>
  },
  'eslav': {
    det: { lang_type: 'eslav' } as Partial<DetConfig>,
    cls: { lang_type: 'eslav' } as Partial<ClsConfig>,
    rec: { lang_type: 'eslav' } as Partial<RecConfig>
  },
  'ka': {
    det: { lang_type: 'ka' } as Partial<DetConfig>,
    cls: { lang_type: 'ka' } as Partial<ClsConfig>,
    rec: { lang_type: 'ka' } as Partial<RecConfig>
  }
}

// Merge configurations
export function mergeConfigs(base: OCRConfig, override: { det?: Partial<DetConfig>, cls?: Partial<ClsConfig>, rec?: Partial<RecConfig> }): OCRConfig {
  return {
    global: base.global,
    det: { ...base.det, ...(override.det || {}) } as DetConfig,
    cls: { ...base.cls, ...(override.cls || {}) } as ClsConfig,
    rec: { ...base.rec, ...(override.rec || {}) } as RecConfig
  }
}

// Get configuration for a specific language
export function getLanguageConfig(lang: LangType): OCRConfig {
  const languageOverride = LANGUAGE_CONFIGS[lang] || {}
  return mergeConfigs(DEFAULT_OCR_CONFIG, languageOverride)
}