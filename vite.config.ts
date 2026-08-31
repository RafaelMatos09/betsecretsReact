import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
    server: {
      port: 5174,
      proxy: {
        // Em dev, o front chama /api/campeonato/a e o Vite repassa para a API no Render
        '/api/campeonato': {
          target: env.VITE_CAMPEONATO_PROXY_TARGET || 'https://campeonatobrasileiroapi.onrender.com',
          changeOrigin: true,
          rewrite: (proxyPath) => proxyPath.replace(/^\/api\/campeonato/, ''),
        },
      },
    },
  }
})
