import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
         '@shared': resolve('src/shared')
      }
    },
    plugins: [ UnoCSS(),vue(), AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] }
        ],
        dts: 'src/auto-imports.d.ts'
      }), Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({ prefix: 'i' })
        ],
        dts: 'src/components.d.ts'
      }),
      Icons({ autoInstall: true })]
  }
})
