/**
 * Convert between different box formats
 */

import type { BoundingBox } from '../types/ocr.types'

/**
 * Convert array format box to BoundingBox format
 * @param box Array format box [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
 * @returns BoundingBox format
 */
export function arrayToBoundingBox(box: number[][]): BoundingBox {
  if (box.length !== 4 || !box.every(point => point.length === 2)) {
    throw new Error('Invalid box format. Expected 4 points with x,y coordinates')
  }
  
  return {
    topLeft: { x: box[0][0], y: box[0][1] },
    topRight: { x: box[1][0], y: box[1][1] },
    bottomRight: { x: box[2][0], y: box[2][1] },
    bottomLeft: { x: box[3][0], y: box[3][1] }
  }
}

/**
 * Convert BoundingBox format to array format
 * @param box BoundingBox format
 * @returns Array format box [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
 */
export function boundingBoxToArray(box: BoundingBox): number[][] {
  return [
    [box.topLeft.x, box.topLeft.y],
    [box.topRight.x, box.topRight.y],
    [box.bottomRight.x, box.bottomRight.y],
    [box.bottomLeft.x, box.bottomLeft.y]
  ]
}

/**
 * Check if a box is in array format
 */
export function isArrayBox(box: any): box is number[][] {
  return Array.isArray(box) && 
         box.length === 4 && 
         box.every((point: any) => Array.isArray(point) && point.length === 2)
}

/**
 * Convert box to BoundingBox format (handles both formats)
 */
export function toBoundingBox(box: BoundingBox | number[][]): BoundingBox {
  if (isArrayBox(box)) {
    return arrayToBoundingBox(box)
  }
  return box
}