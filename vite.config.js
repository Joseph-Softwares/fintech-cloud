import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: ['.gitpod.io'],
    host: true
  }
})