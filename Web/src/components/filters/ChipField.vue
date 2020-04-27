<template>
  <v-autocomplete
    v-model="selectedContentsModel"
    :items="contents"
    :label="boxLabel"
    :search-input.sync="searchInput"
    :style="{ minWidth: fieldWidth, maxWidth: fieldWidth }"
    clearable
    hide-details
    hide-selected
    multiple
    outlined
    single-line
    @input="searchInput = null"
  >
    <template v-slot:selection="{ item }">
      <v-chip close label @click:close="remove(item)">
        {{ item }}
      </v-chip>
    </template>
  </v-autocomplete>
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
    },
    boxLabel: {
      type: String,
      default: "",
      require: true
    },
    fieldWidth: {
      type: String,
      default: "",
      require: true
    }
  },
  data() {
    return {
      searchInput: null
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
  },

  methods: {
    remove(item) {
      this.selectedContentsModel = this.selectedContentsModel.filter(
        (ele) => ele !== item
      )
    }
  }
}
</script>
