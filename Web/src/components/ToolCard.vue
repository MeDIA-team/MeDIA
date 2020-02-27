<template>
  <v-card color="white">
    <v-tabs v-model="tab" color="primary" class="pl-4">
      <v-tab
        v-for="item in items"
        :key="item"
        color="primary"
        class="subtitle-1"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <tool-filter></tool-filter>
      </v-tab-item>
      <v-tab-item>
        <tool-selector></tool-selector>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ToolFilter from "~/components/ToolFilter"
import ToolSelector from "~/components/ToolSelector"

export default {
  components: { ToolFilter, ToolSelector },
  data() {
    return {
      tab: null,
      items: ["Filter", "Selector"]
    }
  }
}
</script>
