import { NuxtConfig } from '@nuxt/types'
import colors from 'vuetify/es5/util/colors'

const config: NuxtConfig = {
  target: 'server',
  ssr: false,
  head: {
    title: 'MeDIA',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  loading: { color: colors.blue.darken2 },
  css: ['~/assets/fonts.css'],
  plugins: ['~/plugins/vuetify.ts', '~/plugins/vuetifyColors.ts'],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-basic-auth-module',
    'nuxt-clipboard2',
  ],
  axios: {
    browserBaseURL: process.env.BROWSER_BASE_URL || undefined,
    headers: {
      get: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.BASIC_AUTH_USER + ':' + process.env.BASIC_AUTH_PASS
          ).toString('base64'),
      },
    },
    proxy: process.env.BROWSER_BASE_URL !== '',
  },
  proxy: {
    '/api/': {
      target: process.env.ES_URL || 'http://db:9200',
      pathRewrite: {
        '^/api/': '/',
      },
    },
  },
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken3,
          secondary: colors.pink.darken3,
          info: colors.grey.darken4,
        },
      },
    },
    defaultAssets: false,
  },
  basic: {
    name: process.env.BASIC_AUTH_USER || 'media',
    pass: process.env.BASIC_AUTH_PASS || 'pass',
    enabled: process.env.BASIC_ENABLED === 'true',
  },
  srcDir: './src/',
  server: {
    host: process.env.NUXT_HOST || '0.0.0.0',
    port: process.env.NUXT_PORT || 8080,
  },
}

export default config
