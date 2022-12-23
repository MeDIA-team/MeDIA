<template>
  <div class="d-flex flex-column">
    <required-fields />
    <div class="d-flex">
      <reset-selector-button />
      <operate-treeview-button />
    </div>
    <data-type-fields class="mt-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DataTypeFields from '@/components/selectors/DataTypeFields.vue'
import OperateTreeviewButton from '@/components/selectors/OperateTreeviewButton.vue'
import RequiredFields from '@/components/selectors/RequiredFields.vue'
import ResetSelectorButton from '@/components/selectors/ResetSelectorButton.vue'

export default Vue.extend({
  components: {
    DataTypeFields,
    OperateTreeviewButton,
    RequiredFields,
    ResetSelectorButton,
  },
})
</script>
