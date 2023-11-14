<template>
  <v-container class="table" fluid>
    <v-row>
      <v-col>
        <h1>
          Mitarbeiterübersicht
        </h1>
      </v-col>
      <v-col align-self="center" cols="auto" lg="4" md="3" sm="4" xl="6" xxl="6">
        <v-text-field
            v-model="searchString"
            hide-details
            placeholder="Suche..."
            variant="outlined">
          <template v-slot:prepend-inner>
            <v-icon>
              mdi-magnify
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col align-self="center" cols="auto">
        <v-btn class="text-none ml-5" color="primary" @click="openCreateDialog()">
          Neuer Mitarbeiter
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pa-1 fill-height overflow-x-auto">
      <TableComponent
          :headers="header"
          :important-keys="importantKeys"
          :items="items"
          :on-row-click="goToDetails"
          :page="page"
          :search-string="searchString"
          class="elevation-1"
      >
        <template #isExpert="{item}">
          <div>
            {{ parseIsExpert(item.isExpert) }}
          </div>
        </template>
      </TableComponent>
    </v-row>
  </v-container>
  <DefaultDialog v-model:show-dialog="showCreateDialog">
    <UserDetails
        @submit:user="onUserCreated()"></UserDetails>
  </DefaultDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@kyvg/vue3-notification';

import TableComponent from '@/components/shared/table/Table.component.vue';
import { Views } from '@/views';
import User from '@/models/user';
import { UserActions, useUserStore } from '@/stores/user.store';
import UserDetails from '@/components/user/UserDetails.component.vue';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';

export default defineComponent({
  components: {
    DefaultDialog,
    UserDetails,
    TableComponent,
  },
  data() {
    return {
      user: new User(),
      showCreateDialog: Boolean(false),
      itemsPerPage: 5,
      page: 1,
      searchString: '',
    };
  },
  async mounted() {
    await this.userStore.dispatch(UserActions.FIND_ALL);
  },
  methods: {
    openCreateDialog() {
      this.showCreateDialog = true;
    },
    async onUserCreated() {
      this.showCreateDialog = false;
    },
    async goToDetails({ id }: User) {
      await this.$router.push({
        name: Views.USER_DETAILS_VIEW,
        params: {
          userId: id,
        },
      });
    },
    parseIsExpert(isExpert: boolean | string) {
      switch (isExpert) {
        case true:
        case 'true':
          return 'Ja';
        default:
          return 'Nein';
      }
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    importantKeys(): { [key in keyof User]?: any } {
      return { firstName: String, lastName: String };
    },
    items() {
      return this.userStore.getters.users;
    },
    header(): { title: string, width?: string, key: string }[] {
      return [
        {
          title: 'Vorname',
          key: 'firstName',
        },
        {
          title: 'Nachname',
          key: 'lastName',
        },
        {
          title: 'Email',
          key: 'email',
        },
        {
          title: 'Ist Experte',
          key: 'isExpert',
        },
      ];
    },
  },
});
</script>

<style scoped>

</style>
