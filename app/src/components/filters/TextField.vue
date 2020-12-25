<template>
  <div class="d-flex">
    <v-text-field
      v-model="bottomModel"
      :color="color"
      :rules="[bottomNumberRule(bottomModel)]"
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="textFieldType"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
    />
    <div class="d-flex align-center mx-4">
      <span class="font-weight-medium headline info--text" v-text="' ~ '" />
    </div>
    <v-text-field
      v-model="upperModel"
      :color="color"
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="textFieldType"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
    />
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TypedStore } from '@/store'
import Vue from 'vue'

type Data = {
  bottomNumberRule: (value: number) => string | boolean
}

type Methods = Record<string, never>

type Computed = {
  color: string
  bottomModel: string | number
  upperModel: string | number
}

type Props = {
  viewType: string
  boxWidth: string
  contentKey: string
  textFieldType: string
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
    boxWidth: {
      type: String,
      required: true,
    },
    contentKey: {
      type: String,
      required: true,
    },
    textFieldType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      bottomNumberRule: (value: number) => {
        if (this.textFieldType === 'number' && value < 0) {
          return 'Please enter a value greater than zero.'
        }
        return true
      },
    }
  },

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
    bottomModel: {
      get() {
        return (this.$store as TypedStore).state.filter[
          this.viewType as 'sample' | 'patient'
        ][this.contentKey as 'age' | 'samplingDate'].bottom
      },
      set(value: string | number) {
        this.$store.commit('filter/setFilterTextField', {
          viewType: this.viewType,
          value,
          contentKey: this.contentKey,
          direction: 'bottom',
        })
      },
    },
    upperModel: {
      get() {
        return (this.$store as TypedStore).state.filter[
          this.viewType as 'sample' | 'patient'
        ][this.contentKey as 'age' | 'samplingDate'].upper
      },
      set(value: string | number) {
        this.$store.commit('filter/setFilterTextField', {
          viewType: this.viewType,
          value,
          contentKey: this.contentKey,
          direction: 'upper',
        })
      },
    },
  },
}

export default Vue.extend(options)
</script>
