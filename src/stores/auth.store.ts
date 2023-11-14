import User from '@/models/user';
import { createStore, useStore } from 'vuex';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { InjectionKey } from 'vue';
import { AuthResponse, LoginBody } from '@/interfaces/Request';
import AuthRepository from '@/api/repositories/AuthRepository';
import VuexPersistence from 'vuex-persist';

const authRepository: AuthRepository = new AuthRepository();

export const key: InjectionKey<AuthState> = Symbol();

export enum AuthActions {
  LOGIN = 'loginAction',
  REFRESH_TOKEN = 'refreshToken',
}

export enum AuthMutations {
  SAVE_LOGIN = 'saveLogin',
  CLEAR_LOGIN = 'clearLogin',
  SAVE_USER = 'saveUser',
  CLEAR_FAILED_QUEUE = 'clearFailedQueue',
  PUSH_FAILED_REQUEST = 'pushFailedRequest',
  SET_IS_REFRESHING = 'setIsRefreshing',
}

const vuexPersistence = new VuexPersistence<AuthState>({
  key: import.meta.env.VITE_APP_TITLE!,
  reducer: (state) => {
    const retVal = {};
    for (const key of Object.keys(state).filter((key) => ['activeUser', 'token', 'refreshToken'].includes(key))) {
      retVal[key] = state[key];
    }
    return retVal;
  },
  storage: window.localStorage,
});

interface AuthState {
  activeUser: User | null,
  token: string,
  refreshToken: string,
  isRefreshing: boolean,
  failedQueue: any[],
}

const authState: AuthState = {
  activeUser: null,
  token: '',
  refreshToken: '',
  isRefreshing: false,
  failedQueue: [],
};

const authStore = {
  state: authState,
  actions: {
    async [AuthActions.LOGIN](context: MyActionContext<AuthState>, payload: LoginBody) {
      const response = await authRepository.login(payload);
      context.commit(AuthMutations.SAVE_LOGIN, response);
      return response;
    },
    async [AuthActions.REFRESH_TOKEN](context: MyActionContext<AuthState>, token: string) {
      const response = await authRepository.refreshToken(token);
      context.commit(AuthMutations.SAVE_LOGIN, response);
      return response;
    },
  },
  mutations: {
    [AuthMutations.SAVE_LOGIN](state: AuthState, login: AuthResponse) {
      state.token = login.access_token;
      state.refreshToken = login.refresh_token;
      (this as any as MyStore<typeof authStore>).commit(AuthMutations.SAVE_USER, login.user);
    },
    [AuthMutations.CLEAR_LOGIN](state: AuthState) {
      state.token = '';
      state.refreshToken = '';
      state.activeUser = null;
    },
    [AuthMutations.SAVE_USER](state: AuthState, user: User) {
      state.activeUser = User.parseFromObject(user);
    },
    [AuthMutations.CLEAR_FAILED_QUEUE](state: AuthState) {
      state.failedQueue = [];
    },
    [AuthMutations.PUSH_FAILED_REQUEST](state: AuthState, payload: { resolve: any, reject: any }) {
      state.failedQueue.push(payload);
    },
    [AuthMutations.SET_IS_REFRESHING](state: AuthState, payload: boolean) {
      state.isRefreshing = payload;
    },
  },
  getters: {
    activeUser(state: AuthState) {
      return state.activeUser;
    },
    token(state: AuthState) {
      return state.token;
    },
    refreshToken(state: AuthState) {
      return state.refreshToken;
    },
    isRefreshing(state: AuthState) {
      return state.isRefreshing;
    },
    failedQueue(state: AuthState) {
      return state.failedQueue;
    },
  },
};

export function useAuthStore(): MyStore<typeof authStore> {
  return useStore<AuthState>(key);
}

console.log('compiled authStore');

export default createStore({ ...authStore, plugins: [vuexPersistence.plugin] });
