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
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import DataTypeFields from '@/components/selectors/DataTypeFields.vue'
import OperateTreeviewButton from '@/components/selectors/OperateTreeviewButton.vue'
import RequiredFields from '@/components/selectors/RequiredFields.vue'
import ResetSelectorButton from '@/components/selectors/ResetSelectorButton.vue'
import Vue from 'vue'

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>
> = {
  components: {
    DataTypeFields,
    OperateTreeviewButton,
    RequiredFields,
    ResetSelectorButton,
  },
}

export default Vue.extend(options)
</script>
