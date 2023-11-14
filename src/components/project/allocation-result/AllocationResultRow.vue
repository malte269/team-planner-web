<template>
  <v-container class="my-color" fluid>
    <v-row>
      <v-col>
        <v-row justify="center">
          <v-col cols="auto">
            {{ group.name }}
          </v-col>
        </v-row>
        <v-row v-if="group.users">
          <v-col v-for="user in group.users">
            {{ user.fullName }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="group.children">
      <v-col v-for="childGroup in group.children">
        <AllocationResultRow :group="childGroup"></AllocationResultRow>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Group from '@/models/Group';

export default defineComponent({
  name: 'AllocationResultRow',
  props: {
    group: {
      type: Group,
      required: true,
    },
  },
});
</script>

<style scoped>

</style>