import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Quản Lý Khu Phố',
        short_name: 'Khu Phố',
        description: 'Hệ thống quản lý dân cư Tổ 56 & 57',
        theme_color: '#ffffff',
        background_color: '#f9fafb',
        display: 'standalone' // Vẫn giữ dòng này để App chạy toàn màn hình
      }
    })
  ],
});