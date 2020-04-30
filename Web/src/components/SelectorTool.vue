<template>
  <div class="d-flex flex-column">
    <required-fields-selector :color="color"></required-fields-selector>
    <div class="d-flex">
      <set-initial-state-button></set-initial-state-button>
      <operate-treeview-button></operate-treeview-button>
    </div>
    <data-type-fields-selector
      class="mt-2"
      :color="color"
    ></data-type-fields-selector>
  </div>
</template>

<script>
import DataTypeFieldsSelector from "~/components/selectors/DataTypeFieldsSelector.vue"
import RequiredFieldsSelector from "~/components/selectors/RequiredFieldsSelector.vue"
import SetInitialStateButton from "~/components/selectors/SetInitialStateButton.vue"
import OperateTreeviewButton from "~/components/selectors/OperateTreeviewButton.vue"

export default {
  components: {
    DataTypeFieldsSelector,
    OperateTreeviewButton,
    RequiredFieldsSelector,
    SetInitialStateButton
  },
  props: {
    color: {
      type: String,
      default: "",
      require: true
    }
  }
}
</script>
