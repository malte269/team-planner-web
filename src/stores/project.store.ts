import {
  createStore,
  useStore as baseUseStore,
} from 'vuex';
import Project from '@/models/Project';
import { InjectionKey } from 'vue';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import ProjectRepository from '@/api/repositories/ProjectRepository';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import SettingsEntity from '@/models/SettingsEntity';

const projectRepository: ProjectRepository = RepositoryFactory.get('project');

export const key: InjectionKey<ProjectStoreState> = Symbol();

export enum ProjectActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE_PROJECT = 'createProject',
  UPDATE_PROJECT = 'updateProject',
  DELETE_PROJECT = 'deleteProject',
  CREATE_TEAM = 'createTeam',
  CREATE_TEAMS = 'createTeams',
  SAVE_TEAM = 'saveTeam',
}

export enum ProjectMutations {
  SAVE_PROJECTS = 'saveProjects',
  SAVE_PROJECT = 'saveProject',
  SAVE_ACTIVE_PROJECT = 'saveActiveProject',
  REMOVE_PROJECT = 'removeProject',
}

type ProjectStoreState = {
  projects: Project[];
  activeProject: Project | null;
}

const storeState: ProjectStoreState = {
  projects: [],
  activeProject: null,
};

const projectStore = {
  state: storeState,
  actions: {
    async [ProjectActions.FIND_ALL](context: MyActionContext<ProjectStoreState>, payload: QueryObject<Project> = {}) {
      const response = await projectRepository.findAll(payload);
      const projects = Project.parseFromArray(response.records);
      context.commit(ProjectMutations.SAVE_PROJECTS, projects);
      if (projects.length === 1) {
        context.commit(ProjectMutations.SAVE_ACTIVE_PROJECT, projects[0]);
      }
      return projects;
    },
    async [ProjectActions.FIND_ONE](context: MyActionContext<ProjectStoreState>, payload: string) {
      const response = await projectRepository.findOne(payload);
      const project = Project.parseFromObject(response);
      context.commit(ProjectMutations.SAVE_ACTIVE_PROJECT, project);
      return project;
    },
    async [ProjectActions.CREATE_PROJECT](context: MyActionContext<ProjectStoreState>, payload: Project) {
      const response = await projectRepository.create(payload);
      const project = Project.parseFromObject(response);
      context.commit(ProjectMutations.SAVE_PROJECT, project);
      return project;
    },
    async [ProjectActions.UPDATE_PROJECT](context: MyActionContext<ProjectStoreState>, payload: Partial<Project> & {
      id: string,
    }) {
      const response = await projectRepository.update(payload.id, payload);
      const project = Project.parseFromObject(response);
      context.commit(ProjectMutations.SAVE_PROJECT, project);
      return project;
    },
    async [ProjectActions.DELETE_PROJECT](context: MyActionContext<ProjectStoreState>, payload: string) {
      await projectRepository.delete(payload);
      context.commit(ProjectMutations.REMOVE_PROJECT, payload);
    },
    async [ProjectActions.CREATE_TEAM](context: MyActionContext<ProjectStoreState>, payload: {
      projectId: string,
      settings: SettingsEntity
    }) {
      const result = await projectRepository.createTeam(payload.projectId, payload.settings);
      return Project.parseFromObject(result);
    },
    async [ProjectActions.CREATE_TEAMS](context: MyActionContext<ProjectStoreState>, payload: {
      projectIds: string[],
      settings: SettingsEntity
    }) {
      const result = await projectRepository.createTeams(payload.projectIds, payload.settings);
      return Project.parseFromArray(result);
    },
    async [ProjectActions.SAVE_TEAM](context: MyActionContext<ProjectStoreState>, payload: {
      projectId: string,
      users: string[]
    }) {
      const response = await projectRepository.saveProjectTeam(payload.projectId, payload.users);
      const project = Project.parseFromObject(response);
      context.commit(ProjectMutations.SAVE_ACTIVE_PROJECT, project);
      return project;
    },
  },
  mutations: {
    [ProjectMutations.SAVE_PROJECTS](state: ProjectStoreState, projects: Project[]) {
      state.projects = projects;
    },
    [ProjectMutations.SAVE_PROJECT](state: ProjectStoreState, project: Project) {
      saveElementToArray(state.projects, 'id', project);
    },
    [ProjectMutations.SAVE_ACTIVE_PROJECT](state: ProjectStoreState, project: Project | string) {
      if (typeof project === 'string') {
        project = state.projects.find((storeProject) => storeProject.id === project)!;
      }
      state.activeProject = project as Project;
    },
    [ProjectMutations.REMOVE_PROJECT](state: ProjectStoreState, id: string) {
      removeFromArray(state.projects, 'id', id);
    },
  },
  getters: {
    projects(state: ProjectStoreState) {
      return state.projects;
    },
    activeProject(state: ProjectStoreState) {
      return state.activeProject;
    },
  },
};

export function useProjectStore(): MyStore<typeof projectStore> {
  projectRepository.setAuthStore(useAuthStore());
  return baseUseStore<ProjectStoreState>(key);
}

export default createStore(projectStore);
