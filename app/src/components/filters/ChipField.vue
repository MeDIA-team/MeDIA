<template>
  <div>
    <v-autocomplete
      v-model="selected"
      clearable
      :color="color"
      hide-details
      hide-selected
      :items="contents"
      :label="boxLabel"
      multiple
      outlined
      :search-input.sync="searchInput"
      single-line
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      @input="searchInput = null"
    >
      <template #selection="{ item }">
        <v-chip
          close
          :color="color"
          label
          @click:close="remove(item)"
          v-text="item"
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const BOX_WIDTH = '660px'

export default Vue.extend({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      searchInput: null,
    }
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
          formType: 'chip',
          value: { selected: value },
        })
      },
    },

    field() {
      return this.$dataConfig.filter.fields.filter(
        (field) => field.id === this.id
      )[0] as ChipField
    },

    boxWidth() {
      return this.field?.form.boxWidth || BOX_WIDTH
    },

    boxLabel() {
      if (this.field?.form.boxLabel) {
        return this.field?.form.boxLabel
      } else {
        return this.field?.form.logic === 'AND' ? 'must have' : 'is'
      }
    },
  },

  methods: {
    remove(value: string) {
      this.selected = this.selected.filter((ele: string) => ele !== value)
    },
  },
})
</script>
