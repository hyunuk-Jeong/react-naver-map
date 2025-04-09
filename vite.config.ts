import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-naver-map/', // ✅ GitHub Pages 배포를 위한 base 경로 설정
  server:{
    host:"0.0.0.0",
    port:5173
  }
})
