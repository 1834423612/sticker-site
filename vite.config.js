import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools' // 导入 Vite DevTools 插件
import { VitePWA } from 'vite-plugin-pwa' // 导入 Vite PWA 插件
import path from 'path' // 导入 Node.js 的 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueDevTools(),
    vue(),
    VitePWA({
      includeAssets: [
        // 非直接加载，但是需要预缓存的内容
        'vite.svg'
      ],
      manifest: {
        name: 'sticker-site',
        short_name: 'Emoji',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            // 缓存所有以指定域名为前缀的 API 请求
            urlPattern: new RegExp('^https://sapi\\.kjchmc\\.cn/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
    }),
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

