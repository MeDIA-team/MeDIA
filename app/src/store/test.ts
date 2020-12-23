/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export const state = () => ({
  test: 'testText',
})

export type State = ReturnType<typeof state>

export const mutations: MutationTree<State> = {
  change(state, text: string) {
    state.test = text
  },
}

export const actions: ActionTree<State, RootState> = {
  changeText({ commit }, payload: string) {
    commit('change', payload)
  },
}
