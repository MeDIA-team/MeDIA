<template>
  <v-autocomplete
    v-model="selected"
    :color="color"
    :items="contents"
    :label="boxLabel"
    :search-input.sync="searchInput"
    :style="{ minWidth: fieldWidth, maxWidth: fieldWidth }"
    clearable
    hide-details
    hide-selected
    multiple
    outlined
    single-line
    @input="searchInput = null"
  >
    <template #selection="{ item }">
      <v-chip :color="color" close label @click:close="remove(item)">
        {{ item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'
import { TypedStore } from '@/store'

type Data = {
  searchInput: null | string
}

type Methods = {
  remove(item: string): void
}

type Computed = {
  color: string
  contents: string[]
  selected: string[]
}

type Props = {
  viewType: string
  fieldWidth: string
  contentKey: string
  boxLabel: string
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
    fieldWidth: {
      type: String,
      required: true,
    },
    contentKey: {
      type: String,
      required: true,
    },
    boxLabel: {
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
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
    contents() {
      return (this.$store as TypedStore).state.filter[
        this.viewType as 'sample' | 'patient'
      ][
        this.contentKey as
          | 'patientIDs'
          | 'projectPatientIDs'
          | 'sampleIDs'
          | 'dataTypes'
      ].contents
    },
    selected: {
      get() {
        return (this.$store as TypedStore).state.filter[
          this.viewType as 'sample' | 'patient'
        ][
          this.contentKey as
            | 'patientIDs'
            | 'projectPatientIDs'
            | 'sampleIDs'
            | 'dataTypes'
        ].selected
      },
      set(value: string[]) {
        this.$store.commit('filter/setFilterChipField', {
          viewType: this.viewType,
          value,
          contentKey: this.contentKey,
        })
      },
    },
  },

  methods: {
    remove(item: string) {
      this.selected = this.selected.filter((ele: string) => ele !== item)
    },
  },
}

export default Vue.extend(options)
</script>
