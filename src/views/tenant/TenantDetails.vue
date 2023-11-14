<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>
          {{ activeTenant?.name }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Settings :settings="tenantCopy.settings"></Settings>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AlgorithmInfoComponent></AlgorithmInfoComponent>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn color="primary" @click="updateTenant">
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
        <v-btn :loading="loading" @click="onCreateTeams()">
          Erstelle Teams
        </v-btn>
      </v-col>
    </v-row>
    <DefaultDialog v-model:show-dialog="showDialog" width="600">
      <v-row>
        <v-col>
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
      </v-row>
      <div v-if="!projects.length">
        Keine Projekte gefunden
      </div>
      <v-list v-else height="400">
        <v-checkbox
            v-model="allValuesSelected"
            :indeterminate="!allValuesSelected && someValuesSelected"
            hide-details
            label="Alle auswählen"></v-checkbox>
        <v-list-item v-for="project in projects">
          <v-checkbox
              v-model="projectIds"
              :label="project.name"
              :value="project.id"
              density="compact"
              hide-details></v-checkbox>
        </v-list-item>
      </v-list>
      <template #actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!projectIds.length" @click="createTeams">
          Generiere ein Team
        </v-btn>
      </template>
    </DefaultDialog>
    <DefaultDialog v-model:show-dialog="showResult">
      <v-row>
        <v-col v-for="project in result" class="border">
          <AllocationResult :project="project"></AllocationResult>
        </v-col>
      </v-row>
    </DefaultDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Project from '@/models/Project';
import { Views } from '@/views';
import DefaultDialog from '@/components/shared/DefaultDialog.vue';
import InfoComponent from '@/components/shared/InfoComponent.vue';
import { TenantActions, TenantMutations, useTenantStore } from '@/stores/tenant.store';
import { AuthMutations, useAuthStore } from '@/stores/auth.store';
import User from '@/models/user';
import Tenant from '@/models/Tenant';
import { ProjectActions, useProjectStore } from '@/stores/project.store';
import AllocationResult from '@/components/project/allocation-result/AllocationResult.vue';
import Settings from '@/components/project/Settings.component.vue';
import AlgorithmInfoComponent from '@/components/project/AlgorithmInfoComponent.vue';

export default defineComponent({
  name: 'ProjectDetails',
  components: { AlgorithmInfoComponent, Settings, AllocationResult, InfoComponent, DefaultDialog },
  data() {
    return {
      _tenantCopy: new Project(),
      loading: false,
      showDialog: false,
      projectIds: [],
      searchString: '',
      showResult: false,
      result: [],
    };
  },
  async created() {
    console.log(!!this.tenantStore, !!this.authStore, !!this.projectStore);
    if (!this.activeUser || !this.activeUser.tenantId) {
      this.authStore.commit(AuthMutations.CLEAR_LOGIN);
      await this.$router.push({
        name: Views.LOGIN,
      });
    }
    await Promise.all([
      this.tenantStore?.dispatch(TenantActions.FIND_ONE, this.activeUser.tenantId),
      this.projectStore?.dispatch(ProjectActions.FIND_ALL),
    ]);
  },
  methods: {
    revertChanges() {
      this.tenantStore.commit(TenantMutations.SAVE_ACTIVE_TENANT, this.activeTenant.copy() as Project);
    },
    async updateTenant() {
      try {
        await this.tenantStore.dispatch(TenantActions.UPDATE, this.tenantCopy);
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
    onCreateTeams() {
      this.showDialog = true;
    },
    async createTeams() {
      this.loading = true;
      try {
        this.result = await this.projectStore.dispatch(ProjectActions.CREATE_TEAMS, {
          projectIds: this.projectIds.filter(
              (id: string) => this.projects.some((project: Project) => project.id === id),
          ),
          settings: this.tenantCopy.settings,
        });
        this.showDialog = false;
        this.showResult = true;
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
    tenantStore() {
      return useTenantStore();
    },
    authStore() {
      return useAuthStore();
    },
    projectStore() {
      return useProjectStore();
    },
    projects() {
      return this.projectStore.getters.projects?.filter(
          (project: Project) => project.name.toLowerCase().includes(this.searchString),
      );
    },
    activeUser(): User {
      return this.authStore.getters.activeUser;
    },
    activeTenant() {
      const retVal = this.tenantStore.getters.activeTenant ?? new Tenant();
      this.tenantCopy = retVal.copy() as Tenant;
      return retVal;
    },
    tenantCopy: {
      get(): Tenant {
        return this._tenantCopy;
      },
      set(project: Tenant) {
        this._tenantCopy = project;
      },
    },
    allValuesSelected: {
      get() {
        const ret = this.projects?.every((project: Project) => this.projectIds.includes(project.id));
        console.log('ret', ret);
        return ret;
      },
      set(value: boolean) {
        if (value) {
          this.projectIds = this.projects.map((project: Project) => project.id);
        } else {
          this.projectIds = [];
        }
      },
    },
    someValuesSelected() {
      return this.projects?.some((project: Project) => this.projectIds.includes(project.id));
    },
  },
});
</script>

<style scoped>
</style>
