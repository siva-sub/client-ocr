import type { LangType, OCRVersion, ModelType } from './ocr-config'

export interface ModelInfo {
  url: string
  sha256?: string
  dictUrl?: string
  isMetaOnnx?: boolean
}

export interface LanguageModel {
  name: string
  code: LangType
  models: {
    det: {
      [key in OCRVersion]?: {
        [key in ModelType]?: string | ModelInfo
      }
    }
    rec: {
      [key in OCRVersion]?: {
        [key in ModelType]?: string | ModelInfo
      }
    }
    cls: {
      [key in OCRVersion]?: {
        [key in ModelType]?: string | ModelInfo
      }
    }
    dict?: {
      [key in OCRVersion]?: string
    }
  }
  fonts?: string[]
  direction?: 'rtl' | 'ltr'
}

const RAPIDOCR_BASE_URL = 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/onnx'

export const LANGUAGE_MODELS: Record<LangType, LanguageModel> = {
  'ch': {
    name: '中文',
    code: 'ch',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/ch_PP-OCRv4_det_infer.onnx`,
            sha256: 'd2a7720d45a54257208b1e13e36a8479894cb74155a5efe29462512d42f49da9'
          },
          'server': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/ch_PP-OCRv4_det_server_infer.onnx`,
            sha256: 'cfa39a3f298f6d3fc71789834d15da36d11a6c59b489fc16ea4733728012f786'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/det/ch_PP-OCRv5_mobile_det.onnx`,
            sha256: '4d97c44a20d30a81aad087d6a396b08f786c4635742afc391f6621f5c6ae78ae'
          },
          'server': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/det/ch_PP-OCRv5_server_det.onnx`,
            sha256: '0f8846b1d4bba223a2a2f9d9b44022fbc22cc019051a602b41a7fda9667e4cad'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/ch_PP-OCRv4_rec_infer.onnx`,
            sha256: '48fc40f24f6d2a207a2b1091d3437eb3cc3eb6b676dc3ef9c37384005483683b',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/ch_PP-OCRv4_rec_infer/ppocr_keys_v1.txt'
          },
          'server': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/ch_PP-OCRv4_rec_server_infer.onnx`,
            sha256: '6a2676219be9907c7fc9cf61ebaa843bf2898777def567925b78886fcd90c07a',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/ch_PP-OCRv4_rec_infer/ppocr_keys_v1.txt'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/rec/ch_PP-OCRv5_rec_mobile_infer.onnx`,
            sha256: '5825fc7ebf84ae7a412be049820b4d86d77620f204a041697b0494669b1742c5',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv5/rec/ch_PP-OCRv5_rec_mobile_infer/ppocrv5_dict.txt'
          },
          'server': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/rec/ch_PP-OCRv5_rec_server_infer.onnx`,
            sha256: 'e09385400eaaaef34ceff54aeb7c4f0f1fe014c27fa8b9905d4709b65746562a',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv5/rec/ch_PP-OCRv5_rec_server_infer/ppocrv5_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'ppocr_keys_v1.txt',
        'PP-OCRv5': 'ppocrv5_dict.txt'
      }
    },
    fonts: ['FZYTK.TTF']
  },
  'en': {
    name: 'English',
    code: 'en',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/en_PP-OCRv3_det_infer.onnx`,
            sha256: 'ea07c15d38ac40cd69da3c493444ec75b44ff23840553ff8ba102c1219ed39c2'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/en_PP-OCRv3_det_infer.onnx`,
            sha256: 'ea07c15d38ac40cd69da3c493444ec75b44ff23840553ff8ba102c1219ed39c2'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/en_PP-OCRv4_rec_infer.onnx`,
            sha256: 'e8770c967605983d1570cdf5352041dfb68fa0c21664f49f47b155abd3e0e318',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/en_PP-OCRv4_rec_infer/en_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'en_dict.txt'
      }
    }
  },
  'ja': {
    name: '日本語',
    code: 'ja',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/japan_PP-OCRv4_rec_infer.onnx`,
            sha256: 'e1075a67dba758ecfc7ebc78a10ae61c95ac8fb66a9c86fab5541e33f085cb7a',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/japan_PP-OCRv4_rec_infer/japan_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'japan_dict.txt'
      }
    },
    fonts: ['japan.ttc']
  },
  'ko': {
    name: '한국어',
    code: 'ko',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/korean_PP-OCRv4_rec_infer.onnx`,
            sha256: 'ab151ba9065eccd98f884cf4d927db091be86137276392072edd4f9d43ad7426',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/korean_PP-OCRv4_rec_infer/korean_dict.txt'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/rec/korean_PP-OCRv5_rec_mobile_infer.onnx`,
            sha256: 'cd6e2ea50f6943ca7271eb8c56a877a5a90720b7047fe9c41a2e541a25773c9b',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv5/rec/korean_PP-OCRv5_rec_mobile_infer/ppocrv5_korean_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'korean_dict.txt',
        'PP-OCRv5': 'ppocrv5_korean_dict.txt'
      }
    },
    fonts: ['korean.ttf']
  },
  'arabic': {
    name: 'العربية',
    code: 'arabic',
    direction: 'rtl',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/arabic_PP-OCRv4_rec_infer.onnx`,
            sha256: '4a9011bef71687bb84288dc86ad2471bd5d37b717ddf672dd156f9e7a5601bac',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/arabic_PP-OCRv4_rec_infer/arabic_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'arabic_dict.txt'
      }
    },
    fonts: ['arabic.ttf']
  },
  'chinese_cht': {
    name: '繁體中文',
    code: 'chinese_cht',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/ch_PP-OCRv4_det_infer.onnx`,
            sha256: 'd2a7720d45a54257208b1e13e36a8479894cb74155a5efe29462512d42f49da9'
          },
          'server': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/ch_PP-OCRv4_det_server_infer.onnx`,
            sha256: 'cfa39a3f298f6d3fc71789834d15da36d11a6c59b489fc16ea4733728012f786'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/chinese_cht_PP-OCRv3_rec_infer.onnx`,
            sha256: '779656d044ce388045e02ea9244724616194e63928606436cdfc6dc3c9528cc6',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/chinese_cht_PP-OCRv3_rec_infer/chinese_cht_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'chinese_cht_dict.txt'
      }
    },
    fonts: ['chinese_cht.ttf']
  },
  'cyrillic': {
    name: 'Кириллица',
    code: 'cyrillic',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer.onnx`,
            sha256: '1efb65bdc460af1c0e8733d005b20952b17ca5aac10ddb56c968333791c5eaa3',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer/cyrillic_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'cyrillic_dict.txt'
      }
    },
    fonts: ['cyrillic.ttf']
  },
  'devanagari': {
    name: 'देवनागरी',
    code: 'devanagari',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/devanagari_PP-OCRv4_rec_infer.onnx`,
            sha256: 'a62b6148303187907aa0b0d3a0125bdc62557d07966468cab9056949e36035e8',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/devanagari_PP-OCRv4_rec_infer/devanagari_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'devanagari_dict.txt'
      }
    },
    fonts: ['devanagari_Martel-Regular.ttf']
  },
  'latin': {
    name: 'Latin',
    code: 'latin',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/latin_PP-OCRv3_rec_infer.onnx`,
            sha256: 'e9d7a33667e8aaa702862975186adf2012e3f390cc0f9422865957125f8071cf',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/latin_PP-OCRv3_rec_infer/latin_dict.txt'
          }
        },
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/rec/latin_PP-OCRv5_rec_mobile_infer.onnx`,
            sha256: 'b20bd37c168a570f583afbc8cd7925603890efbcdc000a59e22c269d160b5f5a',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv5/rec/latin_PP-OCRv5_rec_mobile_infer/ppocrv5_latin_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'latin_dict.txt',
        'PP-OCRv5': 'ppocrv5_latin_dict.txt'
      }
    },
    fonts: ['latin.ttf']
  },
  'ta': {
    name: 'தமிழ்',
    code: 'ta',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/ta_PP-OCRv4_rec_infer.onnx`,
            sha256: 'f78d752148873c5fa6e4294002bfd162dbba54236e406a39665ebbda766161b5',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/ta_PP-OCRv4_rec_infer/ta_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'ta_dict.txt'
      }
    },
    fonts: ['tamil.ttf']
  },
  'te': {
    name: 'తెలుగు',
    code: 'te',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/te_PP-OCRv4_rec_infer.onnx`,
            sha256: 'e608c3be00c8a9ea2f5c667d90f379403e2568bd5c8183308a49ca093def8eff',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/te_PP-OCRv4_rec_infer/te_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'te_dict.txt'
      }
    },
    fonts: ['telugu.ttf']
  },
  'ka': {
    name: 'ಕನ್ನಡ',
    code: 'ka',
    models: {
      det: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/rec/ka_PP-OCRv4_rec_infer.onnx`,
            sha256: '9c1e186ea1d13cf6c853e57b42d382c3961fdd6acc2409e0d0dc44defc9f152b',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv4/rec/kannada_PP-OCRv4_rec_infer/ka_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv4': 'ka_dict.txt'
      }
    },
    fonts: ['kannada.ttf']
  },
  'eslav': {
    name: 'Eastern Slavic',
    code: 'eslav',
    models: {
      det: {
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/det/Multilingual_PP-OCRv3_det_infer.onnx`,
            sha256: '5475c6c7f4d84a6c4f32241b487435d59f126a40c023387af99732258844cdc3'
          }
        }
      },
      rec: {
        'PP-OCRv5': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv5/rec/eslav_PP-OCRv5_rec_mobile_infer.onnx`,
            sha256: '08705d6721849b1347d26187f15a5e362c431963a2a62bfff4feac578c489aab',
            dictUrl: 'https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.3.0/paddle/PP-OCRv5/rec/eslav_PP-OCRv5_rec_mobile_infer/ppocrv5_eslav_dict.txt'
          }
        }
      },
      cls: {
        'PP-OCRv4': {
          'mobile': {
            url: `${RAPIDOCR_BASE_URL}/PP-OCRv4/cls/ch_ppocr_mobile_v2.0_cls_infer.onnx`,
            sha256: 'e47acedf663230f8863ff1ab0e64dd2d82b838fceb5957146dab185a89d6215c'
          }
        }
      },
      dict: {
        'PP-OCRv5': 'ppocrv5_eslav_dict.txt'
      }
    },
    fonts: ['cyrillic.ttf']
  }
}

// Get model paths for a specific language and configuration
export function getLanguageModelPaths(
  lang: LangType, 
  version: OCRVersion = 'PP-OCRv4', 
  modelType: ModelType = 'mobile'
): {
  det?: string | ModelInfo
  rec?: string | ModelInfo
  cls?: string | ModelInfo
  dict?: string
} {
  const langModel = LANGUAGE_MODELS[lang]
  if (!langModel) {
    throw new Error(`Language ${lang} not supported`)
  }
  
  return {
    det: langModel.models.det[version]?.[modelType],
    rec: langModel.models.rec[version]?.[modelType],
    cls: langModel.models.cls[version]?.[modelType],
    dict: langModel.models.dict?.[version]
  }
}

// Get supported languages for a specific OCR version
export function getSupportedLanguages(version: OCRVersion): LangType[] {
  return Object.entries(LANGUAGE_MODELS)
    .filter(([_, model]) => {
      return model.models.rec[version] !== undefined
    })
    .map(([lang]) => lang as LangType)
}

// Extract model info from string or ModelInfo
export function extractModelInfo(model: string | ModelInfo): ModelInfo {
  if (typeof model === 'string') {
    // Legacy format - just filename
    return {
      url: `/models/${model}`,
      sha256: undefined,
      dictUrl: undefined,
      isMetaOnnx: model.includes('.meta.onnx')
    }
  }
  return model
}