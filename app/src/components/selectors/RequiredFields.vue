<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content.id"
      v-model="selected"
      :color="color"
      :label="content.label"
      :style="{ width: '200px', height: '52px' }"
      :value="content.id"
      class="shrink my-0 mr-4 pt-0 align-center"
      hide-details
    />
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

interface Computed {
  viewType: string
  color: string
  contents: DataTableHeader[]
  selected: DataTableHeader[]
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Computed,
  Record<string, never>
> = {
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    contents() {
      return this.$store.state.selector[this.viewType].requiredFields.contents
    },

    selected: {
      get() {
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
}

export default Vue.extend(options)
</script>
