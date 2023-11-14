import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore } from 'vuex';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import Role from '@/models/Role';
import RoleRepository from '@/api/repositories/RoleRepository';

const roleRepository: RoleRepository = RepositoryFactory.get('role');

export const key: InjectionKey<typeof storeState> = Symbol();

export enum RoleActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOnes',
  CREATE_ROLE = 'createRole',
  DELETE_ROLE = 'deleteRole',
}

export enum RoleMutations {
  SAVE_ROLES = 'saveRoles',
  SAVE_ROLE = 'saveRole',
  REMOVE_ROLE = 'removeRole',
}

type RoleStoreState = {
  roles: Role[];
}

const storeState: RoleStoreState = {
  roles: new Array<Role>(0),
};

const roleStore = {
  state: storeState,
  actions: {
    [RoleActions.FIND_ALL]: async (context: MyActionContext<RoleStoreState>, payload: QueryObject<Role> = {}) => {
      const response = await roleRepository.findAll(payload);
      context.commit(RoleMutations.SAVE_ROLES, response.records);
      return response;
    },
    [RoleActions.FIND_ONE]: async (context: MyActionContext<RoleStoreState>, payload: string) => {
      const response = await roleRepository.findOne(payload);
      context.commit(RoleMutations.SAVE_ROLE, response);
      return response;
    },
    [RoleActions.CREATE_ROLE]: async (context: MyActionContext<RoleStoreState>, payload: Role) => {
      const response = await roleRepository.create(payload);
      context.commit(RoleMutations.SAVE_ROLE, response);
      return response;
    },
    [RoleActions.DELETE_ROLE]: async (context: MyActionContext<RoleStoreState>, payload: string) => {
      await roleRepository.delete(payload);
      context.commit(RoleMutations.REMOVE_ROLE, payload);
    },
  },
  mutations: {
    [RoleMutations.SAVE_ROLES](state: RoleStoreState, roles: Role[]) {
      state.roles = roles;
    },
    [RoleMutations.SAVE_ROLE](state: RoleStoreState, role: Role) {
      saveElementToArray(state.roles, 'id', role);
    },
    [RoleMutations.REMOVE_ROLE](state: RoleStoreState, roleId: string) {
      removeFromArray(state.roles, 'id', roleId);
    },
  },
  getters: {
    roles(state: typeof storeState): Role[] {
      return state.roles;
    },
  },
};

export function useRoleStore(): MyStore<typeof roleStore> {
  roleRepository.setAuthStore(useAuthStore());
  return baseUseStore<typeof roleStore['state']>(key);
}

export default createStore(roleStore);
