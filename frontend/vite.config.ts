import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Quản Lý Khu Phố',
        short_name: 'Khu Phố',
        description: 'Hệ thống quản lý dân cư Tổ 56 & 57',
        theme_color: '#ffffff',
        background_color: '#f9fafb',
        display: 'standalone', // Chạy full màn hình, giấu thanh trình duyệt
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});