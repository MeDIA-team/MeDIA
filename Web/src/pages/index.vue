<template>
  <v-app>
    <v-content class="background">
      <v-container fluid>
        <div class="d-flex justify-center align-center">
          <v-card
            class="d-flex flex-column align-center"
            color="#f5f5f5"
            elevation="24"
            height="300"
            style="border-radius: 24px; margin-top: 100px;"
            width="480"
          >
            <div class="mt-12">
              <span class="display-3 grey--text text--darken-3">MeDIA</span>
            </div>
            <div class="mt-4">
              <p class="text-center grey--text text--darken-3">
                Integrated Management System for<br />Microbiome Information and
                Clinical Multimodal Data
              </p>
            </div>
            <div class="d-flex mt-2">
              <v-btn
                class="mr-8"
                color="#0D47A1"
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
                color="#880E4F"
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
            class="d-flex flex-column align-center pt-2"
            color="#f5f5f5"
            height="140"
            style="border-radius: 24px;"
            width="480"
          >
            <v-progress-circular
              :color="transitionColor"
              class="mt-4 mb-2"
              indeterminate
            ></v-progress-circular>
            <p class="text-center grey--text text--darken-3 title font-regular">
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
export default {
  data() {
    return {
      transition: false,
      transitionTo: null,
      transitionColor: null
    }
  },
  methods: {
    transitionToSample(event) {
      this.transition = true
      this.transitionTo = "Sample"
      this.transitionColor = "#0D47A1"
    },
    transitionToPatient(event) {
      this.transition = true
      this.transitionTo = "Patient"
      this.transitionColor = "#880E4F"
    }
  }
}
</script>

<style scoped>
.background {
  background: url("~assets/bg.jpg") center center / cover no-repeat;
}
</style>
