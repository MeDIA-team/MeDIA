<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="content in contents"
      :key="content"
      v-model="selectedContentsModel"
      :color="color"
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
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    },
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
      return this.$store.state[`${this.viewType}Init`][this.contentsKey]
    },
    selectedContentsModel: {
      get() {
        return this.$store.state[`${this.viewType}Filter`][
          this.selectedContentsKey
        ]
      },
      set(value) {
        this.$store.commit(this.selectedContentsCommit, value)
      }
    }
  }
}
</script>
