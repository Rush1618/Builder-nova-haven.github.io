import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress defaultProps warnings from recharts in production builds
        if (
          warning.code === "PLUGIN_WARNING" &&
          warning.message.includes("defaultProps")
        ) {
          return;
        }
        warn(warning);
      },
    },
    minify: mode === "production" ? "terser" : false,
    terserOptions:
      mode === "production"
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            mangle: true,
          }
        : undefined,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
}));
