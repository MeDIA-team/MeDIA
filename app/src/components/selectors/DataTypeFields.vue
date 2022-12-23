<template>
  <div>
    <span class="info--text title" v-text="'Data Type'" />
    <v-treeview
      v-model="selected"
      class="info--text"
      :color="color"
      dense
      hoverable
      :items="contents"
      :open.sync="opened"
      rounded
      selectable
      :selected-color="color"
      selection-type="leaf"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TreeviewItem } from '@/store/selector'

export default Vue.extend({
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    contents(): TreeviewItem[] {
      return this.$store.state.selector[this.viewType].dataTypeFields.contents
    },

    selected: {
      get(): TreeviewItem[] {
        return this.$store.state.selector[this.viewType].dataTypeFields.selected
      },

      set(value: TreeviewItem[]) {
        this.$store.commit('selector/setValue', {
          viewType: this.viewType,
          fieldType: 'dataTypeFields',
          valueType: 'selected',
          value,
        })
      },
    },

    opened: {
      get(): TreeviewItem[] {
        return this.$store.state.selector[this.viewType].dataTypeFields.opened
      },

      set(value: TreeviewItem[]) {
        this.$store.commit('selector/setValue', {
          viewType: this.viewType,
          fieldType: 'dataTypeFields',
          valueType: 'opened',
          value,
        })
      },
    },
  },
})
</script>
