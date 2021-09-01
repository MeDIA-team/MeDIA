interface CheckboxField {
  id: string
  label: string
  form: {
    type: 'checkbox'
  }
  type: 'string'
}

interface ChipField {
  id: string
  label: string
  form: {
    type: 'chip'
    logic: 'OR' | 'AND'
    boxWidth?: string
    boxLabel?: string
  }
  type: 'string'
}

interface TextField {
  id: string
  label: string
  form: {
    type: 'text'
    boxWidth?: string
  }
  type: 'integer' | 'date'
}

interface SelectorField {
  id: string
  label: string
  child?: SelectorField[]
}

interface Config {
  filter: {
    fields: Array<CheckboxField | ChipField | TextField>
  }
  selector: {
    dataAvailabilityLabel: string
    dataType: Array<SelectorField>
  }
}
