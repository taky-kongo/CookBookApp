import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Écoute sur toutes les adresses, équivalent à --host
    port: 5178, // Le port sur lequel Vite doit tourner
    // Nécessaire pour que le HMR fonctionne correctement avec Docker
    hmr: {
      clientPort: 5178,
    },
  },
})
