<template>
  <div>
    <required-fields-selector></required-fields-selector>
    <data-type-fields-selector class="mt-2"></data-type-fields-selector>
  </div>
</template>

<script>
import RequiredFieldsSelector from "~/components/selectors/RequiredFieldsSelector.vue"
import DataTypeFieldsSelector from "~/components/selectors/DataTypeFieldsSelector.vue"

export default {
  components: {
    RequiredFieldsSelector,
    DataTypeFieldsSelector
  }
}
</script>
