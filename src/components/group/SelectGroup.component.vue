<template>
  <v-autocomplete
      v-model="groupValue"
      :items="groups"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"></v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GroupActions, useGroupStore } from '@/stores/group.store';

export default defineComponent({
  name: 'SelectGroup.component',
  emits: ['update:groupId'],
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  async beforeMount() {
    await this.groupStore.dispatch(GroupActions.FIND_ALL, {
      projectId: this.$route.params.projectId,
    });
  },
  computed: {
    groupStore() {
      return useGroupStore();
    },
    groups() {
      return this.groupStore.getters.groups;
    },
    groupValue: {
      get() {
        return this.groupId;
      },
      set(groupId: string) {
        this.$emit('update:groupId', groupId);
      },
    },
  },
});
</script>

<style scoped>

</style>