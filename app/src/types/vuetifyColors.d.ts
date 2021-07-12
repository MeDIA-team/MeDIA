/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import Colors from 'vuetify/types'

declare module '@nuxt/vue-app' {
  interface Context {
    $colors: Colors
  }
}

declare module '@nuxt/types' {
  interface Context {
    $colors: Colors
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $colors: Colors
  }
}
