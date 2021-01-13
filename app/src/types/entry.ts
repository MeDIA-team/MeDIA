export type Entry = {
  projectID: string
  projectName: string
  projectPatientID: string
  patientID: string
  sex: string
  age: string | number
  disease: string
  sampleID: string
  samplingDate: string
  [key: string]: string | number | boolean
}

export type SampleEntry = {
  sampleID: string
  samplingDate: string
  dataTypes: {
    name: string
    [key: string]: string | number
  }[]
  patientID: string
  sex: string
  age: number
  disease: string
  projects: {
    projectID: string
    projectName: string
  }[]
  projectPatientIDs: string[]
}

export type PatientEntry = {
  patientID: string
  projects: {
    projectID: string
    projectName: string
  }[]
  projectPatientIDs: string[]
  samples: {
    sampleID: string
    samplingDate: string
    dataTypes: {
      name: string
      [key: string]: string | number
    }[]
    sex: string
    age: number
    disease: string
  }[]
}

type TermQuery = {
  term: Record<string, string>
}

type TermsQuery = {
  terms: {
    [key: string]: string[]
  }
}

type RangeQuery = {
  range: {
    [key: string]: {
      gte: string | number | null
      lte: string | number | null
    }
  }
}

type NestedQuery = {
  nested: {
    path: string
    query: TermQuery | TermsQuery
  }
}

export type NestedFilterQuery = {
  nested: {
    path: string
    query: {
      bool: {
        filter: Array<TermQuery | TermsQuery | RangeQuery | NestedQuery>
      }
    }
  }
}

export type SampleFilterQuery = {
  bool: {
    filter: Array<TermsQuery | RangeQuery | NestedQuery>
  }
}

export type PatientFilterQuery = {
  bool: {
    filter: Array<TermsQuery | RangeQuery | NestedQuery | NestedFilterQuery>
  }
}
