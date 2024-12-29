import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import styleImport,{AntdResolve} from 'vite-plugin-style-import';
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // styleImport({
    //   resolves: [
    //     AntdResolve()
    //   ],
    // }),
  ],
  server: {
    port: 1145,
  },
  resolve:{
    alias:{
      "@":resolve(__dirname,'./src')
    }
  },
  build:{
    assetsDir:"static",
    rollupOptions:{
      input:{
        index:resolve(__dirname,"index.html"),
        // project:resolve(__dirname,"project.html")
      },
      output:{
        chunkFileNames:'static/js/[name]-[hash].js',
        entryFileNames:"static/js/[name]-[hash].js",
        assetFileNames:"static/[ext]/name-[hash].[ext]"
      }
    },
  },
})
