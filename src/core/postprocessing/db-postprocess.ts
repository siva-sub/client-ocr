import cv from "@techstark/opencv-js"

interface DBPostProcessConfig {
  thresh?: number;
  boxThresh?: number;
  maxCandidates?: number;
  unclipRatio?: number;
  scoreMode?: 'fast' | 'slow';
  useDilation?: boolean;
}

export class DBPostProcess {
  private thresh: number;
  private boxThresh: number;
  private maxCandidates: number;
  private unclipRatio: number;
  private minSize: number;
  private scoreMode: 'fast' | 'slow';
  private dilationKernel: cv.Mat | null;

  constructor(config: DBPostProcessConfig = {}) {
    this.thresh = config.thresh ?? 0.3;
    this.boxThresh = config.boxThresh ?? 0.7;
    this.maxCandidates = config.maxCandidates ?? 1000;
    this.unclipRatio = config.unclipRatio ?? 2.0;
    this.minSize = 3;
    this.scoreMode = config.scoreMode ?? 'fast';

    this.dilationKernel = null;
    if (config.useDilation) {
      this.dilationKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
    }
  }

  process(pred: Float32Array, shape: [number, number, number, number], oriShape: [number, number]): {
    boxes: number[][][];
    scores: number[];
  } {
    const [srcH, srcW] = oriShape;
    const [_batchSize, _channels, height, width] = shape;
    
    // Extract the first channel of the first batch
    const segmentation = new cv.Mat(height, width, cv.CV_32FC1);
    const predData = segmentation.data32F;
    
    // Copy prediction data and apply threshold
    for (let i = 0; i < height * width; i++) {
      predData[i] = pred[i] > this.thresh ? 1 : 0;
    }

    let mask = segmentation;
    
    // Apply dilation if enabled
    if (this.dilationKernel !== null) {
      const dilatedMask = new cv.Mat();
      cv.dilate(segmentation, dilatedMask, this.dilationKernel);
      mask = dilatedMask;
      segmentation.delete();
    }

    // Convert to 8-bit for contour detection
    const binaryMask = new cv.Mat();
    mask.convertTo(binaryMask, cv.CV_8U, 255);

    // Find contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(binaryMask, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    const numContours = Math.min(contours.size(), this.maxCandidates);
    const boxes: number[][][] = [];
    const scores: number[] = [];

    // Create prediction mat for scoring
    const predMat = new cv.Mat(height, width, cv.CV_32FC1);
    const predMatData = predMat.data32F;
    for (let i = 0; i < height * width; i++) {
      predMatData[i] = pred[i];
    }

    for (let index = 0; index < numContours; index++) {
      const contour = contours.get(index);
      const { points, sside } = this.getMiniBoxes(contour);
      
      if (sside < this.minSize) {
        continue;
      }

      let score: number;
      if (this.scoreMode === 'fast') {
        score = this.boxScoreFast(predMat, points);
      } else {
        score = this.boxScoreSlow(predMat, contour);
      }

      if (score < this.boxThresh) {
        continue;
      }

      // Unclip the box
      const unclippedBox = this.unclip(points);
      const { points: finalBox, sside: finalSside } = this.getMiniBoxes(unclippedBox);
      
      if (finalSside < this.minSize + 2) {
        continue;
      }

      // Scale box coordinates back to original image size
      const scaledBox = finalBox.map(point => [
        Math.round(Math.max(0, Math.min(point[0] / width * srcW, srcW))),
        Math.round(Math.max(0, Math.min(point[1] / height * srcH, srcH)))
      ]);

      boxes.push(scaledBox);
      scores.push(score);
    }

    // Cleanup
    mask.delete();
    binaryMask.delete();
    contours.delete();
    hierarchy.delete();
    predMat.delete();
    if (this.dilationKernel) {
      this.dilationKernel.delete();
    }

    return { boxes, scores };
  }

  private getMiniBoxes(contour: cv.Mat): { points: number[][], sside: number } {
    const rect = cv.minAreaRect(contour);
    const boxPoints = new cv.Mat();
    cv.boxPoints(rect, boxPoints);
    
    // Convert to array and sort by x coordinate
    const points: number[][] = [];
    for (let i = 0; i < 4; i++) {
      points.push([boxPoints.data32F[i * 2], boxPoints.data32F[i * 2 + 1]]);
    }
    points.sort((a, b) => a[0] - b[0]);

    // Determine correct order of points
    let index1 = 0, index2 = 1, index3 = 2, index4 = 3;
    
    if (points[1][1] > points[0][1]) {
      index1 = 0;
      index4 = 1;
    } else {
      index1 = 1;
      index4 = 0;
    }

    if (points[3][1] > points[2][1]) {
      index2 = 2;
      index3 = 3;
    } else {
      index2 = 3;
      index3 = 2;
    }

    const orderedPoints = [
      points[index1],
      points[index2],
      points[index3],
      points[index4]
    ];

    const sside = Math.min(rect.size.width, rect.size.height);
    
    boxPoints.delete();
    
    return { points: orderedPoints, sside };
  }

