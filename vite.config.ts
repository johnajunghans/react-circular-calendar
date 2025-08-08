import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [...configDefaults.coverage.exclude, 'src/main.tsx', 'src/index.ts', 'src/App.tsx']
    }
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ReactCircularCalendar',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'index.es.js' : 'index.umd.cjs',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
