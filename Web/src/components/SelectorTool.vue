<template>
  <div>
    <default-columns-selector></default-columns-selector>
    <data-type-columns-selector class="mt-2"></data-type-columns-selector>
  </div>
</template>

<script>
import DefaultColumnsSelector from "~/components/selectors/DefaultColumnsSelector.vue"
import DataTypeColumnsSelector from "~/components/selectors/DataTypeColumnsSelector.vue"

export default {
  components: {
    DefaultColumnsSelector,
    DataTypeColumnsSelector
  }
}
</script>
