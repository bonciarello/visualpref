import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4600'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
