/**
 * Node.js Example: Using Client-Side OCR in Node.js
 * 
 * While this library is designed for browsers, you can use it in Node.js
 * with some polyfills. This example shows how to set up the environment.
 */

import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { createOCREngine } from 'client-side-ocr';
import fs from 'fs/promises';
import path from 'path';

// Setup browser-like environment
const setupEnvironment = () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
  });

  // Add browser globals
  global.window = dom.window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.Image = window.Image;
  global.HTMLCanvasElement = window.HTMLCanvasElement;
  global.HTMLImageElement = window.HTMLImageElement;
  global.ImageData = window.ImageData;
  global.fetch = fetch;
  
  // Mock Web Workers (simplified)
  global.Worker = class Worker {
    constructor(scriptPath) {
      this.scriptPath = scriptPath;
      this.onmessage = null;
    }
    
    postMessage(data) {
      // In a real implementation, you'd need to handle worker logic
      console.log('Worker received:', data);
    }
    
    terminate() {
      console.log('Worker terminated');
    }
  };
  
  // Mock performance API
  global.performance = {
    now: () => Date.now()
  };
};

// Convert file to blob
async function fileToBlob(filePath) {
  const buffer = await fs.readFile(filePath);
  return new Blob([buffer], { type: 'image/jpeg' });
}

// Process single image
async function processImage(imagePath) {
  console.log(`Processing: ${imagePath}`);
  
  try {
    // Create OCR engine
    const ocr = createOCREngine();
    
    // Initialize with default model
    console.log('Initializing OCR engine...');
    await ocr.initialize();
    
    // Read image file
    const blob = await fileToBlob(imagePath);
    
    // Process image
    console.log('Running OCR...');
    const result = await ocr.processImage(blob);
    
    // Display results
    console.log('\n--- OCR Results ---');
    console.log(`Text: ${result.text}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Processing time: ${result.processingTime}ms`);
    console.log(`Lines detected: ${result.lines.length}`);
    
    // Clean up
    ocr.dispose();
    
    return result;
  } catch (error) {
    console.error('OCR failed:', error);
    throw error;
  }
}

// Batch process multiple images
async function processDirectory(dirPath, outputDir) {
  console.log(`Processing directory: ${dirPath}`);
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all image files
  const files = await fs.readdir(dirPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images`);
  
  // Process each image
  const results = [];
  for (const file of imageFiles) {
    const imagePath = path.join(dirPath, file);
    const outputPath = path.join(outputDir, `${file}.json`);
    
    try {
      const result = await processImage(imagePath);
      
      // Save result
      await fs.writeFile(
        outputPath,
        JSON.stringify(result, null, 2)
      );
      
      results.push({
        file,
        success: true,
        text: result.text,
        confidence: result.confidence
      });
      
    } catch (error) {
      results.push({
        file,
        success: false,
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n--- Processing Summary ---');
  const successful = results.filter(r => r.success).length;
  console.log(`Processed: ${results.length} images`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${results.length - successful}`);
  
  return results;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  node nodejs-example.js <image-path>                    Process single image
  node nodejs-example.js batch <input-dir> <output-dir>  Process directory
  
Examples:
  node nodejs-example.js ./sample.jpg
  node nodejs-example.js batch ./images ./results
    `);
    process.exit(1);
  }
  
  // Setup environment
  setupEnvironment();
  
  try {
    if (args[0] === 'batch' && args.length === 3) {
      // Batch processing
      await processDirectory(args[1], args[2]);
    } else if (args.length === 1) {
      // Single image
      await processImage(args[0]);
    } else {
      console.error('Invalid arguments');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { setupEnvironment, processImage, processDirectory };

/**
 * Note: This is a simplified example. For production use in Node.js,
 * consider these limitations:
 * 
 * 1. Web Workers are not fully supported - you'd need worker_threads
 * 2. WASM may need additional configuration
 * 3. Canvas operations might need node-canvas
 * 4. Performance will be different from browser environment
 * 
 * For server-side OCR, consider using:
 * - Native PaddleOCR Python bindings
 * - Tesseract with node bindings
 * - Cloud OCR services (Google Vision, AWS Textract)
 */