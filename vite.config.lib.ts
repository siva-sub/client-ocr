import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'react/index': resolve(__dirname, 'src/react.tsx')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'js'
        return entryName === 'index' ? `index.${ext}` : `${entryName}.${ext}`
      }
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/dropzone',
        '@mantine/notifications',
        '@mantine/code-highlight',
        '@tabler/icons-react'
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    },
    target: 'esnext',
    sourcemap: true,
    minify: false
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ]
})