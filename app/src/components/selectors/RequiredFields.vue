<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content.value"
      v-model="selected"
      :color="color"
      :label="content.text"
      :value="content.value"
      class="shrink my-0 mr-4 pt-0 align-center"
      hide-details
      style="width: 200px; height: 52px"
    />
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TypedStore } from '@/store'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = {
  color: string
  contents: DataTableHeader[]
  selected: string[]
}

type Props = {
  viewType: string
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
  },
  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
    contents() {
      return (this.$store as TypedStore).state.selector[
        this.viewType as 'sample' | 'patient'
      ].requiredFields.contents
    },
    selected: {
      get() {
        return this.$store.getters['selector/requiredFieldsSelected']({
          viewType: this.viewType,
        })
      },
      set(value) {
        this.$store.commit('selector/setRequiredFields', {
          viewType: this.viewType,
          value,
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
