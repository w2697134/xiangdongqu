import { createReadStream, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const rootAssetsDir = resolve(currentDir, '..', 'assets')

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif'
}

const isInside = (parent: string, child: string) => {
  const diff = relative(parent, child)
  return diff === '' || (diff !== '' && !diff.startsWith('..') && !isAbsolute(diff))
}

const copyDirectory = (source: string, target: string) => {
  if (!existsSync(source)) {
    return
  }

  mkdirSync(target, { recursive: true })

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = resolve(source, entry.name)
    const targetPath = resolve(target, entry.name)

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath)
      continue
    }

    if (entry.isFile()) {
      copyFileSync(sourcePath, targetPath)
    }
  }
}

const serveAssets = (assetRoot: string): Plugin => ({
  name: 'serve-root-assets',
  configureServer(server) {
    server.middlewares.use('/assets', (request, response, next) => {
      const pathname = decodeURIComponent(request.url?.split('?')[0] ?? '/')
      const filePath = resolve(assetRoot, `.${pathname}`)

      if (!isInside(assetRoot, filePath) || !existsSync(filePath) || !statSync(filePath).isFile()) {
        next()
        return
      }

      response.setHeader('Content-Type', mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream')
      createReadStream(filePath).pipe(response)
    })
  },
  configurePreviewServer(server) {
    server.middlewares.use('/assets', (request, response, next) => {
      const pathname = decodeURIComponent(request.url?.split('?')[0] ?? '/')
      const filePath = resolve(assetRoot, `.${pathname}`)

      if (!isInside(assetRoot, filePath) || !existsSync(filePath) || !statSync(filePath).isFile()) {
        next()
        return
      }

      response.setHeader('Content-Type', mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream')
      createReadStream(filePath).pipe(response)
    })
  },
  closeBundle() {
    copyDirectory(assetRoot, resolve(currentDir, 'dist', 'assets'))
  }
})

export default defineConfig({
  plugins: [react(), serveAssets(rootAssetsDir)],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
