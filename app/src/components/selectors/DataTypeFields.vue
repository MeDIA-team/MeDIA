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
      rounded
      selectable
      selection-type="leaf"
    />
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'
import { TreeviewItem } from '@/store/selector'

interface Computed {
  viewType: string
  color: string
  contents: TreeviewItem[]
  selected: TreeviewItem[]
  opened: TreeviewItem[]
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
      return this.$store.state.selector[this.viewType].dataTypeFields.contents
    },

    selected: {
      get() {
        return this.$store.state.selector[this.viewType].dataTypeFields.selected
      },

      set(value) {
        this.$store.commit('selector/setValue', {
          viewType: this.viewType,
          fieldType: 'dataTypeFields',
          valueType: 'selected',
          value,
        })
      },
    },

    opened: {
      get() {
        return this.$store.state.selector[this.viewType].dataTypeFields.opened
      },

      set(value) {
        this.$store.commit('selector/setValue', {
          viewType: this.viewType,
          fieldType: 'dataTypeFields',
          valueType: 'opened',
          value,
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
