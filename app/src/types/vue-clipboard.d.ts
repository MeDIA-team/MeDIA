/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'

declare module '@nuxt/vue-app' {
  interface Context {
    $copyText(text: string): void
  }
}

declare module '@nuxt/types' {
  interface Context {
    $copyText(text: string): void
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $copyText(text: string): void
  }
}
