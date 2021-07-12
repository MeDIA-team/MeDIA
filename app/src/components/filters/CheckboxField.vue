<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content"
      v-model="selected"
      :color="color"
      :label="content"
      :style="{ height: '52px' }"
      :value="content"
      class="shrink my-0 mr-12 pt-0 align-center"
      hide-details
    />
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

interface Computed {
  viewType: string
  color: string
  contents: string[]
  selected: string[]
}

interface Props {
  id: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Computed,
  Props
> = {
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

    contents() {
      return (
        this.$store.state.filter[this.viewType].fields[this.id].contents || []
      )
    },

    selected: {
      get() {
        return (
          this.$store.state.filter[this.viewType].fields[this.id].selected || []
        )
      },

      set(value: string[]) {
        this.$store.commit('filter/setValue', {
          viewType: this.viewType,
          id: this.id,
          formType: 'checkbox',
          value: { selected: value },
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
