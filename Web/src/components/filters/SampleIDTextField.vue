<template>
  <div style="width: 100%;">
    <v-text-field
      v-model="inputtedSampleID"
      class="sample_id_text_field mt-0"
      prepend-icon="mdi-flask-outline"
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
    inputtedSampleID: {
      get() {
        return this.$store.state.filter.inputtedSampleID
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedSampleID", value)
      }
    }
  }
}
</script>

<style scoped>
.sample_id_text_field >>> .v-input__prepend-outer {
  margin: auto;
  margin-right: 9px;
}
</style>
