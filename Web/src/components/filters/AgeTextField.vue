<template>
  <div class="d-flex flex-row">
    <v-text-field
      v-model="inputtedBottomAge"
      class="my-1"
      single-line
      outlined
      dense
      hide-details
      style="max-width: 70px;"
      type="number"
    ></v-text-field>
    <div class="d-flex align-center mx-4">
      <span class="grey--text text--darken-3 font-weight-medium headline">
        ~
      </span>
    </div>
    <v-text-field
      v-model="inputtedUpperAge"
      class="my-1"
      single-line
      outlined
      dense
      hide-details
      style="max-width: 70px;"
      type="number"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  computed: {
    inputtedBottomAge: {
      get() {
        return this.$store.state.filter.inputtedBottomAge
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedBottomAge", value)
      }
    },
    inputtedUpperAge: {
      get() {
        return this.$store.state.filter.inputtedUpperAge
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedUpperAge", value)
      }
    }
  }
}
</script>

<style></style>
