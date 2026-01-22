import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 업데이트 시 사용자에게 즉시 반영
      manifest: {
        name: 'Knit Doa',
        short_name: 'Knit Doa', // 홈 화면에 표시되는 이름
        description: '뜨개질 도안 제작 및 판매 플랫폼',
        theme_color: '#ffffff', // 앱 테마 색상

        /* splash screen */
        background_color: '#121212',
        display: 'standalone', // 주소창 X

        icons: [ // ~(root): public
          {
            src: '/icons/pwa_icons/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa_icons/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/pwa_icons/maskable_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ]
      }
    })
  ],
  server : {
    allowedHosts: [
      'eduardo-impregnable-electrostatically.ngrok-free.dev'
    ],
  },
})
