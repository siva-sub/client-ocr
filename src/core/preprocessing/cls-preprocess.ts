import cv from "@techstark/opencv-js"

interface ClsPreProcessConfig {
  imageShape?: [number, number, number]; // [channels, height, width]
}

export class ClsPreProcess {
  private imgC: number;
  private imgH: number;
  private imgW: number;

  constructor(config: ClsPreProcessConfig = {}) {
    const shape = config.imageShape ?? [3, 48, 192];
    [this.imgC, this.imgH, this.imgW] = shape;
  }

  resizeNormImg(img: cv.Mat): {
    processedImg: Float32Array;
    shape: [number, number, number, number];
  } {
    const h = img.rows;
    const w = img.cols;
    const ratio = w / h;

    let resizedW: number;
    if (Math.ceil(this.imgH * ratio) > this.imgW) {
      resizedW = this.imgW;
    } else {
      resizedW = Math.ceil(this.imgH * ratio);
    }

    // Resize image
    const resized = new cv.Mat();
    cv.resize(img, resized, new cv.Size(resizedW, this.imgH), 0, 0, cv.INTER_LINEAR);

    // Convert to float32
    const floatImg = new cv.Mat();
    resized.convertTo(floatImg, cv.CV_32FC3);

    // Normalize based on number of channels
    let normalized: cv.Mat;
    if (this.imgC === 1) {
      // For grayscale: img / 255
      normalized = new cv.Mat();
      const divider = new cv.Mat(floatImg.rows, floatImg.cols, floatImg.type(), new cv.Scalar(255));
      cv.divide(floatImg, divider, normalized);
      divider.delete();
    } else {
      // For RGB: (img / 255 - 0.5) / 0.5
      normalized = new cv.Mat();
      const divider255 = new cv.Mat(floatImg.rows, floatImg.cols, floatImg.type(), new cv.Scalar(255, 255, 255));
      cv.divide(floatImg, divider255, normalized);
      divider255.delete();
      
      const subtractor = new cv.Mat(normalized.rows, normalized.cols, normalized.type(), new cv.Scalar(0.5, 0.5, 0.5));
      cv.subtract(normalized, subtractor, normalized);
      subtractor.delete();
      
      const divider05 = new cv.Mat(normalized.rows, normalized.cols, normalized.type(), new cv.Scalar(0.5, 0.5, 0.5));
      cv.divide(normalized, divider05, normalized);
      divider05.delete();
    }

    // Create padding image
    const paddingImg = new cv.Mat(this.imgH, this.imgW, cv.CV_32FC3, new cv.Scalar(0, 0, 0));
    
    // Copy resized image to padding image
    const roi = paddingImg.roi(new cv.Rect(0, 0, resizedW, this.imgH));
    normalized.copyTo(roi);

    // Convert to CHW format
    const permuted = this.permute(paddingImg);
    
    // Convert to Float32Array
    const processedImg = new Float32Array(permuted.data32F);
    const shape: [number, number, number, number] = [1, this.imgC, this.imgH, this.imgW];

    // Cleanup
    resized.delete();
    floatImg.delete();
    normalized.delete();
    paddingImg.delete();
    roi.delete();
    permuted.delete();

    return {
      processedImg,
      shape
    };
  }

  resizeNormImgBatch(imgList: cv.Mat[], batchNum: number = 6): {
    batchImages: Float32Array[];
    shapes: [number, number, number, number][];
    indices: number[];
  } {
    const imgNum = imgList.length;
    
    // Calculate width ratios for sorting
    const widthList = imgList.map(img => img.cols / img.rows);
    
    // Sort indices by width ratio for better batching efficiency
    const indices = Array.from({ length: imgNum }, (_, i) => i)
      .sort((a, b) => widthList[a] - widthList[b]);

    const batchImages: Float32Array[] = [];
    const shapes: [number, number, number, number][] = [];

    for (let begImgNo = 0; begImgNo < imgNum; begImgNo += batchNum) {
      const endImgNo = Math.min(imgNum, begImgNo + batchNum);
      const batchIndices = indices.slice(begImgNo, endImgNo);
      
      // Process each image in the batch
      const batchData: Float32Array[] = [];
      
      for (const idx of batchIndices) {
        const result = this.resizeNormImg(imgList[idx]);
        batchData.push(result.processedImg);
      }

      // Concatenate batch data
      const batchSize = batchData.length;
      const concatenated = new Float32Array(batchSize * this.imgC * this.imgH * this.imgW);
      
      for (let i = 0; i < batchSize; i++) {
        concatenated.set(batchData[i], i * this.imgC * this.imgH * this.imgW);
      }

      batchImages.push(concatenated);
      shapes.push([batchSize, this.imgC, this.imgH, this.imgW]);
    }

    return {
      batchImages,
      shapes,
      indices
    };
  }

  private permute(img: cv.Mat): cv.Mat {
    // Convert HWC to CHW format
    const rows = img.rows;
    const cols = img.cols;
    const channels = this.imgC;
    
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