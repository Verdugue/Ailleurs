import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxys vers les APIs événements (évitent les problèmes CORS depuis le navigateur)
      '/api/tm': {
        target: 'https://app.ticketmaster.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tm/, ''),
      },
      '/api/oa': {
        target: 'https://api.openagenda.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oa/, ''),
      },
    },
  },
})
