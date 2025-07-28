// Table detection models configuration

export interface TableModelInfo {
  url: string
  sha256?: string
  type: 'ppstructure' | 'slanet' | 'slanetplus' | 'unitable'
  description: string
  size: string
  charList?: string // URL to character list file if separate
}

const RAPIDTABLE_BASE_URL = 'https://www.modelscope.cn/models/RapidAI/RapidTable/resolve/main'

export const TABLE_MODELS: Record<string, TableModelInfo> = {
  'ppstructure_en': {
    url: `${RAPIDTABLE_BASE_URL}/ppstructure_en_infer.onnx`,
    type: 'ppstructure',
    description: 'PP-Structure English Table Model',
    size: '7.4MB'
  },
  'ppstructure_ch': {
    url: `${RAPIDTABLE_BASE_URL}/ppstructure_ch_infer.onnx`,
    type: 'ppstructure',
    description: 'PP-Structure Chinese Table Model',
    size: '7.3MB'
  },
  'slanetplus': {
    url: `${RAPIDTABLE_BASE_URL}/slanetplus_en_ch_infer.onnx`,
    type: 'slanetplus',
    description: 'SLANet-Plus Enhanced Table Model (Default)',
    size: '6.8MB'
  }
}

// Table structure tokens used for decoding
export const TABLE_STRUCTURE_TOKENS = [
  '<thead>', '</thead>',
  '<tbody>', '</tbody>',
  '<tr>', '</tr>',
  '<td>', '</td>',
  '<th>', '</th>',
  '<td colspan=', '</td>',
  '<th colspan=', '</th>',
  '<td rowspan=', '</td>',
  '<th rowspan=', '</th>',
  '>', '<b>', '</b>',
  '<sup>', '</sup>',
  '<sub>', '</sub>',
  '<overline>', '</overline>',
  '<underline>', '</underline>',
  '<i>', '</i>',
  '<strike>', '</strike>'
]

// PP-Structure character list (for older models)
export const PP_STRUCTURE_CHAR_LIST = [
  'b', '<b>', '</b>', 
  '<i>', '</i>',
  '<sup>', '</sup>',
  '<sub>', '</sub>',
  '<overline>', '</overline>',
  '<underline>', '</underline>',
  '<strike>', '</strike>',
  '<thead>', '<tbody>', '<tr>', '<td>', '</td>', '</tr>', '</tbody>', '</thead>',
  ' colspan=', ' rowspan=', '>', '<'
]

export interface TableDetectionConfig {
  model: keyof typeof TABLE_MODELS
  maxLen: number // Max input image size (default: 488)
  thresh: number // Confidence threshold (default: 0.5)
  minAreaThresh: number // Minimum bounding box area (default: 10)
  boxType: 'poly' | 'quad' // Output box type
}

export const DEFAULT_TABLE_CONFIG: TableDetectionConfig = {
  model: 'slanetplus',
  maxLen: 488,
  thresh: 0.5,
  minAreaThresh: 10,
  boxType: 'quad'
}