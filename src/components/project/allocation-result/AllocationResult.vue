<template>
  <v-container class="overflow-auto" fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <h1>
          {{ project.name }}
        </h1>
      </v-col>
    </v-row>
    <v-row v-for="(increment, index) in project.increments" :class="index % 2 === 0 ? 'my-color' : 'bg-surface'">
      <v-col>
        <v-row justify="center">
          <v-col cols="auto">
            {{ increment.name }}
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-col v-for="group in increment.modules">
            <v-row justify="center">
              <v-col cols="auto">
                <AllocationResultRow :group="group"></AllocationResultRow>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Project from '@/models/Project';
import AllocationResultRow from '@/components/project/allocation-result/AllocationResultRow.vue';

export default defineComponent({
  name: 'AllocationResult',
  components: { AllocationResultRow },
  props: {
    project: {
      type: Project,
      required: true,
    },
  },
});
</script>

<style scoped>

</style>