# Client-Side OCR Troubleshooting Guide

This guide covers common issues encountered during development and usage of the Client-Side OCR library, along with their solutions.

## Table of Contents

1. [PPU Model Issues](#ppu-model-issues)
2. [Stack Overflow Errors](#stack-overflow-errors)
3. [Model Loading Issues](#model-loading-issues)
4. [Processing Errors](#processing-errors)
5. [Performance Issues](#performance-issues)
6. [Browser Compatibility](#browser-compatibility)
7. [Memory Issues](#memory-issues)
8. [Caching Problems](#caching-problems)
9. [Development Issues](#development-issues)

## PPU Model Issues

### Problem: PPU Models Returning Incorrect Text

**Symptoms:**
- PPU models return gibberish like "Sdrs", "NBQ", "Gdkkn", "Vnqkc" instead of actual text
- Models work but predictions are completely wrong
- English models producing unreadable output

**Root Cause:**
PPU models use different preprocessing than RapidOCR models:
1. Grayscale conversion uses only red channel (not standard luminance formula)
2. No pixel inversion required
3. Dictionary uses 0-based indexing (not 1-based with blank token offset)

**Solution:**

```typescript
// In recognition.worker.v2.ts
if (isUsingPPUModel) {
  // PPU models: Use only red channel as grayscale
  const grayValue = r;  // Not: 0.299*r + 0.587*g + 0.114*b
  const normalizedValue = (grayValue / 255.0 - 0.5) / 0.5;
  
  // Fill all three channels with the same value
  normalized[outIdx] = normalizedValue;
  normalized[targetHeight * tensorWidth + outIdx] = normalizedValue;
  normalized[2 * targetHeight * tensorWidth + outIdx] = normalizedValue;
}

// In ppu-model-handler.ts
// Use direct dictionary lookup (0-based)
for (const idx of decoded) {
  if (idx < charDict.length) {
    text += charDict[idx];  // Not: charDict[idx - 1]
  }
}
```

**Debugging Steps:**
1. Check preprocessing normalization values
2. Verify dictionary indexing
3. Compare with PPU reference implementation
4. Test with simple text images first

## Stack Overflow Errors

### Problem: Maximum Call Stack Size Exceeded with Large Images

**Symptoms:**
- Error: "Maximum call stack size exceeded" when processing large documents
- Occurs with documents that create large tensors (e.g., 1099x48)
- Browser tab crashes or becomes unresponsive

**Root Cause:**
1. Spread operator on large arrays exhausts call stack
2. Debug logging operations on large typed arrays
3. No width limiting for PPU models

**Solution:**

```typescript
// 1. Replace spread operator with loop
// Bad:
results.push(...batchResults);

// Good:
for (const result of batchResults) {
  results.push(result);
}

// 2. Limit width for PPU models
if (isUsingPPUModel) {
  const maxPPUWidth = 800;
  if (resizeWidth > maxPPUWidth) {
    console.warn(`PPU model: limiting width from ${resizeWidth} to ${maxPPUWidth}`);
    resizeWidth = maxPPUWidth;
    tensorWidth = maxPPUWidth;
  }
}

// 3. Skip debug operations on large tensors
if (isUsingPPUModel && tensorWidth >= 500) {
  console.log(`PPU large tensor: ${tensorWidth}x${targetHeight}, skipping debug output`);
  // Skip array operations that could cause stack overflow
}
```

## Model Loading Issues

### Problem: Models Not Loading or 404 Errors

**Symptoms:**
- 404 errors when fetching model files
- "Model not found" errors
- Initialization hanging indefinitely

**Causes & Solutions:**

1. **Wrong base URL**
   ```typescript
   // Ensure correct base URL for your deployment
   const ocr = createRapidOCREngine({
     language: 'en',
     baseUrl: '/client-ocr/models'  // Adjust for your setup
   });
   ```

2. **Missing model files**
   - Verify all required files are in public/models/
   - Check file permissions
   - Ensure files are included in build

3. **CORS issues**
   ```typescript
   // For cross-origin model loading
   const ocr = createRapidOCREngine({
     language: 'en',
     fetchOptions: {
       mode: 'cors',
       credentials: 'omit'
     }
   });
   ```

### Problem: Slow Model Downloads

**Solution:**
1. Enable model caching:
   ```typescript
   const ocr = createRapidOCREngine({
     language: 'en',
     cacheModels: true
   });
   ```

2. Use CDN for models:
   ```typescript
   const ocr = createRapidOCREngine({
     language: 'en',
     baseUrl: 'https://cdn.jsdelivr.net/npm/client-side-ocr/models'
   });
   ```

## Processing Errors

### Problem: "OCR engine not initialized"

**Symptoms:**
- Error immediately when trying to process image
- Workers not ready

**Solution:**
```typescript
// Always wait for initialization
const ocr = createRapidOCREngine({ language: 'en' });
await ocr.initialize();  // Don't forget to await!

// Or check initialization status
if (!ocr.initialized) {
  await ocr.initialize();
}
```

### Problem: Blank or Empty Results

**Causes & Solutions:**

1. **Image too dark/light**
   ```typescript
   const result = await ocr.processImage(image, {
     preprocessConfig: {
       contrast: 1.5,
       brightness: 10
     }
   });
   ```

2. **Wrong language model**
   ```typescript
   // Detect language first
   const detectedLang = await detectLanguage(image);
   const ocr = createRapidOCREngine({ language: detectedLang });
   ```

3. **Text too small**
   ```typescript
   // Resize image before processing
   const resized = await resizeImage(image, {
     minWidth: 1024
   });
   ```

## Performance Issues

### Problem: Slow Processing on Mobile Devices

**Solutions:**

1. **Use mobile models**
   ```typescript
   const ocr = createRapidOCREngine({
     language: 'en',
     modelType: 'mobile'  // Faster than 'server'
   });
   ```

2. **Reduce image size**
   ```typescript
   const optimized = await resizeImage(image, {
     maxWidth: 1280,
     maxHeight: 1280
   });
   ```

3. **Process in chunks**
   ```typescript
   // For PDFs or multiple images
   for (const page of pages) {
     const result = await ocr.processImage(page);
     displayResult(result);
     
     // Give UI time to update
     await new Promise(resolve => setTimeout(resolve, 0));
   }
   ```

### Problem: High Memory Usage

**Solutions:**

1. **Clean up after processing**
   ```typescript
   // Process images one at a time
   for (const image of images) {
     const result = await ocr.processImage(image);
     // Process result...
   }
   
   // Cleanup when done
   await ocr.cleanup();
   ```

2. **Limit concurrent processing**
   ```typescript
   const results = await ocr.processBatch(images, {
     maxConcurrent: 2  // Limit to 2 at a time
   });
   ```

## Browser Compatibility

### Problem: WebAssembly Not Supported

**Error:** "WebAssembly is not supported in this browser"

**Solutions:**
1. Update browser to latest version
2. Enable WebAssembly in browser settings
3. Provide fallback message:
   ```typescript
   if (!window.WebAssembly) {
     showError('Please use a modern browser that supports WebAssembly');
   }
   ```

### Problem: Web Workers Not Available

**Solutions:**
1. Check for HTTPS (required for Workers in some browsers)
2. Ensure correct MIME types for worker files
3. Test Worker support:
   ```typescript
   if (!window.Worker) {
     showError('Web Workers not supported');
   }
   ```

## Memory Issues

### Problem: Out of Memory Errors

**Symptoms:**
- Browser tab crashes
- "Out of memory" console errors
- Processing fails on large images

**Solutions:**

1. **Process smaller regions**
   ```typescript
   // Split large image into tiles
   const tiles = splitImageIntoTiles(image, 1024, 1024);
   const results = [];
   
   for (const tile of tiles) {
     const result = await ocr.processImage(tile);
     results.push(result);
   }
   ```

2. **Free memory explicitly**
   ```typescript
   // Clear references
   let result = await ocr.processImage(image);
   processResult(result);
   result = null;  // Help GC
   
   // For canvas
   canvas.width = 0;
   canvas.height = 0;
   ```

## Caching Problems

### Problem: Cache Not Working

**Symptoms:**
- Models download every time
- IndexedDB errors

**Solutions:**

1. **Check IndexedDB support**
   ```typescript
   if (!window.indexedDB) {
     console.warn('IndexedDB not supported, caching disabled');
   }
   ```

2. **Clear corrupted cache**
   ```typescript
   await ocr.clearCache();
   await ocr.initialize();  // Re-download
   ```

3. **Handle quota errors**
   ```typescript
   try {
     await ocr.initialize();
   } catch (error) {
     if (error.name === 'QuotaExceededError') {
       await ocr.clearCache();
       await ocr.initialize();
     }
   }
   ```

### Problem: Stale Cache After Updates

**Solution:**
```typescript
// Version your cache
const ocr = createRapidOCREngine({
  language: 'en',
  cacheVersion: 'v2.0.1'  // Increment on model updates
});
```

## Development Issues

### Problem: Service Worker Caching During Development

**Symptoms:**
- Changes not reflected
- Old code running

**Solutions:**

1. **Disable service worker in development**
   ```javascript
   // In vite.config.ts
   export default {
     plugins: [
       VitePWA({
         disable: process.env.NODE_ENV === 'development'
       })
     ]
   };
   ```

2. **Force refresh**
   - Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Open DevTools → Application → Service Workers → Update

### Problem: TypeScript Errors with Float32Array

**Error:** "Property 'map' does not exist on type 'Float32Array'"

**Solution:**
```typescript
// Convert to regular array first
const array = Array.from(float32Array);
const mapped = array.map(v => v * 2);

// Or use TypedArray methods
const doubled = float32Array.map(v => v * 2);  // TS 3.1+
```

### Problem: Module Resolution Issues

**Solutions:**

1. **Configure TypeScript paths**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "client-side-ocr": ["./src/index.ts"],
         "client-side-ocr/*": ["./src/*"]
       }
     }
   }
   ```

2. **Use correct imports**
   ```typescript
   // For library users
   import { createRapidOCREngine } from 'client-side-ocr';
   
   // For development
   import { createRapidOCREngine } from '@/core/engines';
   ```

## Common Error Messages

### "Failed to decode output: invalid character index"
- **Cause**: Dictionary mismatch or corrupted model
- **Fix**: Re-download models, verify dictionary file

### "Canvas.toBlob is not a function"
- **Cause**: Old browser or polyfill needed
- **Fix**: Use polyfill or upgrade browser

### "Unrecognized option 'wasmPaths'"
- **Cause**: ONNX Runtime version mismatch
- **Fix**: Update to compatible version (1.19.2)

### "Failed to fetch dynamically imported module"
- **Cause**: Vite build issue or missing file
- **Fix**: Clear cache, rebuild, check build output

## Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/siva-sub/client-ocr/issues)
2. Enable debug mode for more info:
   ```typescript
   const ocr = createRapidOCREngine({
     language: 'en',
     debug: true
   });
   ```
3. Collect browser info:
   - Browser version
   - OS
   - Console errors
   - Network tab screenshots
4. Create a minimal reproduction
5. File an issue with details