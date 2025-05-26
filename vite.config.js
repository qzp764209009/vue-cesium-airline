import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium({
      // 可选配置
      rebuildCesium: true, // 重新构建 Cesium
      devMinifyCesium: true // 开发环境下压缩 Cesium
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})