<template>
  <v-app>
    <v-main class="background">
      <v-container fluid>
        <div class="d-flex justify-center align-center">
          <v-card
            :color="$colors.grey.lighten5"
            :style="{ borderRadius: '24px', marginTop: '100px' }"
            class="d-flex flex-column align-center"
            elevation="24"
            height="300"
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
                <div class="ml-1" v-text="'Sample View'" />
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
                <div class="ml-1" v-text="'Patient View'" />
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
