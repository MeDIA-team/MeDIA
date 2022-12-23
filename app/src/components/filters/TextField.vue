<template>
  <div class="d-flex">
    <v-text-field
      v-model="bottom"
      class="my-1"
      clearable
      :color="color"
      dense
      hide-details
      outlined
      single-line
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="boxType"
    />
    <div class="d-flex align-center mx-4">
      <span class="font-weight-medium headline info--text" v-text="' ~ '" />
    </div>
    <v-text-field
      v-model="upper"
      class="my-1"
      clearable
      :color="color"
      dense
      hide-details
      outlined
      single-line
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="boxType"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const BOX_WIDTH = '200px' // age: 80px, date: 200px

export default Vue.extend({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    bottom: {
      get() {
        return this.$store.state.filter[this.viewType].fields[this.id].bottom
      },

      set(value: string | number) {
        this.$store.commit('filter/setValue', {
          viewType: this.viewType,
          id: this.id,
          formType: 'text',
          value: { bottom: value },
        })
      },
    },

    upper: {
      get() {
        return this.$store.state.filter[this.viewType].fields[this.id].upper
      },

      set(value: string | number) {
        this.$store.commit('filter/setValue', {
          viewType: this.viewType,
          id: this.id,
          formType: 'text',
          value: { upper: value },
        })
      },
    },

    field() {
      return this.$dataConfig.filter.fields.filter(
        (field) => field.id === this.id
      )[0] as TextField
    },

    boxType() {
      return this.field?.type === 'integer' ? 'number' : 'date'
    },

    boxWidth() {
      return this.field?.form.boxWidth || BOX_WIDTH
    },
  },
})
</script>
