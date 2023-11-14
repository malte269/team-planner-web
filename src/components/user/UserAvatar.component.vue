<template>
  <v-autocomplete
      v-model="userValue"
      :custom-filter="customFilter"
      :filter-keys="filterKeys"
      :item-props="true"
      :items="allUsers"
      clearable
      density="compact"
      hide-details
      item-title="fullName"
      item-value="id"
      no-data-text="Keine Mitarbeiter gefunden"
  >
    <template v-slot:selection="{item}">
      <div class="d-flex align-center">
        <v-avatar color="primary">
          {{ getUserInitials(item.raw) }}
        </v-avatar>
        <div v-if="!initialsOnly" class="ml-2">
          {{ item.title }}
        </div>
      </div>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-avatar color="primary">
            {{ getUserInitials(item.raw) }}
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/models/user';
import { UserActions, useUserStore } from '@/stores/user.store';

export default defineComponent({
  name: 'UserAvatar.component',
  emits: ['update:userId'],
  props: {
    userId: {
      type: String,
      required: true,
    },
    loadUsers: {
      type: Boolean,
      default: true,
    },
    users: {
      type: Array,
      default: null,
    },
    initialsOnly: {
      type: Boolean,
      default: false,
    },
  },
  async created() {
    if (this.loadUsers) {
      await this.userStore.dispatch(UserActions.FIND_ALL);
    }
  },
  methods: {
    getUserInitials(user: User) {
      return user ? `${ user.firstName?.slice(0, 1) ?? '' }${ user.lastName?.slice(0, 1) ?? '' }`.toUpperCase() : '';
    },
    customFilter(object: { title: string, value: string, props: User }, filterText: string) {
      const index = object.title.toLowerCase().indexOf(filterText.toLowerCase());
      if (index < 0) {
        // if no match with fullName, try switching names
        return `${ object.props.lastName } ${ object.props.firstName }`.toLowerCase().indexOf(filterText.toLowerCase());
      }
      return index;
    },
  },
  computed: {
    userValue: {
      get() {
        return this.userId;
      },
      set(value: string) {
        this.$emit('update:userId', value);
      },
    },
    userStore() {
      return useUserStore();
    },
    allUsers() {
      return (this.loadUsers ? this.userStore.getters.users : this.users) ?? [];
    },
    filterKeys() {
      return ['firstName', 'lastName'] as (keyof User)[];
    },
  },
});
</script>


<style scoped>

</style>