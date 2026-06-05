import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({ scale: 1.2 }),
    presetAttributify()
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded inline-block bg-teal-600 text-white hover:bg-teal-700'
  }
})


