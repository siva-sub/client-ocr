import cv from "@techstark/opencv-js"

interface RecPreProcessConfig {
  imageShape?: [number, number, number]; // [channels, height, width]
}

export class RecPreProcess {
  private imgC: number;
  private imgH: number;
  private imgW: number;

  constructor(config: RecPreProcessConfig = {}) {
    const shape = config.imageShape ?? [3, 48, 320];
    [this.imgC, this.imgH, this.imgW] = shape;
  }

  resizeNormImg(img: cv.Mat, maxWhRatio: number): {
    processedImg: Float32Array;
    shape: [number, number, number, number];
    validWidth: number;
  } {
    const h = img.rows;
    const w = img.cols;
    const whRatio = w / h;
    
    let imgWidth = Math.round(this.imgH * maxWhRatio);
    if (imgWidth > this.imgW) {
      imgWidth = this.imgW;
    }

    let resizedW: number;
    if (Math.ceil(this.imgH * whRatio) > imgWidth) {
      resizedW = imgWidth;
    } else {
      resizedW = Math.ceil(this.imgH * whRatio);
    }

    // Resize image
    const resized = new cv.Mat();
    cv.resize(img, resized, new cv.Size(resizedW, this.imgH), 0, 0, cv.INTER_LINEAR);

    // Convert to float32
    const floatImg = new cv.Mat();
    resized.convertTo(floatImg, cv.CV_32FC3);

    // Normalize: (img / 255 - 0.5) / 0.5
    const normalized = new cv.Mat();
    const divider255 = new cv.Mat(floatImg.rows, floatImg.cols, floatImg.type(), new cv.Scalar(255, 255, 255));
    cv.divide(floatImg, divider255, normalized);
    divider255.delete();
    
    const subtractor = new cv.Mat(normalized.rows, normalized.cols, normalized.type(), new cv.Scalar(0.5, 0.5, 0.5));
    cv.subtract(normalized, subtractor, normalized);
    subtractor.delete();
    
    const divider05 = new cv.Mat(normalized.rows, normalized.cols, normalized.type(), new cv.Scalar(0.5, 0.5, 0.5));
    cv.divide(normalized, divider05, normalized);
    divider05.delete();

    // Create padding image
    const paddingImg = new cv.Mat(this.imgH, imgWidth, cv.CV_32FC3, new cv.Scalar(0, 0, 0));
    
    // Copy resized image to padding image
    const roi = paddingImg.roi(new cv.Rect(0, 0, resizedW, this.imgH));
    normalized.copyTo(roi);

    // Convert to CHW format
    const permuted = this.permute(paddingImg);
    
    // Convert to Float32Array
    const processedImg = new Float32Array(permuted.data32F);
    const shape: [number, number, number, number] = [1, this.imgC, this.imgH, imgWidth];

    // Cleanup
    resized.delete();
    floatImg.delete();
    normalized.delete();
    paddingImg.delete();
    roi.delete();
    permuted.delete();

    return {
      processedImg,
      shape,
      validWidth: resizedW
    };
  }

  resizeNormImgBatch(
    imgList: cv.Mat[], 
    batchNum: number = 6
  ): {
    batchImages: Float32Array[];
    shapes: [number, number, number, number][];
    validWidths: number[];
    whRatios: number[];
  } {
    const imgNum = imgList.length;
    
    // Calculate width ratios and sort by aspect ratio for better batching
    const widthList = imgList.map(img => img.cols / img.rows);
    const indices = Array.from({ length: imgNum }, (_, i) => i)
      .sort((a, b) => widthList[a] - widthList[b]);

    const batchImages: Float32Array[] = [];
    const shapes: [number, number, number, number][] = [];
    const validWidths: number[] = [];
    const whRatios: number[] = [];

    for (let begImgNo = 0; begImgNo < imgNum; begImgNo += batchNum) {
      const endImgNo = Math.min(imgNum, begImgNo + batchNum);
      const batchIndices = indices.slice(begImgNo, endImgNo);
      
      // Find max width ratio in this batch
      const maxWhRatio = Math.max(...batchIndices.map(idx => widthList[idx]));
      
      // Process each image in the batch
      const batchData: Float32Array[] = [];
      const batchShapes: [number, number, number, number][] = [];
      const batchValidWidths: number[] = [];
      const batchWhRatios: number[] = [];

      for (const idx of batchIndices) {
        const result = this.resizeNormImg(imgList[idx], maxWhRatio);
        batchData.push(result.processedImg);
        batchShapes.push(result.shape);
        batchValidWidths.push(result.validWidth);
        batchWhRatios.push(widthList[idx]);
      }

      // Concatenate batch data
      const batchSize = batchData.length;
      const [_, c, h, w] = batchShapes[0];
      const concatenated = new Float32Array(batchSize * c * h * w);
      
      for (let i = 0; i < batchSize; i++) {
        concatenated.set(batchData[i], i * c * h * w);
      }

      batchImages.push(concatenated);
      shapes.push([batchSize, c, h, w]);
      validWidths.push(...batchValidWidths);
      whRatios.push(...batchWhRatios);
    }

    return {
      batchImages,
      shapes,
      validWidths,
      whRatios
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