import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Front en 5176; backend en 3001. Dos puertos → por eso el server usa CORS.
export default defineConfig({
  plugins: [react()],
  server: { port: 5176, open: true },
});
