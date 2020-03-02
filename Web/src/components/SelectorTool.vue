<template>
  <div class="px-10 pb-4">
    <v-treeview
      v-model="selection"
      :items="items"
      :selection-type="selectionType"
      selectable
      return-object
      open-all
    ></v-treeview>
  </div>
</template>

<script>
export default {}
</script>
