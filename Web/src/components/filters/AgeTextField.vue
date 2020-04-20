<template>
  <div class="d-flex">
    <v-text-field
      v-model="inputtedBottomAge"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
      style="max-width: 80px;"
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
      dense
      hide-details
      outlined
      single-line
      style="max-width: 80px;"
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
