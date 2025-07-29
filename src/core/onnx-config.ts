// ONNX Runtime Web configuration
import * as ort from 'onnxruntime-web'

// Configure ONNX Runtime Web paths for both development and production
export function configureONNXRuntime() {
  // Always use GitHub Pages URL for consistency
  ort.env.wasm.wasmPaths = 'https://siva-sub.github.io/client-ocr/'
  
  // WebGL is enabled by default when available
  
  // Set number of threads for WASM backend
  ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4
  
  // Enable SIMD if available
  ort.env.wasm.simd = true
}

// Call this function once at app startup
configureONNXRuntime()