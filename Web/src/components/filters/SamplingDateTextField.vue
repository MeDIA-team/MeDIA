<template>
  <div class="d-flex flex-row">
    <v-text-field
      v-model="inputtedBottomSamplingDate"
      class="my-1"
      single-line
      outlined
      dense
      hide-details
      style="max-width: 180px;"
      type="date"
    ></v-text-field>
    <div class="d-flex align-center mx-4">
      <span class="grey--text text--darken-3 font-weight-medium headline">
        ~
      </span>
    </div>
    <v-text-field
      v-model="inputtedUpperSamplingDate"
      class="my-1"
      single-line
      outlined
      dense
      hide-details
      style="max-width: 180px;"
      type="date"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  computed: {
    inputtedBottomSamplingDate: {
      get() {
        return this.$store.state.filter.inputtedBottomSamplingDate
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedBottomSamplingDate", value)
      }
    },
    inputtedUpperSamplingDate: {
      get() {
        return this.$store.state.filter.inputtedUpperSamplingDate
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedUpperSamplingDate", value)
      }
    }
  }
}
</script>

<style></style>
