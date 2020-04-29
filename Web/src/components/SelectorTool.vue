<template>
  <div class="d-flex flex-column">
    <required-fields-selector
      :color="color"
      :view-type="viewType"
    ></required-fields-selector>
    <div class="d-flex">
      <set-initial-state-button
        :view-type="viewType"
      ></set-initial-state-button>
      <operate-treeview-button :view-type="viewType"></operate-treeview-button>
    </div>
    <data-type-fields-selector
      class="mt-2"
      :color="color"
      :view-type="viewType"
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
  }
}
</script>
