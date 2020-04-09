<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <div
        v-for="filterKey in filterKeys"
        :key="filterKey"
        class="d-flex flex-column"
      >
        <div class="d-flex">
          <div class="d-flex align-center" style="min-width: 140px;">
            <span class="grey--text text--darken-3 font-weight-medium">
              {{ filterKey }}
            </span>
          </div>
          <project-check-box v-if="filterKey === 'Project'"></project-check-box>
          <patient-id-text-field
            v-else-if="filterKey === 'Patient ID'"
            class="my-2"
          ></patient-id-text-field>
          <sex-check-box v-else-if="filterKey === 'Sex'"></sex-check-box>
          <age-text-field v-else-if="filterKey === 'Age'"></age-text-field>
          <sample-id-text-field
            v-else-if="filterKey === 'Sample ID'"
            class="my-2"
          ></sample-id-text-field>
          <sampling-date-text-field
            v-else-if="filterKey === 'Sampling Date'"
          ></sampling-date-text-field>
          <data-type-chip
            v-else-if="filterKey === 'Data Type'"
            class="mt-2"
          ></data-type-chip>
        </div>
      </div>
    </div>
    <entry-num-chart class="mr-10"></entry-num-chart>
  </div>
</template>

<script>
import ProjectCheckBox from "~/components/filters/ProjectCheckBox"
import PatientIDTextField from "~/components/filters/PatientIDTextField"
import SexCheckBox from "~/components/filters/SexCheckBox"
import AgeTextField from "~/components/filters/AgeTextField"
import SampleIDTextField from "~/components/filters/SampleIDTextField"
import SamplingDateTextField from "~/components/filters/SamplingDateTextField"
import EntryNumChart from "~/components/filters/EntryNumChart"
import DataTypeChip from "~/components/filters/DataTypeChip"

export default {
  components: {
    ProjectCheckBox,
    "patient-id-text-field": PatientIDTextField,
    SexCheckBox,
    AgeTextField,
    "sample-id-text-field": SampleIDTextField,
    SamplingDateTextField,
    EntryNumChart,
    DataTypeChip
  },
  data() {
    return {
      filterKeys: [
        "Project",
        "Patient ID",
        "Sex",
        "Age",
        "Sample ID",
        "Sampling Date",
        "Data Type"
      ]
    }
  }
}
</script>
