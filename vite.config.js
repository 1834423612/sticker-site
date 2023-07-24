import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 导入 Node.js 的 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  //全局引入
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: '@import "@/style/style.scss";',
  //     }
  //   }
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 将 @ 别名指向 src 目录的绝对路径
    }
  }
});

