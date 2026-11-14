import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vitest: entorno de navegador simulado (jsdom) para probar componentes
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
