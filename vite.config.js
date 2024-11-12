import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      ViteImageOptimizer({
        png: {
          quality: 100
        },
        jpeg: {
          quality: 100
        },
        jpg: {
          quality: 100
        },
        webp: {
          lossless: true
        }
      })
    ]
  };
});
