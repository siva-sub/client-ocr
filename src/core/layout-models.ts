// Document layout analysis models configuration

export interface LayoutModelInfo {
  url: string
  sha256?: string
  type: 'pp' | 'yolov8' | 'doclayout'
  classes: string[]
  description: string
  size: string
  inputSize: number
}

const RAPIDLAYOUT_BASE_URL = 'https://www.modelscope.cn/models/RapidAI/RapidLayout/resolve/main'

export const LAYOUT_MODELS: Record<string, LayoutModelInfo> = {
  // PP Layout Models
  'pp_layout_cdla': {
    url: `${RAPIDLAYOUT_BASE_URL}/pp_layout_cdla_infer.onnx`,
    type: 'pp',
    classes: ['text', 'title', 'figure', 'figure_caption', 'table', 'table_caption', 
              'header', 'footer', 'reference', 'equation'],
    description: 'PP Layout CDLA - Chinese Document Layout Analysis',
    size: '7.0MB',
    inputSize: 800
  },
  'pp_layout_publaynet': {
    url: `${RAPIDLAYOUT_BASE_URL}/pp_layout_publaynet_infer.onnx`,
    type: 'pp',
    classes: ['text', 'title', 'list', 'table', 'figure'],
    description: 'PP Layout PubLayNet - English Document Layout',
    size: '7.0MB',
    inputSize: 800
  },
  'pp_layout_table': {
    url: `${RAPIDLAYOUT_BASE_URL}/pp_layout_table_infer.onnx`,
    type: 'pp',
    classes: ['table'],
    description: 'PP Layout Table - Table-only Detection',
    size: '7.0MB',
    inputSize: 800
  },

  // YOLOv8 Layout Models
  'yolov8n_layout_paper': {
    url: `${RAPIDLAYOUT_BASE_URL}/yolov8n_layout_paper_infer.onnx`,
    type: 'yolov8',
    classes: ['Text', 'Title', 'Header', 'Footer', 'Figure', 'Table', 
              'Toc', 'Caption', 'Equation'],
    description: 'YOLOv8n Layout - Academic Papers',
    size: '6.5MB',
    inputSize: 640
  },
  'yolov8n_layout_report': {
    url: `${RAPIDLAYOUT_BASE_URL}/yolov8n_layout_report_infer.onnx`,
    type: 'yolov8',
    classes: ['Text', 'Title', 'Header', 'Footer', 'Figure', 'Table', 
              'Toc', 'Caption', 'Equation'],
    description: 'YOLOv8n Layout - Financial Reports',
    size: '6.5MB',
    inputSize: 640
  },
  'yolov8n_layout_publaynet': {
    url: `${RAPIDLAYOUT_BASE_URL}/yolov8n_layout_publaynet_infer.onnx`,
    type: 'yolov8',
    classes: ['Text', 'Title', 'List', 'Table', 'Figure'],
    description: 'YOLOv8n Layout - PubLayNet Dataset',
    size: '6.3MB',
    inputSize: 640
  },
  'yolov8n_layout_general6': {
    url: `${RAPIDLAYOUT_BASE_URL}/yolov8n_layout_general6_infer.onnx`,
    type: 'yolov8',
    classes: ['Table', 'Figure', 'Caption', 'Equation', 'Text', 'Title'],
    description: 'YOLOv8n Layout - General 6 Classes',
    size: '6.4MB',
    inputSize: 640
  },

  // DocLayout-YOLO Models (State-of-the-art)
  'doclayout_docstructbench': {
    url: `${RAPIDLAYOUT_BASE_URL}/doclayout_docstructbench_infer.onnx`,
    type: 'doclayout',
    classes: ['title', 'text', 'abandon', 'figure', 'figure_caption', 
              'table', 'table_caption', 'equation', 'header', 'footer'],
    description: 'DocLayout-YOLO DocStructBench - General Purpose',
    size: '5.4MB',
    inputSize: 768
  },
  'doclayout_d4la': {
    url: `${RAPIDLAYOUT_BASE_URL}/doclayout_d4la_infer.onnx`,
    type: 'doclayout',
    classes: ['DocTitle', 'ParaTitle', 'ParaText', 'TableTitle', 'TableText', 
              'TableNote', 'RegionTitle', 'RegionText', 'EquationInline', 
              'EquationIsolated', 'ListText', 'ListTitle', 'OtherText', 
              'Footer', 'Header', 'FooterText', 'HeaderText', 'ImageTitle', 
              'ImageText', 'ImageNote', 'ImageBlock', 'TableBlock', 
              'EquationBlock', 'ListBlock', 'LineGroup', 'Paragraph', 'Footnote'],
    description: 'DocLayout-YOLO D4LA - Comprehensive 27 Classes',
    size: '5.6MB',
    inputSize: 768
  },
  'doclayout_docsynth': {
    url: `${RAPIDLAYOUT_BASE_URL}/doclayout_docsynth_infer.onnx`,
    type: 'doclayout',
    classes: ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 
              'heading5', 'list', 'footnote', 'page-number', 'figure', 'table'],
    description: 'DocLayout-YOLO DocSynth - General Purpose 11 Classes',
    size: '5.4MB',
    inputSize: 768
  }
}

export interface LayoutDetectionConfig {
  model: keyof typeof LAYOUT_MODELS
  confThresh: number // Confidence threshold (default: 0.5)
  iouThresh: number // IoU threshold for NMS (default: 0.5)
  gpuEnabled?: boolean
  gpuId?: number
}

export const DEFAULT_LAYOUT_CONFIG: LayoutDetectionConfig = {
  model: 'doclayout_docstructbench',
  confThresh: 0.5,
  iouThresh: 0.5,
  gpuEnabled: false
}

export interface LayoutDetectionResult {
  boxes: number[][] // [[x1, y1, x2, y2], ...]
  classNames: string[]
  scores: number[]
  elapse: number
}