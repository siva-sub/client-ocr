import cv from "@techstark/opencv-js"

interface DetPreProcessConfig {
  limitSideLen?: number;
  limitType?: 'min' | 'max';
  mean?: number[];
  std?: number[];
}

export class DetPreProcess {
  private limitSideLen: number;
  private limitType: 'min' | 'max';
  private mean: number[];
  private std: number[];
  private scale: number;

  constructor(config: DetPreProcessConfig = {}) {
    this.limitSideLen = config.limitSideLen ?? 736;
    this.limitType = config.limitType ?? 'min';
    this.mean = config.mean ?? [0.485, 0.456, 0.406]; // ImageNet mean
    this.std = config.std ?? [0.229, 0.224, 0.225]; // ImageNet std
    this.scale = 1 / 255.0;
  }

  process(img: cv.Mat): {
    processedImg: Float32Array;
    shape: [number, number, number, number];
    originalShape: [number, number];
  } | null {
    const originalShape: [number, number] = [img.rows, img.cols];
    
    // Resize image
    const resized = this.resize(img);
    if (!resized) {
      return null;
    }

    // Normalize
    const normalized = this.normalize(resized);
    
    // Permute from HWC to CHW
    const permuted = this.permute(normalized);
    
    // Add batch dimension
    const shape: [number, number, number, number] = [1, 3, permuted.rows, permuted.cols / 3];
    
    // Convert to Float32Array
    const processedImg = new Float32Array(permuted.data32F);
    
    // Cleanup
    resized.delete();
    normalized.delete();
    permuted.delete();
    
    return {
      processedImg,
      shape,
      originalShape
    };
  }

  private resize(img: cv.Mat): cv.Mat | null {
    const h = img.rows;
    const w = img.cols;
    let ratio = 1.0;

    if (this.limitType === 'max') {
      if (Math.max(h, w) > this.limitSideLen) {
        if (h > w) {
          ratio = this.limitSideLen / h;
        } else {
          ratio = this.limitSideLen / w;
        }
      }
    } else {
      if (Math.min(h, w) < this.limitSideLen) {
        if (h < w) {
          ratio = this.limitSideLen / h;
        } else {
          ratio = this.limitSideLen / w;
        }
      }
    }

    const resizeH = Math.round(h * ratio / 32) * 32;
    const resizeW = Math.round(w * ratio / 32) * 32;

    if (resizeW <= 0 || resizeH <= 0) {
      return null;
    }

    const resized = new cv.Mat();
    cv.resize(img, resized, new cv.Size(resizeW, resizeH), 0, 0, cv.INTER_LINEAR);

    return resized;
  }

  private normalize(img: cv.Mat): cv.Mat {
    // Convert to float32 and scale
    const floatImg = new cv.Mat();
    img.convertTo(floatImg, cv.CV_32FC3, this.scale);

    // Split channels
    const channels = new cv.MatVector();
    cv.split(floatImg, channels);

    // Normalize each channel with ImageNet mean and std
    for (let i = 0; i < 3; i++) {
      const channel = channels.get(i);
      const normalizedChannel = new cv.Mat();
      
      // (pixel - mean) / std
      const meanMat = new cv.Mat(channel.rows, channel.cols, channel.type(), new cv.Scalar(this.mean[i]));
      cv.subtract(channel, meanMat, normalizedChannel);
      meanMat.delete();
      
      const stdMat = new cv.Mat(normalizedChannel.rows, normalizedChannel.cols, normalizedChannel.type(), new cv.Scalar(this.std[i]));
      cv.divide(normalizedChannel, stdMat, normalizedChannel);
      stdMat.delete();
      
      channels.set(i, normalizedChannel);
      channel.delete();
    }

    // Merge channels back
    const normalized = new cv.Mat();
    cv.merge(channels, normalized);

    // Cleanup
    floatImg.delete();
    channels.delete();

    return normalized;
  }

  private permute(img: cv.Mat): cv.Mat {
    // Convert HWC to CHW format
    const rows = img.rows;
    const cols = img.cols;
    const channels = 3;
    
    const permuted = new cv.Mat(channels, rows * cols, cv.CV_32F);
    const srcData = img.data32F;
    const dstData = permuted.data32F;
    
    // Transpose: HWC -> CHW
    for (let c = 0; c < channels; c++) {
      for (let h = 0; h < rows; h++) {
        for (let w = 0; w < cols; w++) {
          const srcIdx = (h * cols + w) * channels + c;
          const dstIdx = c * rows * cols + h * cols + w;
          dstData[dstIdx] = srcData[srcIdx];
        }
      }
    }
    
    return permuted;
  }
}