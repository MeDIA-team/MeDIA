<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="requiredField in requiredFields"
      :key="requiredField.key"
      v-model="selectedRequiredFields"
      :color="color"
      :label="requiredField.label"
      :value="requiredField.key"
      class="shrink my-0 mr-4 pt-0 align-center"
      hide-details
      style="width: 200px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
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
  computed: {
    requiredFields() {
      return this.$store.state.const.requiredFields.filter(
        (field) => field.key !== "dataType"
      )
    },
    selectedRequiredFields: {
      get() {
        return this.$store.state[`${this.viewType}Selector`].requiredFields
      },
      set(value) {
        this.$store.dispatch(
          `${this.viewType}Selector/updateRequiredFields`,
          value
        )
      }
    }
  }
}
</script>
