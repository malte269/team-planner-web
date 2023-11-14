<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>
          {{ activeProject?.name }}
        </h1>
        <h3>
          Kürzel: {{ activeProject.short }}
        </h3>
      </v-col>
      <v-col cols="4">
        <v-select
            v-model="activeProject.status"
            :items="projectStatusItems"
            hide-details
            label="Status"
            @update:modelValue="updateProject">
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="projectCopy.startDateSoftIso"
            hide-details
            label="Frühestes Start-Datum"
            type="date">
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="projectCopy.endDateSoftIso"
            hide-details
            label="Frühestes End-Datum"
            type="date">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
            v-model="projectCopy.startDateHardIso"
            hide-details
            label="Spätestes Start-Datum"
            type="date">
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
            v-model="projectCopy.endDateHardIso"
            hide-details
            label="Spätestes End-Datum"
            type="date">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
            v-model="projectCopy.description"
            hide-details
            label="Beschreibung">
        </v-textarea>
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-text-field
                v-model="projectCopy.teamSize"
                hide-details
                label="Teamgröße"
                type="number">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
                v-model="projectCopy.users"
                :items="users"
                clearable
                hide-details
                item-title="fullName"
                item-value="id"
                multiple
                label="Team"
                @update:modelValue="updateProjectTeam"></v-autocomplete>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AlgorithmInfoComponent></AlgorithmInfoComponent>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel title="Steuerungs-Konstanten">
            <v-expansion-panel-text>
              <Settings :settings="projectCopy.settings"></Settings>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn color="primary" @click="updateProject">
          Speichern
        </v-btn>
      </v-col>
      <v-col>
        <v-btn color="error" variant="outlined" @click="revertChanges">
          Änderungen verwerfen
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn :loading="loading" @click="createTeam()">
          Erstelle ein Team
        </v-btn>
      </v-col>
    </v-row>
    <DefaultDialog v-model:show-dialog="showDialog">
      <AllocationResult :project="allocationResult"></AllocationResult>
    </DefaultDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ProjectActions, ProjectMutations, useProjectStore } from '@/stores/project.store';
import Project, { projectStatusItems } from '@/models/Project';
import { Views } from '@/views';
import { UserActions, useUserStore } from '@/stores/user.store';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import InfoComponent from '@/components/shared/InfoComponent.vue';
import AllocationResult from '@/components/project/allocation-result/AllocationResult.vue';
import Settings from '@/components/project/Settings.component.vue';
import AlgorithmInfoComponent from '@/components/project/AlgorithmInfoComponent.vue';

export default defineComponent({
  name: 'ProjectDetails',
  components: { AlgorithmInfoComponent, Settings, AllocationResult, InfoComponent, DefaultDialog },
  data() {
    const allocationResult: Project | null = null;
    return {
      _projectCopy: new Project(),
      loading: false,
      showDialog: false,
      allocationResult,
    };
  },
  async created() {
    console.log(!!this.projectStore, !!this.userStore);
    await Promise.all([
      this.projectStore?.dispatch(ProjectActions.FIND_ONE, this.projectId),
      this.userStore?.dispatch(UserActions.FIND_ALL),
    ]);
  },
  methods: {
    revertChanges() {
      this.projectStore.commit(ProjectMutations.SAVE_ACTIVE_PROJECT, this.activeProject.copy() as Project);
    },
    async updateProject() {
      try {
        await this.projectStore.dispatch(ProjectActions.UPDATE_PROJECT, this.projectCopy);
        this.$notify({
          type: 'success',
          title: 'Erfolg',
          text: 'Das Projekt wurde erfolgreich aktualisiert',
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Die Änderungen konnten nicht gespeichert werden',
        });
      }
    },
    async updateProjectTeam(users: string[]) {
      try {
        await this.projectStore.dispatch(ProjectActions.SAVE_TEAM, {
          projectId: this.projectId,
          users,
        });
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Das neue Teammitglied konnte nicht gespeichert werden',
        });
      }
    },
    async createTeam() {
      this.loading = true;
      try {
        this.allocationResult = await this.projectStore.dispatch(ProjectActions.CREATE_TEAM, {
          projectId: this.projectId,
          settings: this.projectCopy.settings,
        });
        this.showDialog = true;
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Fehler',
          text: 'Das Team konnte nicht erstellt werden',
        });
      }
      this.loading = false;
    },
  },
  computed: {
    projectStore() {
      return useProjectStore();
    },
    userStore() {
      return useUserStore();
    },
    activeProject() {
      const retVal = this.projectStore.getters.activeProject ?? new Project();
      this.projectCopy = retVal.copy() as Project;
      return retVal;
    },
    projectCopy: {
      get(): Project {
        return this._projectCopy;
      },
      set(project: Project) {
        this._projectCopy = project;
      },
    },
    projectId(): string {
      if (!this.$route.params.projectId) {
        this.$router.push({
          name: Views.PROJECT_VIEW,
        });
        return '';
      }
      return this.$route.params.projectId as string;
    },
    projectStatusItems() {
      return projectStatusItems;
    },
    users() {
      return this.userStore.getters.users ?? [];
    },
  },
});
</script>

<style scoped>

</style>
