import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Exclude the DICOM image-loader itself so its internal worker scripts are
    // served from node_modules with their original relative paths intact —
    // esbuild pre-bundling would rewrite those paths and break worker startup.
    exclude: ['@cornerstonejs/dicom-image-loader'],

    // The codec CJS files are ONLY imported from inside the excluded worker
    // scripts, so Vite's dependency scanner never discovers them and they get
    // served raw — without the CJS→ESM `default` export interop that esbuild
    // would normally add.  Forcing them into include pre-bundles them here so
    // the worker's `import factory from '…/decodewasmjs'` gets proper ESM.
    include: [
      '@cornerstonejs/codec-libjpeg-turbo-8bit/decodewasmjs',
      '@cornerstonejs/codec-openjpeg/decodewasmjs',
      '@cornerstonejs/codec-charls/decodewasmjs',
      '@cornerstonejs/codec-openjph/wasmjs',
      // dicom-parser ships as a UMD bundle that uses `this` as the global
      // fallback.  In strict-mode ESM `this` is undefined at module top level,
      // so the UMD wrapper crashes with "Cannot read properties of undefined
      // (reading 'zlib')".  Force-including it makes esbuild convert it to
      // proper ESM and apply the package's browser:{zlib:false} condition.
      'dicom-parser',
    ],
  },
  worker: {
    // Emit workers as ES modules so Cornerstone3D's comlink workers load cleanly.
    format: 'es',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/api': resolve(__dirname, './src/api'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/stores': resolve(__dirname, './src/stores'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
