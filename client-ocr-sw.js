// Service worker registration redirect for GitHub Pages
// This file ensures the service worker is available at the correct scope
self.addEventListener('install', () => {
  // Redirect to the actual service worker in the client-ocr subdirectory
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Import the actual service worker
importScripts('/client-ocr/sw.js');