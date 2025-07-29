// Special handling for PPU Paddle OCR models
export function isPPUModel(modelPath: string): boolean {
  return modelPath.includes('ppu-paddle-ocr') || modelPath.includes('PP-OCRv5_mobile_det') || modelPath.includes('PP-OCRv4_mobile_rec');
}

// PPU models use grayscale normalization (using red channel only)
export function ppuNormalization(r: number, _g: number, _b: number): number {
  // PPU implementation uses only the red channel as grayscale
  const gray = r / 255.0;
  // Apply normalization: (value - 0.5) / 0.5
  return (gray - 0.5) / 0.5;
}

// PPU dictionary includes blank token at index 0
export function loadPPUDictionary(text: string): string[] {
  // Split by newline but keep empty lines (especially the first one)
  const lines = text.split('\n');
  // Remove only the last empty line if it exists (from trailing newline)
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

// PPU recognition expects specific output shape
export function decodePPUOutput(
  output: any,
  charDict: string[],
  batchIndex: number = 0
): { text: string; confidence: number } {
  const data = output.data as Float32Array;
  const shape = output.dims as number[];
  
  // PPU expects [batch, sequence_length, num_classes]
  if (shape.length !== 3) {
    console.error('PPU model: unexpected output shape:', shape);
    return { text: '', confidence: 0 };
  }
  
  const [_batchSize, seqLen, vocabSize] = shape;
  const batchOffset = batchIndex * seqLen * vocabSize;
  
  if (batchIndex === 0) {
    console.log(`PPU decode: seqLen=${seqLen}, vocabSize=${vocabSize}, dictLen=${charDict.length}`);
    // PPU models have vocabSize = dictLen + 1 (blank token at index 0)
    if (vocabSize === charDict.length + 1) {
      console.log('PPU model detected: blank token at index 0, dictionary starts at index 1');
    } else if (vocabSize !== charDict.length) {
      console.warn(`Warning: vocabulary size (${vocabSize}) doesn't match dictionary length (${charDict.length})`);
    }
  }
  
  // CTC decoding
  const decoded: number[] = [];
  const confidences: number[] = [];
  let prevIdx = -1;
  
  for (let t = 0; t < seqLen; t++) {
    let maxIdx = 0;
    let maxProb = 0; // PPU outputs are probabilities (0-1), not logits
    
    // Find the character with highest probability
    for (let c = 0; c < vocabSize; c++) {
      const prob = data[batchOffset + t * vocabSize + c];
      if (prob > maxProb) {
        maxProb = prob;
        maxIdx = c;
      }
    }
    
    // Debug first few timesteps
    if (t < 5 && batchIndex === 0) {
      const char = maxIdx === 0 ? '<blank>' : (maxIdx < charDict.length ? charDict[maxIdx] : '<OOB>');
      console.log(`PPU decode t=${t}: maxIdx=${maxIdx} (${char}), maxProb=${maxProb.toFixed(4)}`);
    }
    
    // CTC decoding rules - index 0 is blank token for PPU
    if (maxIdx !== 0 && maxIdx !== prevIdx) {
      decoded.push(maxIdx);
      confidences.push(maxProb);
    }
    
    prevIdx = maxIdx;
  }
  
  // Convert to text - PPU uses 0-based indexing (direct dictionary lookup)
  let text = '';
  
  for (const idx of decoded) {
    if (idx < charDict.length) {
      const char = charDict[idx];
      // Handle special tokens at the end of dictionary
      if (idx === charDict.length - 1 && char === '<unk>') {
        continue; // Skip unknown token
      }
      text += char;
    } else {
      console.warn(`PPU decode: character index ${idx} out of bounds for dictionary length ${charDict.length}`);
    }
  }
  
  console.log('[PPU Debug] Decoded indices:', decoded);
  console.log('[PPU Debug] Text:', text);
  
  const avgConfidence = confidences.length > 0 
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
    : 0;
  
  return { text: text.trim(), confidence: avgConfidence };
}