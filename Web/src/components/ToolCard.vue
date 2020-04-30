<template>
  <div>
    <v-card color="white">
      <v-tabs v-model="selectedTabIndex" :color="color" class="pl-4">
        <v-tab
          v-for="tabKey in tabKeys"
          :key="tabKey"
          class="subtitle-1"
          :color="color"
        >
          {{ tabKey }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="selectedTabIndex">
        <v-tab-item>
          <filter-tool
            :color="color"
            :view-type="viewType"
            class="px-10 py-4"
          ></filter-tool>
        </v-tab-item>
        <v-tab-item>
          <selector-tool :color="color" class="px-10 py-4"></selector-tool>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import FilterTool from "~/components/FilterTool"
import SelectorTool from "~/components/SelectorTool"

export default {
  components: { FilterTool, SelectorTool },
  props: {
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    }
  },
  data() {
    return {
      selectedTabIndex: 0,
      tabKeys: ["Filter", "Selector"]
    }
  }
}
</script>
