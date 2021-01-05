<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content"
      v-model="selected"
      :color="color"
      :label="content"
      :value="content"
      class="shrink my-0 mr-12 pt-0 align-center"
      hide-details
      style="height: 52px"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TypedStore } from '@/store'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = {
  color: string
  contents: string[]
  selected: string[]
}

type Props = {
  viewType: string
  contentKey: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
    contentKey: {
      type: String,
      required: true,
    },
  },

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
    contents() {
      return (this.$store as TypedStore).state.filter[
        this.viewType as 'sample' | 'patient'
      ][this.contentKey as 'projects' | 'sexes' | 'diseases'].contents
    },
    selected: {
      get() {
        return (this.$store as TypedStore).state.filter[
          this.viewType as 'sample' | 'patient'
        ][this.contentKey as 'projects' | 'sexes' | 'diseases'].selected
      },
      set(value: string[]) {
        this.$store.commit('filter/setFilterCheckBoxField', {
          viewType: this.viewType,
          value,
          contentKey: this.contentKey,
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
