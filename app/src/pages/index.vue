<template>
  <v-app>
    <v-main class="background">
      <v-container fluid>
        <div class="d-flex justify-center align-center">
          <v-card
            class="d-flex flex-column align-center"
            :color="$colors.grey.lighten5"
            elevation="24"
            height="300"
            style="border-radius: 24px; margin-top: 100px"
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
              >
                <v-icon>mdi-account-outline</v-icon>
                <div class="ml-1">Patient View</div>
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>
.background {
  background: url('~assets/bg.jpg') center center / cover no-repeat;
}
</style>
