<template>
  <v-autocomplete
      v-model="phaseValue"
      :items="phases"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"></v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PhaseActions, usePhaseStore } from '@/stores/phase.store';

export default defineComponent({
  name: 'SelectPhase.component',
  emits: ['update:phaseId'],
  props: {
    incrementId: {
      type: String,
      required: true,
    },
    phaseId: {
      type: String,
      required: true,
    },
  },
  async beforeMount() {
    await this.getPhases();
  },
  methods: {
    async getPhases() {
      return this.phaseStore.dispatch(PhaseActions.FIND_ALL, {
        projectId: this.$route.params.projectId,
        incrementId: this.incrementId,
      });
    },
  },
  computed: {
    phaseStore() {
      return usePhaseStore();
    },
    phases() {
      return this.phaseStore.getters.phases;
    },
    phaseValue: {
      get() {
        return this.phaseId;
      },
      set(phaseId: string) {
        this.$emit('update:phaseId', phaseId);
      },
    },
  },
  watch: {
    async incrementId() {
      await this.getPhases();
    },
  },
});
</script>

<style scoped>

</style>