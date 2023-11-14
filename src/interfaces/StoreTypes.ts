import { ActionContext, CommitOptions, DispatchOptions, Store } from 'vuex';

type ExtendDispatch<StoreType extends { [key: string]: any }> = {
  <Key extends keyof StoreType & string>(type: Key, payload?: Parameters<StoreType[Key]>[1], options?: DispatchOptions): ReturnType<StoreType[Key]>;
}

type ExtendCommit<StoreType extends { [key: string]: any }> = {
  <Key extends keyof StoreType & string>(type: Key, payload?: Parameters<StoreType[Key]>[1], options?: CommitOptions): void;
}

type ExtendGetter<StoreType extends { [key: string]: any }> = {
  [key in keyof StoreType & string]: ReturnType<StoreType[key]>;
}

export type MyStore<StoreImpl extends { state: any, actions: any, getters: any, mutations: any }> =
  Omit<Store<StoreImpl['state']>, 'dispatch' | 'commit' | 'getters'>
  & {
  dispatch: ExtendDispatch<StoreImpl['actions']>;
  commit: ExtendCommit<StoreImpl['mutations']>;
  getters: ExtendGetter<StoreImpl['getters']>;
};

export type MyActionContext<State> = ActionContext<State, State>;
