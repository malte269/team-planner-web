<template>
  <v-tooltip :location="position" :text="text">
    <template #activator="{props}">
      <v-icon v-bind="props">
        mdi-information-outline
      </v-icon>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoComponent',
  props: {
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: 'top',
    },
  },
});
</script>

<style scoped>

</style>