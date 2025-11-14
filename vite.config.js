import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'copy-htaccess',
      apply: 'build',
      writeBundle() {
        const source = path.resolve(__dirname, '.htaccess')
        const dest = path.resolve(__dirname, 'dist/.htaccess')
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, dest)
        }
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 10000
  }
})