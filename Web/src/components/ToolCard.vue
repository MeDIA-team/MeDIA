<template>
  <v-card color="white">
    <v-tabs v-model="selectedTabIndex" color="primary" class="pl-4">
      <v-tab
        v-for="tabKey in tabKeys"
        :key="tabKey"
        color="primary"
        class="subtitle-1"
      >
        {{ tabKey }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTabIndex">
      <v-tab-item>
        <filter-tool class="px-10 pb-4"></filter-tool>
      </v-tab-item>
      <v-tab-item>
        <selector-tool class="px-10 pb-4"></selector-tool>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import FilterTool from "~/components/FilterTool"
import SelectorTool from "~/components/SelectorTool"

export default {
  components: { FilterTool, SelectorTool },
  data() {
    return {
      selectedTabIndex: null,
      tabKeys: ["Filter", "Selector"]
    }
  }
}
</script>
