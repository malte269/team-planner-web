import {
  createStore,
  useStore as baseUseStore,
} from 'vuex';
import { InjectionKey } from 'vue';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import UserRepository from '@/api/repositories/UserRepository';
import User from '@/models/user';

const userRepository: UserRepository = RepositoryFactory.get('user');

export const key: InjectionKey<UserStoreState> = Symbol();

export enum UserActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE_USER = 'createUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',
}

export enum UserMutations {
  SAVE_USERS = 'saveUsers',
  SAVE_USER = 'saveUser',
  SAVE_ACTIVE_USER = 'saveActiveUser',
  REMOVE_USER = 'removeUser',
}

type UserStoreState = {
  users: User[];
  activeUser: User | null;
}

const storeState: UserStoreState = {
  users: [],
  activeUser: null,
};

const userStore = {
  state: storeState,
  actions: {
    async [UserActions.FIND_ALL](context: MyActionContext<UserStoreState>, payload: QueryObject<User> = {}) {
      if (!payload.sort) {
        payload.sort = 'firstName+ASC,lastName+ASC,email+asc';
      }
      const response = await userRepository.findAll(payload);
      const users = User.parseFromArray(response.records);
      context.commit(UserMutations.SAVE_USERS, users);
      return users;
    },
    async [UserActions.FIND_ONE](context: MyActionContext<UserStoreState>, payload: string) {
      const response = await userRepository.findOne(payload);
      const user = User.parseFromObject(response);
      context.commit(UserMutations.SAVE_ACTIVE_USER, user);
      return user;
    },
    async [UserActions.CREATE_USER](context: MyActionContext<UserStoreState>, payload: User) {
      const response = await userRepository.create(payload);
      const user = User.parseFromObject(response);
      context.commit(UserMutations.SAVE_USER, user);
      return user;
    },
    async [UserActions.UPDATE_USER](context: MyActionContext<UserStoreState>, payload: Partial<User> & {
      id: string,
    }) {
      const response = await userRepository.update(payload.id, payload);
      context.commit(UserMutations.SAVE_USER, response);
      return response;
    },
    async [UserActions.DELETE_USER](context: MyActionContext<UserStoreState>, payload: string) {
      await userRepository.delete(payload);
      context.commit(UserMutations.REMOVE_USER, payload);
    },
  },
  mutations: {
    [UserMutations.SAVE_USERS](state: UserStoreState, users: User[]) {
      state.users = users;
    },
    [UserMutations.SAVE_USER](state: UserStoreState, user: User) {
      saveElementToArray(state.users, 'id', user);
    },
    [UserMutations.SAVE_ACTIVE_USER](state: UserStoreState, user: User) {
      state.activeUser = user;
    },
    [UserMutations.REMOVE_USER](state: UserStoreState, id: string) {
      removeFromArray(state.users, 'id', id);
    },
  },
  getters: {
    users(state: UserStoreState) {
      return state.users;
    },
    activeUser(state: UserStoreState) {
      return state.activeUser;
    },
  },
};

export function useUserStore(): MyStore<typeof userStore> {
  userRepository.setAuthStore(useAuthStore());
  return baseUseStore<UserStoreState>(key);
}

export default createStore(userStore);
