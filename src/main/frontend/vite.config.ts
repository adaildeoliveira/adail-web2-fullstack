import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // A API permite esta origem no CORS. Não trocar a porta automaticamente.
  server: { host: 'localhost', port: 5173, strictPort: true },
  preview: { host: 'localhost', port: 5173, strictPort: true },
});
