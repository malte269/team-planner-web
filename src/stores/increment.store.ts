import {
  createStore,
  useStore as baseUseStore,
} from 'vuex';
import Increment from '@/models/Increment';
import { InjectionKey } from 'vue';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import IncrementRepository from '@/api/repositories/IncrementRepository';

const incrementRepository: IncrementRepository = RepositoryFactory.get('increment');

export const key: InjectionKey<IncrementStoreState> = Symbol();

export enum IncrementActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE_INCREMENT = 'createIncrement',
  UPDATE_INCREMENT = 'updateIncrement',
  DELETE_INCREMENT = 'deleteIncrement',
}

export enum IncrementMutations {
  SAVE_INCREMENTS = 'saveIncrements',
  SAVE_INCREMENT = 'saveIncrement',
  REMOVE_INCREMENT = 'removeIncrement',
}

type IncrementStoreState = {
  increments: Increment[];
}

const storeState: IncrementStoreState = {
  increments: [],
};

const incrementStore = {
  state: storeState,
  actions: {
    async [IncrementActions.FIND_ALL](context: MyActionContext<IncrementStoreState>, payload: QueryObject<Increment> = {}) {
      const response = await incrementRepository.findAll(payload);
      const increments = Increment.parseFromArray(response.records);
      context.commit(IncrementMutations.SAVE_INCREMENTS, increments);
      return increments;
    },
    async [IncrementActions.FIND_ONE](context: MyActionContext<IncrementStoreState>, payload: string) {
      const response = await incrementRepository.findOne(payload);
      const increment = Increment.parseFromObject(response);
      context.commit(IncrementMutations.SAVE_INCREMENT, increment);
      return increment;
    },
    async [IncrementActions.CREATE_INCREMENT](context: MyActionContext<IncrementStoreState>, payload: Increment) {
      const response = await incrementRepository.create(payload);
      const increment = Increment.parseFromObject(response);
      context.commit(IncrementMutations.SAVE_INCREMENT, increment);
      return increment;
    },
    async [IncrementActions.UPDATE_INCREMENT](context: MyActionContext<IncrementStoreState>, payload: Partial<Increment> & {
      id: string,
    }) {
      const response = await incrementRepository.update(payload.id, payload);
      const increment = Increment.parseFromObject(response);
      context.commit(IncrementMutations.SAVE_INCREMENT, increment);
      return increment;
    },
    async [IncrementActions.DELETE_INCREMENT](context: MyActionContext<IncrementStoreState>, payload: string) {
      await incrementRepository.delete(payload);
      context.commit(IncrementMutations.REMOVE_INCREMENT, payload);
    },
  },
  mutations: {
    [IncrementMutations.SAVE_INCREMENTS](state: IncrementStoreState, increments: Increment[]) {
      state.increments = increments;
    },
    [IncrementMutations.SAVE_INCREMENT](state: IncrementStoreState, increment: Increment) {
      saveElementToArray(state.increments, 'id', increment);
    },
    [IncrementMutations.REMOVE_INCREMENT](state: IncrementStoreState, id: string) {
      removeFromArray(state.increments, 'id', id);
    },
  },
  getters: {
    increments(state: IncrementStoreState) {
      return state.increments;
    },
  },
};

export function useIncrementStore(): MyStore<typeof incrementStore> {
  incrementRepository.setAuthStore(useAuthStore());
  return baseUseStore<IncrementStoreState>(key);
}

export default createStore(incrementStore);
