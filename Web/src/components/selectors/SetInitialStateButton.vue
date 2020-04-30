<template>
  <v-btn
    color="info"
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
      this.$store.dispatch("selector/initialize")
    }
  }
}
</script>
