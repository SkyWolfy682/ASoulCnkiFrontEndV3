import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import styleImport from 'vite-plugin-style-import'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false,
        }),
      ],
    }),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`
          },
        },
      ],
    }),
    VitePWA({
      mode: 'development',
      base: '/',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      workbox: {
        disableDevLogs: process.env.NODE_ENV === 'production',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/asoulcnki.asia\/v1\/api\/ranking\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'asoulcnki-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'asoulcnki-static-style-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 31,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: '枝网查重',
        short_name: '枝网查重',
        theme_color: '#60A5FA',
        background_color: '#FFFFFF',
        description: 'A-Soul 小作文查重',
        start_url: '/',
        lang: 'zh-Hans-CN',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/v1': 'https://asoulcnki.asia/v1',
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
