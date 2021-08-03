import Vue from 'vue'
import { MutationTree } from 'vuex'

type UnsubscribeFunc = () => void

export type State = {
  sample: UnsubscribeFunc | null
  patient: UnsubscribeFunc | null
}

export const state = (): State => ({
  sample: null,
  patient: null,
})

export const mutations: MutationTree<State> = {
  setValue(
    state,
    payload: {
      viewType: keyof State
      value: UnsubscribeFunc | null
    }
  ) {
    Vue.set(state, payload.viewType, payload.value)
  },
}
