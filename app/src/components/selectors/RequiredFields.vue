<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content.id"
      v-model="selected"
      class="shrink my-0 mr-4 pt-0 align-center"
      :color="color"
      hide-details
      :label="content.label"
      :style="{ width: '200px', height: '52px' }"
      :value="content.id"
    />
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import Vue from 'vue'

export default Vue.extend({
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    contents(): DataTableHeader[] {
      return this.$store.state.selector[this.viewType].requiredFields.contents
    },

    selected: {
      get(): DataTableHeader[] {
        return this.$store.state.selector[this.viewType].requiredFields.selected
      },

      set(value: DataTableHeader[]) {
        this.$store.commit('selector/setValue', {
          viewType: this.viewType,
          fieldType: 'requiredFields',
          valueType: 'selected',
          value,
        })
      },
    },
  },
})
</script>
