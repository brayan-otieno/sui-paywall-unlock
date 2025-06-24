import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
<<<<<<< HEAD
=======
import process from 'process';
>>>>>>> 139731a (Initial backend implementation and simple authentication)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
=======
  define: {
    'process.env': {},
  },
>>>>>>> 139731a (Initial backend implementation and simple authentication)
}));
