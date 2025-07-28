import cv from "@techstark/opencv-js"

export interface PreprocessingOptions {
  grayscale?: boolean
  threshold?: boolean
  thresholdValue?: number
  denoise?: boolean
  denoiseStrength?: number
  contrast?: boolean
  contrastAlpha?: number
  contrastBeta?: number
  sharpen?: boolean
  deskew?: boolean
  removeBackground?: boolean
  scale?: number
}

export class ImagePreprocessor {
  private static isOpenCVReady(): boolean {
    return typeof cv !== 'undefined' && cv && cv.Mat && typeof cv.matFromImageData === 'function'
  }

  static async preprocess(
    imageData: ImageData,
    options: PreprocessingOptions = {}
  ): Promise<ImageData> {
    // If OpenCV is not ready, return original image
    if (!this.isOpenCVReady()) {
      console.warn('OpenCV.js is not loaded. Skipping preprocessing.')
      return imageData
    }
    const {
      grayscale = true,
      threshold = false,
      thresholdValue = 127,
      denoise = false,
      denoiseStrength = 10,
      contrast = false,
      contrastAlpha = 1.5,
      contrastBeta = 0,
      sharpen = false,
      deskew = false,
      removeBackground = false,
      scale = 1
    } = options

    // Convert ImageData to cv.Mat
    const src = cv.matFromImageData(imageData)
    let processed = src.clone()

    try {
      // Scale if needed
      if (scale !== 1) {
        const scaled = new cv.Mat()
        const newSize = new cv.Size(Math.round(src.cols * scale), Math.round(src.rows * scale))
        cv.resize(processed, scaled, newSize, 0, 0, cv.INTER_LINEAR)
        processed.delete()
        processed = scaled
      }

      // Convert to grayscale if needed
      if (grayscale && processed.channels() > 1) {
        const gray = new cv.Mat()
        cv.cvtColor(processed, gray, cv.COLOR_RGBA2GRAY)
        processed.delete()
        processed = gray
      }

      // Denoise - using simple blur as fastNlMeans is not available in opencv.js
      if (denoise) {
        const denoised = new cv.Mat()
        const ksize = new cv.Size(denoiseStrength, denoiseStrength)
        cv.GaussianBlur(processed, denoised, ksize, 0)
        processed.delete()
        processed = denoised
      }

      // Adjust contrast
      if (contrast) {
        const contrasted = new cv.Mat()
        processed.convertTo(contrasted, -1, contrastAlpha, contrastBeta)
        processed.delete()
        processed = contrasted
      }

      // Sharpen
      if (sharpen) {
        const sharpened = this.applySharpen(processed)
        processed.delete()
        processed = sharpened
      }

      // Remove background (simple method)
      if (removeBackground) {
        const bgRemoved = this.removeSimpleBackground(processed)
        processed.delete()
        processed = bgRemoved
      }

      // Deskew
      if (deskew) {
        const deskewed = this.deskewImage(processed)
        processed.delete()
        processed = deskewed
      }

      // Apply threshold
      if (threshold && processed.channels() === 1) {
        const thresholded = new cv.Mat()
        cv.threshold(processed, thresholded, thresholdValue, 255, cv.THRESH_BINARY)
        processed.delete()
        processed = thresholded
      }

      // Convert back to RGBA for ImageData
      let finalMat = processed
      if (processed.channels() === 1) {
        finalMat = new cv.Mat()
        cv.cvtColor(processed, finalMat, cv.COLOR_GRAY2RGBA)
        processed.delete()
      } else if (processed.channels() === 3) {
        finalMat = new cv.Mat()
        cv.cvtColor(processed, finalMat, cv.COLOR_RGB2RGBA)
        processed.delete()
      }

      // Convert to ImageData
      const result = new ImageData(
        new Uint8ClampedArray(finalMat.data),
        finalMat.cols,
        finalMat.rows
      )

      finalMat.delete()
      src.delete()

      return result
    } catch (error) {
      // Clean up on error
      processed.delete()
      src.delete()
      throw error
    }
  }

