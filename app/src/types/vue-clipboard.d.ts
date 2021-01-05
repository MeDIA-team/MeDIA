/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $copyText(text: string): void
  }
}
