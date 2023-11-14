import {
  createStore,
  useStore as baseUseStore,
} from 'vuex';
import Group from '@/models/Group';
import { InjectionKey } from 'vue';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import GroupRepository from '@/api/repositories/GroupRepository';

const groupRepository: GroupRepository = RepositoryFactory.get('group');

export const key: InjectionKey<GroupStoreState> = Symbol();

export enum GroupActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum GroupMutations {
  SAVE_GROUPS = 'saveGroups',
  SAVE_GROUP = 'saveGroup',
  REMOVE_GROUP = 'removeGroup',
}

type GroupStoreState = {
  groups: Group[];
}

const storeState: GroupStoreState = {
  groups: [],
};

const groupStore = {
  state: storeState,
  actions: {
    async [GroupActions.FIND_ALL](context: MyActionContext<GroupStoreState>, payload: QueryObject<Group> = {}) {
      const response = await groupRepository.findAll(payload);
      context.commit(GroupMutations.SAVE_GROUPS, response.records);
      return response.records;
    },
    async [GroupActions.FIND_ONE](context: MyActionContext<GroupStoreState>, payload: string) {
      const response = await groupRepository.findOne(payload);
      context.commit(GroupMutations.SAVE_GROUP, response);
      return response;
    },
    async [GroupActions.CREATE](context: MyActionContext<GroupStoreState>, payload: Group | {
      body: Group,
      save: boolean
    }) {
      let body = (payload as any).body;
      const save = (payload as any).save ?? true;
      if (body === undefined) {
        body = payload;
      }
      const response = await groupRepository.create(body);
      if (save) {
        context.commit(GroupMutations.SAVE_GROUP, response);
      }
      return response;
    },
    async [GroupActions.UPDATE](context: MyActionContext<GroupStoreState>, payload: Partial<Group> & {
      id: string,
    }) {
      const response = await groupRepository.update(payload.id, payload);
      context.commit(GroupMutations.SAVE_GROUP, response);
      return response;
    },
    async [GroupActions.DELETE](context: MyActionContext<GroupStoreState>, payload: string) {
      await groupRepository.delete(payload);
      context.commit(GroupMutations.REMOVE_GROUP, payload);
    },
  },
  mutations: {
    [GroupMutations.SAVE_GROUPS](state: GroupStoreState, groups: Group[]) {
      state.groups = groups;
    },
    [GroupMutations.SAVE_GROUP](state: GroupStoreState, group: Group) {
      saveElementToArray(state.groups, 'id', group);
    },
    [GroupMutations.REMOVE_GROUP](state: GroupStoreState, id: string) {
      removeFromArray(state.groups, 'id', id);
    },
  },
  getters: {
    groups(state: GroupStoreState) {
      return state.groups;
    },
  },
};

export function useGroupStore(): MyStore<typeof groupStore> {
  groupRepository.setAuthStore(useAuthStore());
  return baseUseStore<GroupStoreState>(key);
}

export default createStore(groupStore);
