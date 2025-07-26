// Get the base URL for the application
// This handles both development and production (GitHub Pages) environments
export function getBasePath(): string {
  // In production (GitHub Pages), we need to include the repository name
  if (window.location.hostname === 'siva-sub.github.io') {
    return '/client-ocr'
  }
  
  // In development or other deployments, use the root
  return ''
}

export function getModelPath(relativePath: string): string {
  const basePath = getBasePath()
  return `${basePath}${relativePath}`
}

export function getAssetPath(relativePath: string): string {
  const basePath = getBasePath()
  return `${basePath}${relativePath}`
}