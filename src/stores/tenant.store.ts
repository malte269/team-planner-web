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
import TenantRepository from '@/api/repositories/TenantRepository';
import Tenant from '@/models/Tenant';

const tenantRepository: TenantRepository = RepositoryFactory.get('tenant');

export const key: InjectionKey<TenantStoreState> = Symbol();

export enum TenantActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum TenantMutations {
  SAVE_TENANTS = 'saveTenants',
  SAVE_TENANT = 'saveTenant',
  SAVE_ACTIVE_TENANT = 'saveActiveTenant',
  REMOVE_TENANT = 'removeTenant',
}

type TenantStoreState = {
  tenants: Tenant[];
  activeTenant: Tenant | null;
}

const storeState: TenantStoreState = {
  tenants: [],
  activeTenant: null,
};

const tenantStore = {
  state: storeState,
  actions: {
    async [TenantActions.FIND_ALL](context: MyActionContext<TenantStoreState>, payload: QueryObject<Tenant> = {}) {
      const response = await tenantRepository.findAll(payload);
      const tenants = Tenant.parseFromArray(response.records);
      context.commit(TenantMutations.SAVE_TENANTS, tenants);
      if (tenants.length === 1) {
        context.commit(TenantMutations.SAVE_ACTIVE_TENANT, tenants[0]);
      }
      return tenants;
    },
    async [TenantActions.FIND_ONE](context: MyActionContext<TenantStoreState>, payload: string) {
      const response = await tenantRepository.findOne(payload);
      const tenant = Tenant.parseFromObject(response);
      context.commit(TenantMutations.SAVE_ACTIVE_TENANT, tenant);
      return tenant;
    },
    async [TenantActions.CREATE](context: MyActionContext<TenantStoreState>, payload: Tenant) {
      const response = await tenantRepository.create(payload);
      const tenant = Tenant.parseFromObject(response);
      context.commit(TenantMutations.SAVE_TENANT, tenant);
      return tenant;
    },
    async [TenantActions.UPDATE](context: MyActionContext<TenantStoreState>, payload: Partial<Tenant> & {
      id: string,
    }) {
      const response = await tenantRepository.update(payload.id, payload);
      const tenant = Tenant.parseFromObject(response);
      context.commit(TenantMutations.SAVE_TENANT, tenant);
      return tenant;
    },
    async [TenantActions.DELETE](context: MyActionContext<TenantStoreState>, payload: string) {
      await tenantRepository.delete(payload);
      context.commit(TenantMutations.REMOVE_TENANT, payload);
    },
  },
  mutations: {
    [TenantMutations.SAVE_TENANTS](state: TenantStoreState, tenants: Tenant[]) {
      state.tenants = tenants;
    },
    [TenantMutations.SAVE_TENANT](state: TenantStoreState, tenant: Tenant) {
      saveElementToArray(state.tenants, 'id', tenant);
    },
    [TenantMutations.SAVE_ACTIVE_TENANT](state: TenantStoreState, tenant: Tenant | string) {
      if (typeof tenant === 'string') {
        tenant = state.tenants.find((storeTenant) => storeTenant.id === tenant)!;
      }
      state.activeTenant = tenant as Tenant;
    },
    [TenantMutations.REMOVE_TENANT](state: TenantStoreState, id: string) {
      removeFromArray(state.tenants, 'id', id);
    },
  },
  getters: {
    tenants(state: TenantStoreState) {
      return state.tenants;
    },
    activeTenant(state: TenantStoreState) {
      return state.activeTenant;
    },
  },
};

export function useTenantStore(): MyStore<typeof tenantStore> {
  tenantRepository.setAuthStore(useAuthStore());
  return baseUseStore<TenantStoreState>(key);
}

export default createStore(tenantStore);
