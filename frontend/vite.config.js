import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '../backend/static', // собираем прямо в папку бэкенда
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
});
