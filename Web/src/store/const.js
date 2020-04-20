export const state = () => ({
  titleText: "MeDIA",
  footerText: "",
  requiredFields: [
    {
      key: "projectID",
      label: "Project ID"
    },
    {
      key: "projectName",
      label: "Project Name"
    },
    {
      key: "patientID",
      label: "Patient ID"
    },
    {
      key: "sex",
      label: "Sex"
    },
    {
      key: "age",
      label: "Age"
    },
    { key: "disease", label: "Disease" },
    { key: "sampleID", label: "Sample ID" },
    { key: "samplingDate", label: "Sampling Date" },
    { key: "dataType", label: "Data Type" }
  ],
  chartLabel: {
    sampleID: "Number of displayed entries",
    patientID: "Number of displayed patients"
  },
  rowsPerPage: [10, 30, 100],
  elasticsearchSize: 100000
})
