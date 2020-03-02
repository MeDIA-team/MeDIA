<template>
  <div class="d-flex flex-column">
    <div
      v-for="filterKey in filterKeys"
      :key="filterKey"
      class="d-flex flex-column"
    >
      <div class="d-flex flex-row">
        <div class="d-flex align-center" style="min-width: 130px;">
          <span class="grey--text text--darken-3 font-weight-medium">
            {{ filterKey }}
          </span>
        </div>
        <project-check-box v-if="filterKey === 'Project'"></project-check-box>
        <patient-id-text-field
          v-else-if="filterKey === 'Patient ID'"
        ></patient-id-text-field>
        <sex-check-box v-else-if="filterKey === 'Sex'"></sex-check-box>
        <age-text-field v-else-if="filterKey === 'Age'"></age-text-field>
        <sampling-date-text-field
          v-else-if="filterKey === 'Sampling Date'"
        ></sampling-date-text-field>
        <data-type-check-box
          v-else-if="filterKey === 'Data Type'"
        ></data-type-check-box>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCheckBox from "~/components/filters/ProjectCheckBox"
import PatientIDTextField from "~/components/filters/PatientIDTextField"
import SexCheckBox from "~/components/filters/SexCheckBox"
import AgeTextField from "~/components/filters/AgeTextField"
import SamplingDateTextField from "~/components/filters/SamplingDateTextField"
import DataTypeCheckBox from "~/components/filters/DataTypeCheckBox"

export default {
  components: {
    ProjectCheckBox,
    "patient-id-text-field": PatientIDTextField,
    SexCheckBox,
    AgeTextField,
    SamplingDateTextField,
    DataTypeCheckBox
  },
  data() {
    return {
      filterKeys: [
        "Project",
        "Patient ID",
        "Sex",
        "Age",
        "Sampling Date",
        "Data Type"
      ]
    }
  }
}
</script>
