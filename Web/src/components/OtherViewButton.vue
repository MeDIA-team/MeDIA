<template>
  <div>
    <v-btn
      :to="buttonLink"
      color="white"
      nuxt
      outlined
      raise
      @click="transitionToOther"
    >
      <v-icon>{{ buttonIcon }}</v-icon>
      <div class="ml-2">{{ buttonText }}</div>
    </v-btn>
    <v-dialog
      v-model="transition"
      max-width="480"
      persistent
      overlay-opacity="0.9"
    >
      <v-card
        :color="greyLighten5"
        class="d-flex flex-column align-center pt-2"
        height="140"
        style="border-radius: 24px;"
        width="480"
      >
        <v-progress-circular
          :color="transitionColor"
          class="mt-4 mb-2"
          indeterminate
        ></v-progress-circular>
        <p class="text-center info--text title font-regular">
          Now loading the {{ transitionTo }} page...<br />
          Please wait...
        </p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import colors from "vuetify/lib/util/colors"

export default {
  props: {
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    }
  },
  data() {
    return {
      greyLighten5: colors.grey.lighten5,
      transition: false,
      transitionTo: null,
      transitionColor: null
    }
  },
  methods: {
    transitionToOther(event) {
      this.transition = true
      this.transitionTo = this.viewType === "sample" ? "Patient" : "Sample"
      this.transitionColor =
        this.viewType === "sample" ? "secondary" : "primary"
    }
  },
  computed: {
    buttonIcon() {
      return this.viewType === "sample"
        ? "mdi-account-outline"
        : "mdi-flask-outline"
    },
    buttonText() {
      return this.viewType === "sample" ? "To Patient View" : "To Sample View"
    },
    buttonLink() {
      return this.viewType === "sample" ? "/patient" : "/sample"
    }
  }
}
</script>
