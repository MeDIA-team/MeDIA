<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content"
      v-model="selectedContentsModel"
      :label="content"
      :value="content"
      class="shrink my-0 mr-6 pt-0 align-center"
      hide-details
      style="width: 200px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    contentsKey: {
      type: String,
      default: "",
      require: true
    },
    selectedContentsKey: {
      type: String,
      default: "",
      require: true
    },
    selectedContentsCommit: {
      type: String,
      default: "",
      require: true
    }
  },
  computed: {
    contents() {
      return this.$store.state.init[this.contentsKey]
    },
    selectedContentsModel: {
      get() {
        return this.$store.state.filter[this.selectedContentsKey]
      },
      set(value) {
        this.$store.commit(this.selectedContentsCommit, value)
      }
    }
  }
}
</script>
