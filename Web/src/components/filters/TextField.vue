<template>
  <div class="d-flex">
    <v-text-field
      v-model="bottomModel"
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="fieldType"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
    ></v-text-field>
    <div class="d-flex align-center mx-4">
      <span class="grey--text text--darken-3 font-weight-medium headline">
        ~
      </span>
    </div>
    <v-text-field
      v-model="upperModel"
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="fieldType"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
    ></v-text-field>
  </div>
</template>

<script>
export default {
  props: {
    inputtedBottomValueKey: {
      type: String,
      default: "",
      require: true
    },
    inputtedBottomValueCommit: {
      type: String,
      default: "",
      require: true
    },
    inputtedUpperValueKey: {
      type: String,
      default: "",
      require: true
    },
    inputtedUpperValueCommit: {
      type: String,
      default: "",
      require: true
    },
    boxWidth: {
      type: String,
      default: "",
      require: true
    },
    fieldType: {
      type: String,
      default: "",
      require: true
    }
  },
  computed: {
    bottomModel: {
      get() {
        return this.$store.state.filter[this.inputtedBottomValueKey]
      },
      set(value) {
        this.$store.commit(this.inputtedBottomValueCommit, value)
      }
    },
    upperModel: {
      get() {
        return this.$store.state.filter[this.inputtedUpperValueKey]
      },
      set(value) {
        this.$store.commit(this.inputtedUpperValueCommit, value)
      }
    }
  }
}
</script>
