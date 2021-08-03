import { State as FilterState } from '@/store/filter'
import { State as SelectorState } from '@/store/selector'
import { State as EntryState } from '@/store/entry'
import { State as UnsubscribeState } from '@/store/unsubscribe'

export interface RootState {
  filter: FilterState
  selector: SelectorState
  entry: EntryState
  unsubscribe: UnsubscribeState
}
