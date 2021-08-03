interface DataEntry {
  sampleId: string
  patientId: string
  [k: string]: unknown
}

interface SampleEntry {
  sampleId: string
  patientId: string
  dataTypes: {
    name: string
    [k: string]: unknown
  }[]
  [k: string]: unknown
}

interface PatientEntry {
  patientId: string
  samples: {
    sampleId: string
    dataTypes: {
      name: string
      [k: string]: unknown
    }[]
    [k: string]: unknown
  }[]
}

interface TermQuery {
  term: Record<string, string>
}

interface TermsQuery {
  terms: {
    [key: string]: string[]
  }
}

interface RangeQuery {
  range: {
    [key: string]: {
      gte: string | number | null
      lte: string | number | null
    }
  }
}

interface NestedQuery {
  nested: {
    path: string
    query: {
      bool: {
        filter: Array<TermQuery | TermsQuery | RangeQuery | NestedQuery>
      }
    }
  }
}

interface FilterQuery {
  bool: {
    filter: Array<TermQuery | TermsQuery | RangeQuery | NestedQuery>
  }
}
