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
          <filter-tool class="px-10 py-4" />
        </v-tab-item>
        <v-tab-item>
          <selector-tool class="px-10 py-4" />
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

interface Data {
  selectedTabIndex: number
  tabKeys: string[]
}

interface Computed {
  viewType: string
  color: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Record<string, never>,
  Computed,
  Record<string, never>
> = {
  components: {
    FilterTool,
    SelectorTool,
  },

  data() {
    return {
      selectedTabIndex: 0,
      tabKeys: ['Filter', 'Selector'],
    }
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },
}

export default Vue.extend(options)
</script>
