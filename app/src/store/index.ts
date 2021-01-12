import { State as FilterState } from '@/store/filter'
import { State as EntryState } from '@/store/entry'
import { State as SelectorState } from '@/store/selector'
import { Store } from 'vuex/types'

export type RootState = {
  filter: FilterState
  selector: SelectorState
  entry: EntryState
}

export type TypedStore = Store<RootState>
