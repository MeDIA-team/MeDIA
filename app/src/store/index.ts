import { State as FilterState } from '@/store/filter'
import { State as PatientState } from '@/store/patient'
import { State as SampleState } from '@/store/sample'
import { State as SelectorState } from '@/store/selector'
import { Store } from 'vuex/types'

export type RootState = {
  sample: SampleState
  patient: PatientState
  filter: FilterState
  selector: SelectorState
}

export type TypedStore = Store<RootState>
