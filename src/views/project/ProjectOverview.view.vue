<template>
  <v-container class="table" fluid>
    <v-row>
      <v-col>
        <h1>
          Deine Projekte
        </h1>
      </v-col>
      <v-col cols="auto" lg="4" md="3" xl="6" xxl="6">
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
        <v-btn color="primary" @click="openCreateDialog()">
          Neues Projekt
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pa-1 fill-height overflow-x-auto">
      <TableComponent
          :headers="header"
          :important-keys="importantKeys"
          :items="items"
          :on-row-click="openProject"
          :page="page"
          :search-string="searchString"
          class="elevation-1"
      >
        <template #startDateSoft="{item}">
          {{ displayDate(item) }}
        </template>
      </TableComponent>
    </v-row>
  </v-container>
  <v-dialog v-model="showCreateProjectDialog">
    <ProjectManageComponent
        :project="project" @cancel="closeCreateProjectDialog()"
        @submit-project="onCreateProject()"></ProjectManageComponent>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Project from '@/models/Project';
import { ProjectActions, useProjectStore } from '@/stores/project.store';
import '@kyvg/vue3-notification';

import ProjectManageComponent from '@/components/project/ProjectManage.component.vue';
import TableComponent from '@/components/shared/table/Table.component.vue';
import { Views } from '@/views';
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    ProjectManageComponent,
    TableComponent,
  },
  data() {
    return {
      project: new Project(),
      showCreateProjectDialog: Boolean(false),
      itemsPerPage: 5,
      page: 1,
      searchString: '',
    };
  },
  async mounted() {
    await this.projectStore.dispatch(ProjectActions.FIND_ALL);
  },
  methods: {
    openCreateDialog() {
      this.showCreateProjectDialog = true;
    },
    closeCreateProjectDialog() {
      this.showCreateProjectDialog = false;
    },
    displayDate(item: Project) {
      return (item.startDateSoft as DateTime)?.toLocaleString() ?? '-';
    },
    async onCreateProject() {
      try {
        await this.projectStore.dispatch(ProjectActions.CREATE_PROJECT, this.project);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Das Projekt wurde erfolgreich erstellt',
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Das Projekt konnte nicht erstellt werden',
        });
      } finally {
        this.closeCreateProjectDialog();
      }
    },
    async openProject({ id }: Project) {
      await this.$router.push({
        name: Views.INCREMENT_VIEW,
        params: {
          projectId: id,
        },
      });
    },
  },
  computed: {
    projectStore() {
      return useProjectStore();
    },
    importantKeys() {
      return { name: String };
    },
    items() {
      return this.projectStore.getters.projects;
    },
    header(): { title: string, width: string, key: keyof Project }[] {
      return [
        {
          title: 'Name',
          key: 'name',
          width: '50%',
        },
        {
          title: 'Start Datum',
          key: 'startDateSoft',
          width: '50%',
        },
      ];
    },
  },
});
</script>

<style scoped>

</style>
