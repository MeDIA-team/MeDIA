import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { fetchConfig } from '@/utils/dataFetcher'

export default async (context: Context, inject: Inject): Promise<void> => {
  const dataConfig = await fetchConfig(context.$axios)
  inject('dataConfig', dataConfig)
}
