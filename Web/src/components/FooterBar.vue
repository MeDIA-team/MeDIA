<template>
  <v-footer app :color="color" padless absolute height="30px">
    <div
      class="d-flex align-center justify-center"
      style="width: 100%; height: 100%;"
    >
      <div>
        <span class="block text-center caption white--text">
          {{ text }}
        </span>
      </div>
    </div>
  </v-footer>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "",
      require: true
    },
    text: {
      type: String,
      default: "",
      require: true
    }
  }
}
</script>
