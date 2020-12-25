<template>
  <div class="d-flex flex-column">
    <required-fields :view-type="viewType" />
    <div class="d-flex">
      <reset-selector-button :view-type="viewType" />
      <operate-treeview-button :view-type="viewType" />
    </div>
    <data-type-fields class="mt-2" :view-type="viewType" />
  </div>
</template>

<script lang="ts">
import DataTypeFields from '@/components/selectors/DataTypeFields.vue'
import OperateTreeviewButton from '@/components/selectors/OperateTreeviewButton.vue'
import RequiredFields from '@/components/selectors/RequiredFields.vue'
import ResetSelectorButton from '@/components/selectors/ResetSelectorButton.vue'
import Vue from 'vue'

import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = Record<string, never>

type Props = {
  viewType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  components: {
    DataTypeFields,
    OperateTreeviewButton,
    RequiredFields,
    ResetSelectorButton,
  },

  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },
}

export default Vue.extend(options)
</script>
