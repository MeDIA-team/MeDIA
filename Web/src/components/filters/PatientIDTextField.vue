<template>
  <div style="width: 100%;">
    <v-text-field
      v-model="inputtedPatientID"
      class="patient_id_text_field mt-0"
      prepend-icon="mdi-account-outline"
      single-line
      dense
      clearable
      hide-details
      style="max-width: 620px;"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  computed: {
    inputtedPatientID: {
      get() {
        return this.$store.state.filter.inputtedPatientID
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedPatientID", value)
      }
    }
  }
}
</script>

<style scoped>
.patient_id_text_field >>> .v-input__prepend-outer {
  margin: auto;
  margin-right: 9px;
}
</style>
