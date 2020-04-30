<template>
  <div class="d-flex">
    <v-text-field
      v-model="bottomModel"
      :color="color"
      :style="{ minWidth: boxWidth, maxWidth: boxWidth }"
      :type="fieldType"
      class="my-1"
      dense
      hide-details
      outlined
      single-line
    ></v-text-field>
    <div class="d-flex align-center mx-4">
      <span class="font-weight-medium headline info--text">
        ~
      </span>
    </div>
    <v-text-field
      v-model="upperModel"
      :color="color"
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
    color: {
      type: String,
      default: "",
      require: true
    },
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
