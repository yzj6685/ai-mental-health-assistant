import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// https://vite.dev/config/
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:1235'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server:{
    proxy:{
      '/api':{
        target: apiProxyTarget,
        changeOrigin:true,
      }
    }
  }
})
