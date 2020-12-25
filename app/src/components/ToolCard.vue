<template>
  <div>
    <v-card color="white">
      <v-tabs v-model="selectedTabIndex" :color="color" class="pl-4">
        <v-tab
          v-for="tabKey in tabKeys"
          :key="tabKey"
          :color="color"
          class="subtitle-1"
        >
          {{ tabKey }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="selectedTabIndex">
        <v-tab-item>
          <filter-tool :view-type="viewType" class="px-10 py-4" />
        </v-tab-item>
        <v-tab-item>
          <selector-tool :view-type="viewType" class="px-10 py-4" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import FilterTool from '@/components/FilterTool.vue'
import SelectorTool from '@/components/SelectorTool.vue'
import Vue from 'vue'

type Data = {
  selectedTabIndex: number
  tabKeys: string[]
}

type Methods = Record<string, never>

type Computed = {
  color: string
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
  components: { FilterTool, SelectorTool },
  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },

  data() {
    return {
      selectedTabIndex: 0,
      tabKeys: ['Filter', 'Selector'],
    }
  },

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },
}

export default Vue.extend(options)
</script>
