import {
  createStore,
  useStore as baseUseStore,
} from 'vuex';
import Phase from '@/models/Phase';
import { InjectionKey } from 'vue';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';
import PhaseRepository from '@/api/repositories/PhaseRepository';

const phaseRepository: PhaseRepository = RepositoryFactory.get('phase');

export const key: InjectionKey<PhaseStoreState> = Symbol();

export enum PhaseActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PhaseMutations {
  SAVE_PHASES = 'savePhases',
  SAVE_PHASE = 'savePhase',
  REMOVE_PHASE = 'removePhase',
}

type PhaseStoreState = {
  phases: Phase[];
}

const storeState: PhaseStoreState = {
  phases: [],
};

const phaseStore = {
  state: storeState,
  actions: {
    async [PhaseActions.FIND_ALL](context: MyActionContext<PhaseStoreState>, payload: QueryObject<Phase> = {}) {
      const response = await phaseRepository.findAll(payload);
      const phases = Phase.parseFromArray(response.records);
      context.commit(PhaseMutations.SAVE_PHASES, phases);
      return phases;
    },
    async [PhaseActions.FIND_ONE](context: MyActionContext<PhaseStoreState>, payload: string) {
      const response = await phaseRepository.findOne(payload);
      const phase = Phase.parseFromObject(response);
      context.commit(PhaseMutations.SAVE_PHASE, phase);
      return phase;
    },
    async [PhaseActions.CREATE](context: MyActionContext<PhaseStoreState>, payload: Phase) {
      const response = await phaseRepository.create(payload);
      const phase = Phase.parseFromObject(response);
      context.commit(PhaseMutations.SAVE_PHASE, phase);
      return phase;
    },
    async [PhaseActions.UPDATE](context: MyActionContext<PhaseStoreState>, payload: Partial<Phase> & {
      id: string,
    }) {
      console.log('UDPATE', payload);
      const response = await phaseRepository.update(payload.id, payload);
      const phase = Phase.parseFromObject(response);
      context.commit(PhaseMutations.SAVE_PHASE, phase);
      return phase;
    },
    async [PhaseActions.DELETE](context: MyActionContext<PhaseStoreState>, payload: string) {
      await phaseRepository.delete(payload);
      context.commit(PhaseMutations.REMOVE_PHASE, payload);
    },
  },
  mutations: {
    [PhaseMutations.SAVE_PHASES](state: PhaseStoreState, phases: Phase[]) {
      state.phases = phases;
    },
    [PhaseMutations.SAVE_PHASE](state: PhaseStoreState, phase: Phase) {
      saveElementToArray(state.phases, 'id', phase);
    },
    [PhaseMutations.REMOVE_PHASE](state: PhaseStoreState, id: string) {
      removeFromArray(state.phases, 'id', id);
    },
  },
  getters: {
    phases(state: PhaseStoreState) {
      return state.phases;
    },
  },
};

export function usePhaseStore(): MyStore<typeof phaseStore> {
  phaseRepository.setAuthStore(useAuthStore());
  return baseUseStore<PhaseStoreState>(key);
}

export default createStore(phaseStore);