  private static applySharpen(src: cv.Mat): cv.Mat {
    const dst = new cv.Mat()
    const kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ])
    
    cv.filter2D(src, dst, cv.CV_8U, kernel)
    kernel.delete()
    
    return dst
  }

  private static removeSimpleBackground(src: cv.Mat): cv.Mat {
    const dst = src.clone()
    
    // Simple background removal using morphological operations
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3))
    const opening = new cv.Mat()
    
    cv.morphologyEx(src, opening, cv.MORPH_OPEN, kernel)
    cv.subtract(src, opening, dst)
    
    kernel.delete()
    opening.delete()
    
    return dst
  }

  private static deskewImage(src: cv.Mat): cv.Mat {
    // Convert to grayscale if needed
    let gray = src
    if (src.channels() > 1) {
      gray = new cv.Mat()
      cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY)
    }

    // Find edges
    const edges = new cv.Mat()
    cv.Canny(gray, edges, 50, 200)

    // Find lines using Hough transform
    const lines = new cv.Mat()
    cv.HoughLines(edges, lines, 1, Math.PI / 180, 100)

    // Calculate average angle
    let angleSum = 0
    let count = 0

    for (let i = 0; i < lines.rows; i++) {
      // const _rho = lines.data32F[i * 2]
      const theta = lines.data32F[i * 2 + 1]
      
      // Convert to degrees
      const angle = (theta * 180 / Math.PI) - 90
      
      // Only consider small angles (< 10 degrees)
      if (Math.abs(angle) < 10) {
        angleSum += angle
        count++
      }
    }

    // Clean up
    edges.delete()
    lines.delete()
    if (gray !== src) gray.delete()

    // Calculate average angle
    const avgAngle = count > 0 ? angleSum / count : 0

    // Rotate if needed
    if (Math.abs(avgAngle) > 0.5) {
      const center = new cv.Point2f(src.cols / 2, src.rows / 2)
      const M = cv.getRotationMatrix2D(center, avgAngle, 1)
      const dst = new cv.Mat()
      const size = new cv.Size(src.cols, src.rows)
      
      cv.warpAffine(src, dst, M, size, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(255, 255, 255, 255))
      
      M.delete()
      return dst
    }

    return src.clone()
  }

  // Automatic preprocessing based on image analysis
  static async autoPreprocess(imageData: ImageData): Promise<{
    processed: ImageData
    appliedOptions: PreprocessingOptions
  }> {
    // If OpenCV is not ready, return original image
    if (!this.isOpenCVReady()) {
      console.warn('OpenCV.js is not loaded. Skipping auto preprocessing.')
      return { processed: imageData, appliedOptions: {} }
    }

    // Analyze image to determine best preprocessing options
    const analysis = this.analyzeImage(imageData)
    
    const options: PreprocessingOptions = {
      grayscale: true,
      denoise: analysis.isNoisy,
      contrast: analysis.lowContrast,
      contrastAlpha: analysis.lowContrast ? 1.5 : 1,
      sharpen: analysis.isBlurry,
      deskew: analysis.isSkewed,
      threshold: analysis.needsThreshold,
      thresholdValue: analysis.optimalThreshold
    }

    const processed = await this.preprocess(imageData, options)
    
    return { processed, appliedOptions: options }
  }

  private static analyzeImage(imageData: ImageData): {
    isNoisy: boolean
    lowContrast: boolean
    isBlurry: boolean
    isSkewed: boolean
    needsThreshold: boolean
    optimalThreshold: number
  } {
    // Safety check - should not reach here if OpenCV is not ready
    if (!this.isOpenCVReady()) {
      return {
        isNoisy: false,
        lowContrast: false,
        isBlurry: false,
        isSkewed: false,
        needsThreshold: false,
        optimalThreshold: 127
      }
    }

    const src = cv.matFromImageData(imageData)
    let gray = src
    
    if (src.channels() > 1) {
      gray = new cv.Mat()
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
    }

    // Calculate histogram
    const hist = new cv.Mat()
    const histSize = [256]
    const ranges = [0, 256]
    const channels = [0]
    const mask = new cv.Mat()
    const matVector = new cv.MatVector()
    matVector.push_back(gray)
    cv.calcHist(matVector, channels, mask, hist, histSize, ranges)
    matVector.delete()
    mask.delete()

    // Analyze contrast using histogram
    let minVal = 255, maxVal = 0
    for (let i = 0; i < 256; i++) {
      if (hist.data32F[i] > 0) {
        if (i < minVal) minVal = i
        if (i > maxVal) maxVal = i
      }
    }
    const contrast = maxVal - minVal
    const lowContrast = contrast < 100

    // Check if image is mostly text (bi-modal histogram)
    const otsuThreshold = cv.threshold(gray, new cv.Mat(), 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)
    const needsThreshold = true // For OCR, thresholding usually helps

    // Simple noise detection using Laplacian variance
    const laplacian = new cv.Mat()
    cv.Laplacian(gray, laplacian, cv.CV_64F)
    const mean = new cv.Mat()
    const stddev = new cv.Mat()
    cv.meanStdDev(laplacian, mean, stddev)
    const variance = stddev.data64F[0] * stddev.data64F[0]
    const isBlurry = variance < 100

    // Clean up
    hist.delete()
    laplacian.delete()
    mean.delete()
    stddev.delete()
    if (gray !== src) gray.delete()
    src.delete()

    return {
      isNoisy: false, // Simple heuristic
      lowContrast,
      isBlurry,
      isSkewed: false, // Would need more complex analysis
      needsThreshold,
      optimalThreshold: otsuThreshold
    }
  }
}