import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export type State = Record<string, never>

export const state = (): State => ({})

export const mutations: MutationTree<State> = {}

export const actions: ActionTree<State, RootState> = {}
