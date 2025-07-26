import { Workbox } from 'workbox-window'

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js')
    
    wb.register().then(registration => {
      if (registration) {
        console.log('Service Worker registered with scope:', registration.scope)
        
        // Listen for update events
        wb.addEventListener('waiting', () => {
          console.log('New content is available; please refresh.')
          // Show update notification to user
          if (confirm('New content is available! Click OK to refresh.')) {
            wb.messageSkipWaiting()
            wb.addEventListener('controlling', () => {
              window.location.reload()
            })
          }
        })
      }
    }).catch(error => {
      console.error('Service Worker registration failed:', error)
    })
  }
}

// Model cache management
export async function clearModelCache(): Promise<void> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const cacheNames = await window.caches.keys();
    const modelCaches = cacheNames.filter(name => 
      name.startsWith('onnx-models') || name.startsWith('tesseract-models')
    );
    
    await Promise.all(modelCaches.map(name => window.caches.delete(name)));
    console.log('Model caches cleared');
    
    // Notify service worker to update caches on next request
    navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_MODEL_CACHE' });
  }
}

// Check if app is installable
export function isPWAInstallable(): boolean {
  return 'BeforeInstallPromptEvent' in window
}

// Get PWA install prompt
let deferredPrompt: any = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

export function getPWAInstallPrompt(): any {
  return deferredPrompt
}

export function clearPWAInstallPrompt(): void {
  deferredPrompt = null
}