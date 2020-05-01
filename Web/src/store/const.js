export const state = () => ({
  footerText: "",
  requiredFields: [
    {
      key: "projectID",
      label: "Project ID",
      width: 125
    },
    {
      key: "projectName",
      label: "Project Name",
      width: 105
    },
    {
      key: "projectPatientID",
      label: "Project Patient ID",
      width: 105
    },
    {
      key: "patientID",
      label: "Patient ID",
      width: 105
    },
    {
      key: "sex",
      label: "Sex",
      width: 75
    },
    {
      key: "age",
      label: "Age",
      width: 75
    },
    { key: "disease", label: "Disease", width: 105 },
    { key: "sampleID", label: "Sample ID", width: 105 },
    { key: "samplingDate", label: "Sampling Date", width: 105 },
    { key: "dataType", label: "Data Type" }
  ],
  chartLabel: {
    sampleID: "Number of displayed samples",
    patientID: "Number of displayed patients"
  },
  itemsPerPage: [10, 30, 100],
  snackbarTimeout: 1000,
  elasticsearchSize: 10000000,
  dumpChunkSize: 100
})