  private boxScoreFast(bitmap: cv.Mat, box: number[][]): number {
    const h = bitmap.rows;
    const w = bitmap.cols;
    
    // Get bounding box
    const xmin = Math.max(0, Math.floor(Math.min(...box.map(p => p[0]))));
    const xmax = Math.min(w - 1, Math.ceil(Math.max(...box.map(p => p[0]))));
    const ymin = Math.max(0, Math.floor(Math.min(...box.map(p => p[1]))));
    const ymax = Math.min(h - 1, Math.ceil(Math.max(...box.map(p => p[1]))));

    // Create mask
    const maskWidth = xmax - xmin + 1;
    const maskHeight = ymax - ymin + 1;
    const mask = cv.Mat.zeros(maskHeight, maskWidth, cv.CV_8UC1);
    
    // Adjust box coordinates to mask coordinates
    const adjustedBox = box.map(p => [p[0] - xmin, p[1] - ymin]);
    
    // Create contour for fillPoly
    const contourMat = new cv.Mat(4, 1, cv.CV_32SC2);
    const contourData = contourMat.data32S;
    for (let i = 0; i < 4; i++) {
      contourData[i * 2] = Math.round(adjustedBox[i][0]);
      contourData[i * 2 + 1] = Math.round(adjustedBox[i][1]);
    }
    
    const contours = new cv.MatVector();
    contours.push_back(contourMat);
    cv.fillPoly(mask, contours, new cv.Scalar(1));

    // Calculate mean score in the masked region
    const roi = bitmap.roi(new cv.Rect(xmin, ymin, maskWidth, maskHeight));
    const mean = cv.mean(roi, mask);
    const score = mean[0];

    // Cleanup
    mask.delete();
    contourMat.delete();
    contours.delete();
    roi.delete();

    return score;
  }

  private boxScoreSlow(bitmap: cv.Mat, contour: cv.Mat): number {
    const h = bitmap.rows;
    const w = bitmap.cols;
    
    // Get bounding box from contour
    const rect = cv.boundingRect(contour);
    const xmin = Math.max(0, rect.x);
    const xmax = Math.min(w - 1, rect.x + rect.width);
    const ymin = Math.max(0, rect.y);
    const ymax = Math.min(h - 1, rect.y + rect.height);

    // Create mask
    const maskWidth = xmax - xmin + 1;
    const maskHeight = ymax - ymin + 1;
    const mask = cv.Mat.zeros(maskHeight, maskWidth, cv.CV_8UC1);
    
    // Adjust contour coordinates to mask coordinates
    const adjustedContour = new cv.Mat();
    contour.copyTo(adjustedContour);
    const adjustedData = adjustedContour.data32S;
    for (let i = 0; i < adjustedContour.rows; i++) {
      adjustedData[i * 2] -= xmin;
      adjustedData[i * 2 + 1] -= ymin;
    }
    
    const contours = new cv.MatVector();
    contours.push_back(adjustedContour);
    cv.fillPoly(mask, contours, new cv.Scalar(1));

    // Calculate mean score in the masked region
    const roi = bitmap.roi(new cv.Rect(xmin, ymin, maskWidth, maskHeight));
    const mean = cv.mean(roi, mask);
    const score = mean[0];

    // Cleanup
    mask.delete();
    adjustedContour.delete();
    contours.delete();
    roi.delete();

    return score;
  }

  private unclip(box: number[][]): cv.Mat {
    // Calculate area using shoelace formula
    let area = 0;
    let perimeter = 0;
    const n = box.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += box[i][0] * box[j][1];
      area -= box[j][0] * box[i][1];
      
      const dx = box[j][0] - box[i][0];
      const dy = box[j][1] - box[i][1];
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    
    area = Math.abs(area) / 2;
    const distance = area * this.unclipRatio / perimeter;

    // Offset the polygon
    // Since OpenCV.js doesn't have a direct polygon offset function,
    // we'll approximate by scaling the polygon from its center
    const centerX = box.reduce((sum, p) => sum + p[0], 0) / n;
    const centerY = box.reduce((sum, p) => sum + p[1], 0) / n;
    
    const scaleFactor = 1 + (2 * distance / Math.sqrt(area));
    
    const expandedBox = new cv.Mat(n, 1, cv.CV_32FC2);
    const expandedData = expandedBox.data32F;
    
    for (let i = 0; i < n; i++) {
      const dx = box[i][0] - centerX;
      const dy = box[i][1] - centerY;
      expandedData[i * 2] = centerX + dx * scaleFactor;
      expandedData[i * 2 + 1] = centerY + dy * scaleFactor;
    }
    
    return expandedBox;
  }

  updateConfig(config: Partial<DBPostProcessConfig>): void {
    if (config.thresh !== undefined) this.thresh = config.thresh;
    if (config.boxThresh !== undefined) this.boxThresh = config.boxThresh;
    if (config.maxCandidates !== undefined) this.maxCandidates = config.maxCandidates;
    if (config.unclipRatio !== undefined) this.unclipRatio = config.unclipRatio;
    if (config.scoreMode !== undefined) this.scoreMode = config.scoreMode;
    
    if (config.useDilation !== undefined) {
      if (this.dilationKernel) {
        this.dilationKernel.delete();
        this.dilationKernel = null;
      }
      if (config.useDilation) {
        this.dilationKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
      }
    }
  }
}