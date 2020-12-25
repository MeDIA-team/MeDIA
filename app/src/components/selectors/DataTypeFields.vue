<template>
  <div>
    <span class="info--text title" v-text="'Data Type'" />
    <v-treeview
      v-model="selected"
      :color="color"
      :items="contents"
      :open.sync="opened"
      :selected-color="color"
      class="info--text"
      dense
      hoverable
      return-object
      rounded
      selectable
      selection-type="independent"
    />
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TreeviewItem } from '@/store/selector'
import { TypedStore } from '@/store'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = {
  color: string
  contents: TreeviewItem[]
  selected: TreeviewItem[]
  opened: TreeviewItem[]
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
      ].dataTypeFields.contents
    },
    selected: {
      get() {
        return (this.$store as TypedStore).state.selector[
          this.viewType as 'sample' | 'patient'
        ].dataTypeFields.selected
      },
      set(value) {
        this.$store.commit('selector/setDataTypeFields', {
          viewType: this.viewType,
          type: 'selected',
          value,
        })
      },
    },
    opened: {
      get() {
        return (this.$store as TypedStore).state.selector[
          this.viewType as 'sample' | 'patient'
        ].dataTypeFields.opened
      },
      set(value) {
        this.$store.commit('selector/setDataTypeFields', {
          viewType: this.viewType,
          type: 'opened',
          value,
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
