import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Register service worker manually to ensure correct scope
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const basePath = window.location.pathname.includes('/client-ocr') ? '/client-ocr' : ''
    navigator.serviceWorker.register(`${basePath}/sw.js`, { 
      scope: `${basePath}/` 
    }).then(registration => {
      console.log('SW registered: ', registration)
    }).catch(error => {
      console.log('SW registration failed: ', error)
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
