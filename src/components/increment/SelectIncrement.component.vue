<template>
  <v-autocomplete
      v-model="incrementValue"
      :items="increments"
      clearable
      density="compact"
      hide-details
      item-title="name"
      item-value="id"></v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IncrementActions, useIncrementStore } from '@/stores/increment.store';

export default defineComponent({
  name: 'SelectIncrement.component',
  emits: ['update:incrementId'],
  props: {
    incrementId: {
      type: String,
      required: true,
    },
  },
  async beforeMount() {
    await this.incrementStore.dispatch(IncrementActions.FIND_ALL, {
      projectId: this.$route.params.projectId,
    });
  },
  computed: {
    incrementStore() {
      return useIncrementStore();
    },
    increments() {
      return this.incrementStore.getters.increments;
    },
    incrementValue: {
      get() {
        return this.incrementId;
      },
      set(incrementId: string) {
        this.$emit('update:incrementId', incrementId);
      },
    },
  },
});
</script>

<style scoped>

</style>