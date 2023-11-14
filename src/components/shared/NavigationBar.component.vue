<template>
  <v-card class="navigation">
    <v-navigation-drawer :rail="isSmall" permanent>
      <v-autocomplete
          v-if="!isSmall"
          v-model="activeProject"
          :items="projects"
          class="mx-2 my-2"
          density="compact"
          hide-details
          hide-selected
          item-title="name"
          item-value="id"
          variant="outlined"
      ></v-autocomplete>
      <v-list :lines="false" density="compact" mandatory nav>
        <v-list-item v-for="navItem in navigationItems" :key="navItem.routerName"
                     :active="navItem.routerName === selectedItem"
                     :disabled="navItem.projectRequired && !activeProject"
                     :value="navItem.routerName" active-color="primary" @click="navigate(navItem)">
          <template #prepend>
            <v-tooltip :disabled="!isSmall" :text="navItem.title" location="right">
              <template #activator="{props}">
                <v-icon :icon="navItem.icon" v-bind="props"></v-icon>
              </template>
            </v-tooltip>
          </template>
          <v-list-item-title v-text="navItem.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NavigationItemsStorage } from '@/misc/NavigationItemsStorage';
import { Views } from '@/views';
import { ProjectActions, ProjectMutations, useProjectStore } from '@/stores/project.store';
import Project from '@/models/Project';
import { NavigationItemInterface } from '@/interfaces/NavigationItem.interface';

export default defineComponent({
  data() {
    let selectedItem: string = '';
    return {
      selectedItem,
    };
  },
  computed: {
    navigationItems() {
      return NavigationItemsStorage;
    },
    projectStore() {
      return useProjectStore();
    },
    projects() {
      return this.projectStore.getters.projects;
    },
    projectId() {
      return this.activeProject?.id;
    },
    activeProject: {
      get() {
        return this.projectStore.getters.activeProject;
      },
      set(project: string) {
        this.projectStore.dispatch(ProjectActions.FIND_ONE, project).then((value: Project) => {
          this.selectedItem = Views.TIMELINE_VIEW;
          this.$router.push({
            name: Views.TIMELINE_VIEW,
            params: {
              projectId: value.id,
            },
          });
        });
      },
    },
    isSmall(): boolean {
      return this.$vuetify.display.sm;
    },
  },
  async beforeMount() {
    await this.projectStore.dispatch(ProjectActions.FIND_ALL);
  },
  methods: {
    navigate(route: NavigationItemInterface) {
      this.selectedItem = route.routerName;
      this.$router.push({
        name: route.routerName,
        params: route.props?.reduce((result, prop) => {
          result[prop] = this[prop];
          return result;
        }, {}) ?? {},
      });
    },
  },
  watch: {
    $route() {
      if (this.$route.params.projectId) {
        this.projectStore.commit(ProjectMutations.SAVE_ACTIVE_PROJECT, this.$route.params.projectId as string);
      }
      if (this.$route.name) {
        this.selectedItem = this.$route.name as string;
      }
    },
  },
});
</script>

<style scoped>
.navigation {
  align-items: center;
}
</style>
