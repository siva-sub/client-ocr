import type { BoundingBox } from '../types/ocr.types'

export interface WordBox {
  text: string
  confidence: number
  box: BoundingBox
  charBoxes?: BoundingBox[]
}

export class WordSegmentation {
  /**
   * Segment text into words and calculate their bounding boxes
   */
  static getWordBoxes(
    text: string,
    charBoxes: BoundingBox[],
    confidence: number
  ): WordBox[] {
    if (!text || charBoxes.length === 0) {
      return []
    }
    
    const words: WordBox[] = []
    const chars = text.split('')
    let currentWord = ''
    let currentCharBoxes: BoundingBox[] = []
    let charIndex = 0
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      
      if (char === ' ' || char === '\t' || char === '\n') {
        // End of word
        if (currentWord.length > 0 && currentCharBoxes.length > 0) {
          words.push({
            text: currentWord,
            confidence: confidence,
            box: this.mergeBoxes(currentCharBoxes),
            charBoxes: [...currentCharBoxes]
          })
          currentWord = ''
          currentCharBoxes = []
        }
      } else {
        // Add character to current word
        currentWord += char
        if (charIndex < charBoxes.length) {
          currentCharBoxes.push(charBoxes[charIndex])
        }
        charIndex++
      }
    }
    
    // Add last word if any
    if (currentWord.length > 0 && currentCharBoxes.length > 0) {
      words.push({
        text: currentWord,
        confidence: confidence,
        box: this.mergeBoxes(currentCharBoxes),
        charBoxes: [...currentCharBoxes]
      })
    }
    
    return words
  }
  
  /**
   * Merge multiple bounding boxes into one
   */
  private static mergeBoxes(boxes: BoundingBox[]): BoundingBox {
    if (boxes.length === 0) {
      throw new Error('Cannot merge empty boxes array')
    }
    
    if (boxes.length === 1) {
      return boxes[0]
    }
    
    // Find the extreme points
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    
    for (const box of boxes) {
      minX = Math.min(minX, box.topLeft.x, box.bottomLeft.x)
      maxX = Math.max(maxX, box.topRight.x, box.bottomRight.x)
      minY = Math.min(minY, box.topLeft.y, box.topRight.y)
      maxY = Math.max(maxY, box.bottomLeft.y, box.bottomRight.y)
    }
    
    // Create merged box
    return {
      topLeft: { x: minX, y: minY },
      topRight: { x: maxX, y: minY },
      bottomRight: { x: maxX, y: maxY },
      bottomLeft: { x: minX, y: maxY }
    }
  }
  
  /**
   * Calculate character-level bounding boxes from a text line box
   * This is an approximation when actual character boxes are not available
   */
  static approximateCharBoxes(
    text: string,
    lineBox: BoundingBox
  ): BoundingBox[] {
    const chars = text.split('')
    const charCount = chars.length
    
    if (charCount === 0) {
      return []
    }
    
    // Calculate the width of the line box
    const lineWidth = Math.sqrt(
      Math.pow(lineBox.topRight.x - lineBox.topLeft.x, 2) +
      Math.pow(lineBox.topRight.y - lineBox.topLeft.y, 2)
    )
    
    // Calculate the angle of the line
    const angle = Math.atan2(
      lineBox.topRight.y - lineBox.topLeft.y,
      lineBox.topRight.x - lineBox.topLeft.x
    )
    
    // Approximate character width (considering spaces might be wider)
    const nonSpaceCount = chars.filter(c => c !== ' ').length
    const spaceCount = chars.filter(c => c === ' ').length
    const charWidth = lineWidth / (nonSpaceCount + spaceCount * 1.5)
    
    // Generate character boxes
    const charBoxes: BoundingBox[] = []
    let currentX = 0
    
    for (const char of chars) {
      const width = char === ' ' ? charWidth * 1.5 : charWidth
      
      // Calculate box corners relative to line start
      const relativeBox = {
        topLeft: { x: currentX, y: 0 },
        topRight: { x: currentX + width, y: 0 },
        bottomRight: { 
          x: currentX + width, 
          y: lineBox.bottomLeft.y - lineBox.topLeft.y 
        },
        bottomLeft: { 
          x: currentX, 
          y: lineBox.bottomLeft.y - lineBox.topLeft.y 
        }
      }
      
      // Rotate and translate to actual position
      const actualBox: BoundingBox = {
        topLeft: this.rotateAndTranslate(
          relativeBox.topLeft, 
          angle, 
          lineBox.topLeft
        ),
        topRight: this.rotateAndTranslate(
          relativeBox.topRight, 
          angle, 
          lineBox.topLeft
        ),
        bottomRight: this.rotateAndTranslate(
          relativeBox.bottomRight, 
          angle, 
          lineBox.topLeft
        ),
        bottomLeft: this.rotateAndTranslate(
          relativeBox.bottomLeft, 
          angle, 
          lineBox.topLeft
        )
      }
      
      charBoxes.push(actualBox)
      currentX += width
    }
    
    return charBoxes
  }
  
  /**
   * Rotate and translate a point
   */
  private static rotateAndTranslate(
    point: { x: number; y: number },
    angle: number,
    origin: { x: number; y: number }
  ): { x: number; y: number } {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    
    return {
      x: origin.x + point.x * cos - point.y * sin,
      y: origin.y + point.x * sin + point.y * cos
    }
  }
  
  /**
   * Split text into lines based on newline characters
   */
  static splitIntoLines(
    text: string,
    box: BoundingBox
  ): Array<{ text: string; box: BoundingBox }> {
    const lines = text.split('\n')
    
    if (lines.length <= 1) {
      return [{ text, box }]
    }
    
    // Approximate line height
    const totalHeight = Math.max(
      Math.abs(box.bottomLeft.y - box.topLeft.y),
      Math.abs(box.bottomRight.y - box.topRight.y)
    )
    const lineHeight = totalHeight / lines.length
    
    // Create boxes for each line
    const lineBoxes: Array<{ text: string; box: BoundingBox }> = []
    
    for (let i = 0; i < lines.length; i++) {
      const yOffset = i * lineHeight
      
      lineBoxes.push({
        text: lines[i],
        box: {
          topLeft: {
            x: box.topLeft.x,
            y: box.topLeft.y + yOffset
          },
          topRight: {
            x: box.topRight.x,
            y: box.topRight.y + yOffset
          },
          bottomRight: {
            x: box.bottomRight.x,
            y: box.topRight.y + yOffset + lineHeight
          },
          bottomLeft: {
            x: box.bottomLeft.x,
            y: box.topLeft.y + yOffset + lineHeight
          }
        }
      })
    }
    
    return lineBoxes
  }
}