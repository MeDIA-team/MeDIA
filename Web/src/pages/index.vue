<template>
  <v-app>
    <v-content class="background">
      <v-container fluid>
        <div class="d-flex justify-center align-center">
          <v-card
            :color="greyLighten5"
            class="d-flex flex-column align-center"
            elevation="24"
            height="300"
            style="border-radius: 24px; margin-top: 100px;"
            width="480"
          >
            <div class="mt-12">
              <span class="display-3 info--text">MeDIA</span>
            </div>
            <div class="mt-4">
              <p class="text-center info--text">
                Integrated Management System for<br />Microbiome Information and
                Clinical Multimodal Data
              </p>
            </div>
            <div class="d-flex mt-2">
              <v-btn
                class="mr-8"
                color="primary"
                large
                nuxt
                outlined
                raise
                to="/sample"
                width="175"
                @click="transitionToSample"
              >
                <v-icon>mdi-flask-outline</v-icon>
                <div class="ml-1">Sample View</div>
              </v-btn>
              <v-btn
                color="secondary"
                large
                nuxt
                outlined
                raise
                to="/patient"
                width="175"
                @click="transitionToPatient"
              >
                <v-icon>mdi-account-outline</v-icon>
                <div class="ml-1">Patient View</div>
              </v-btn>
            </div>
          </v-card>
        </div>
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
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import colors from "vuetify/lib/util/colors"

export default {
  data() {
    return {
      greyLighten5: colors.grey.lighten5,
      transition: false,
      transitionTo: null,
      transitionColor: null
    }
  },
  methods: {
    transitionToSample(event) {
      this.transition = true
      this.transitionTo = "Sample"
      this.transitionColor = "primary"
    },
    transitionToPatient(event) {
      this.transition = true
      this.transitionTo = "Patient"
      this.transitionColor = "secondary"
    }
  }
}
</script>

<style scoped>
.background {
  background: url("~assets/bg.jpg") center center / cover no-repeat;
}
</style>
