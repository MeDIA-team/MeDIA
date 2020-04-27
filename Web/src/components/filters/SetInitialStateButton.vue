<template>
  <v-btn
    color="secondary"
    max-width="160"
    min-width="160"
    outlined
    @click="setInitialState"
  >
    Set Initial State
  </v-btn>
</template>

<script>
export default {
  methods: {
    setInitialState() {
      this.$store.dispatch("filter/initialize")
    }
  }
}
</script>
