/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'

declare module '@nuxt/vue-app' {
  interface Context {
    $dataConfig: Config
  }
}

declare module '@nuxt/types' {
  interface Context {
    $dataConfig: Config
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $dataConfig: Config
  }
}
