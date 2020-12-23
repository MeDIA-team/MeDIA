import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import colors from 'vuetify/lib/util/colors'
import Colors from 'vuetify/types'

declare module 'vue/types/vue' {
  interface Vue {
    $colors: Colors
  }
}

export default (_context: Context, inject: Inject): void => {
  inject('colors', colors)
}
