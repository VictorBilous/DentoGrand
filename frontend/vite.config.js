import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// В режиме разработки запросы к API проксируются на ASP.NET Core (порт 5000).
// Сборка (npm run build) кладётся прямо в wwwroot бэкенда.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000'
    }
  },
  build: {
    outDir: '../backend/DentoGrand.Api/wwwroot',
    emptyOutDir: true
  }
});
