<template>
  <div>
    <default-columns-selector></default-columns-selector>
    <data-types-columns-selector class="mt-2"></data-types-columns-selector>
  </div>
</template>

<script>
import DefaultColumnsSelector from "~/components/selectors/DefaultColumnsSelector.vue"
import DataTypesColumnsSelector from "~/components/selectors/DataTypesColumnsSelector.vue"

export default {
  components: {
    DefaultColumnsSelector,
    DataTypesColumnsSelector
  }
}
</script>
