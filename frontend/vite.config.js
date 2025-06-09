import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/personal-finance-system/',  // ✅ 對應 repo 名稱
  plugins: [react()],
})