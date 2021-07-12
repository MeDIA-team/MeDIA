import { Context } from '@nuxt/types'
import { fetchConfig } from '@/utils/dataFetcher'
import { Inject } from '@nuxt/types/app'

export default async (context: Context, inject: Inject): Promise<void> => {
  const dataConfig = await fetchConfig(context.$axios)
  inject('dataConfig', dataConfig)
}
