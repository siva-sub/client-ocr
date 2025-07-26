import React, { useState, useCallback, useEffect } from 'react';
import { createOCREngine, OCREngine, OCRResult, ProcessingOptions } from 'client-side-ocr';

/**
 * React Example: Custom OCR Component
 * 
 * This example demonstrates how to integrate the client-side OCR library
 * into a React application with custom UI and advanced features.
 */

interface OCRComponentProps {
  defaultModel?: string;
  onResult?: (result: OCRResult) => void;
  processingOptions?: ProcessingOptions;
}

export function OCRComponent({ 
  defaultModel = 'ppocr-v5',
  onResult,
  processingOptions = {
    enableDeskew: true,
    enableFallback: true,
    confidenceThreshold: 0.7
  }
}: OCRComponentProps) {
  // State management
  const [ocr, setOcr] = useState<OCREngine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Initialize OCR engine
  useEffect(() => {
    const engine = createOCREngine();
    setOcr(engine);

    // Initialize with default model
    engine.initialize(defaultModel).then(() => {
      setIsInitialized(true);
    }).catch(err => {
      setError(`Failed to initialize: ${err.message}`);
    });

    // Cleanup on unmount
    return () => {
      engine.dispose();
    };
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setResult(null);
    setProgress(0);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process image
    await processImage(file);
  }, [ocr, isInitialized, processingOptions]);

  // Process image with OCR
  const processImage = async (file: File) => {
    if (!ocr || !isInitialized) {
      setError('OCR engine not initialized');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Process the image
      const ocrResult = await ocr.processImage(file, processingOptions);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(ocrResult);

      // Call parent callback if provided
      if (onResult) {
        onResult(ocrResult);
      }

      // Clear progress after a delay
      setTimeout(() => setProgress(0), 1000);

    } catch (err) {
      setError(`Processing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Switch OCR model
  const handleModelChange = async (modelId: string) => {
    if (!ocr) return;

    setIsInitialized(false);
    setCurrentModel(modelId);

    try {
      await ocr.switchModel(modelId);
      setIsInitialized(true);
    } catch (err) {
      setError(`Failed to switch model: ${err.message}`);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
    }
  };

  // Download result as JSON
  const downloadJSON = () => {
    if (!result) return;

    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ocr-component">
      <div className="ocr-header">
        <h2>Client-Side OCR</h2>
        <div className="model-selector">
          <label>Model:</label>
          <select 
            value={currentModel} 
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={isProcessing}
          >
            <option value="ppocr-v5">PaddleOCR v5 Mobile</option>
            <option value="ppocr-v4">PaddleOCR v4 Mobile</option>
            <option value="en-mobile">English Mobile</option>
            <option value="ppocr-v2-server">PaddleOCR v2 Server</option>
          </select>
        </div>
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isProcessing || !isInitialized}
          id="file-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="upload-button">
          {isProcessing ? 'Processing...' : 'Select Image'}
        </label>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="preview-section">
          <h3>Preview</h3>
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      {/* OCR Result */}
      {result && (
        <div className="result-section">
          <div className="result-header">
            <h3>Extracted Text</h3>
            <div className="result-actions">
              <button onClick={copyToClipboard}>📋 Copy</button>
              <button onClick={downloadJSON}>💾 Download JSON</button>
            </div>
          </div>
          
          <div className="result-text">
            {result.text || 'No text detected'}
          </div>

          <div className="result-metrics">
            <div className="metric">
              <span className="metric-label">Confidence:</span>
              <span className="metric-value">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Processing Time:</span>
              <span className="metric-value">{result.processingTime}ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Lines Detected:</span>
              <span className="metric-value">{result.lines.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Method:</span>
              <span className="metric-value">{result.method.toUpperCase()}</span>
            </div>
          </div>

          {/* Line-by-line breakdown */}
          <details className="lines-breakdown">
            <summary>Line-by-line breakdown ({result.lines.length} lines)</summary>
            <div className="lines-list">
              {result.lines.map((line, index) => (
                <div key={index} className="line-item">
                  <span className="line-number">#{index + 1}</span>
                  <span className="line-text">{line.text}</span>
                  <span className="line-confidence">
                    {(line.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      <style jsx>{`
        .ocr-component {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ocr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .model-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .model-selector select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .upload-section {
          margin-bottom: 2rem;
        }

        .upload-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .upload-button:hover {
          background: #0056b3;
        }

        .upload-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .progress-bar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          margin: 1rem 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.3s ease;
        }

        .error-message {
          padding: 1rem;
          background: #ffebee;
          color: #d32f2f;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .preview-section {
          margin: 2rem 0;
        }

        .preview-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .result-section {
          margin-top: 2rem;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .result-actions {
          display: flex;
          gap: 0.5rem;
        }

        .result-actions button {
          padding: 0.5rem 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .result-actions button:hover {
          background: #218838;
        }

        .result-text {
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
          white-space: pre-wrap;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .result-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #e8f5e9;
          border-radius: 4px;
        }

        .metric-label {
          color: #666;
          font-size: 14px;
        }

        .metric-value {
          font-weight: 600;
          color: #333;
        }

        .lines-breakdown {
          margin-top: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1rem;
        }

        .lines-breakdown summary {
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .lines-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .line-item {
          display: grid;
          grid-template-columns: 50px 1fr 60px;
          gap: 1rem;
          padding: 0.5rem;
          background: #f9f9f9;
          border-radius: 4px;
          font-size: 14px;
        }

        .line-number {
          color: #666;
          font-family: monospace;
        }

        .line-text {
          word-break: break-word;
        }

        .line-confidence {
          text-align: right;
          color: #28a745;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

/**
 * Usage Example:
 * 
 * import { OCRComponent } from './OCRComponent';
 * 
 * function App() {
 *   return (
 *     <OCRComponent
 *       defaultModel="ppocr-v5"
 *       onResult={(result) => {
 *         console.log('OCR Result:', result);
 *         // Process the result further
 *       }}
 *       processingOptions={{
 *         enableDeskew: true,
 *         enableFallback: true,
 *         confidenceThreshold: 0.7,
 *         language: 'eng'
 *       }}
 *     />
 *   );
 * }
 */