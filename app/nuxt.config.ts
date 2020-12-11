import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  ssr: false,
  srcDir: './src/',
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
}

export default config
