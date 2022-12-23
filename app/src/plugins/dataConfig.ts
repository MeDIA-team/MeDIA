/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from '@nuxt/types'
import { fetchConfig } from '@/utils/dataFetcher'

declare module 'vue/types/vue' {
  interface Vue {
    $dataConfig: Config
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $dataConfig: Config
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $dataConfig: Config
  }
}

const plugin: Plugin = async (context, inject) => {
  const dataConfig = await fetchConfig(context.$axios)
  inject('dataConfig', dataConfig)
}

export default plugin
