import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate PWA icons
const sizes = [192, 512];
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(0, 0, size, size);
  
  // OCR Icon - simple document with text lines
  const margin = size * 0.15;
  const docWidth = size - (margin * 2);
  const docHeight = size - (margin * 2);
  
  // Document background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(margin, margin, docWidth, docHeight);
  
  // Text lines representing OCR
  ctx.fillStyle = '#333333';
  const lineHeight = size * 0.05;
  const lineGap = size * 0.08;
  const startY = margin + size * 0.2;
  
  for (let i = 0; i < 3; i++) {
    const y = startY + (i * lineGap);
    const lineWidth = docWidth * (0.8 - i * 0.1); // Varying line widths
    ctx.fillRect(margin + docWidth * 0.1, y, lineWidth, lineHeight);
  }
  
  // OCR text
  ctx.font = `bold ${size * 0.12}px Arial`;
  ctx.fillStyle = '#4A90E2';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OCR', size / 2, size * 0.75);
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `pwa-${size}x${size}.png`), buffer);
  console.log(`Generated pwa-${size}x${size}.png`);
});

// Also copy as apple-touch-icon
const appleIcon = createCanvas(180, 180);
const appleCtx = appleIcon.getContext('2d');

// Same design for Apple icon
appleCtx.fillStyle = '#4A90E2';
appleCtx.fillRect(0, 0, 180, 180);

const appleMargin = 180 * 0.15;
const appleDocWidth = 180 - (appleMargin * 2);
const appleDocHeight = 180 - (appleMargin * 2);

appleCtx.fillStyle = '#FFFFFF';
appleCtx.fillRect(appleMargin, appleMargin, appleDocWidth, appleDocHeight);

appleCtx.fillStyle = '#333333';
const appleLineHeight = 180 * 0.05;
const appleLineGap = 180 * 0.08;
const appleStartY = appleMargin + 180 * 0.2;

for (let i = 0; i < 3; i++) {
  const y = appleStartY + (i * appleLineGap);
  const lineWidth = appleDocWidth * (0.8 - i * 0.1);
  appleCtx.fillRect(appleMargin + appleDocWidth * 0.1, y, lineWidth, appleLineHeight);
}

appleCtx.font = 'bold 22px Arial';
appleCtx.fillStyle = '#4A90E2';
appleCtx.textAlign = 'center';
appleCtx.textBaseline = 'middle';
appleCtx.fillText('OCR', 90, 135);

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon.toBuffer('image/png'));
console.log('Generated apple-touch-icon.png');

// Create a simple favicon.ico
const favicon = createCanvas(32, 32);
const favCtx = favicon.getContext('2d');

favCtx.fillStyle = '#4A90E2';
favCtx.fillRect(0, 0, 32, 32);
favCtx.fillStyle = '#FFFFFF';
favCtx.fillRect(6, 6, 20, 20);
favCtx.fillStyle = '#333333';
favCtx.fillRect(9, 10, 14, 2);
favCtx.fillRect(9, 15, 11, 2);
favCtx.fillRect(9, 20, 8, 2);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon.toBuffer('image/png'));
console.log('Generated favicon.ico');