import { createStore, useStore as baseUseStore } from 'vuex';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import Issue from '@/models/Issue';
import { InjectionKey } from 'vue';
import IssueRepository from '@/api/repositories/IssueRepository';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';

const issueRepository: IssueRepository = RepositoryFactory.get('issue');

export const key: InjectionKey<typeof issueStore['state']> = Symbol();

export enum IssueActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE_ISSUE = 'createIssue',
  UPDATE_ISSUE = 'updateIssue',
  DELETE_ISSUE = 'deleteIssue',
}

export enum IssueMutations {
  SAVE_ISSUES = 'saveIssues',
  SAVE_ISSUE = 'saveIssue',
  SET_ACTIVE_ISSUE = 'setActiveIssue',
  CLEAR_ACTIVE_ISSUE = 'clearActiveIssue',
  REMOVE_ISSUE = 'removeIssue',
}

type IssueStoreState = {
  issues: Issue[];
  issue: Issue | null;
}

const storeState: IssueStoreState = {
  issues: new Array<Issue>(0),
  issue: null,
};

const issueStore = {
  state: storeState,
  actions: {
    [IssueActions.FIND_ALL]: async (context: MyActionContext<IssueStoreState>, payload: QueryObject<Issue> | {
      query: QueryObject<Issue>,
      save?: boolean
    } = {}) => {
      let query: any = payload.query;
      const save = payload.save ?? true;
      delete payload.save;
      if (!query) {
        query = payload as QueryObject<Issue>;
      }
      const response = await issueRepository.findAll(query);
      const issues = Issue.parseFromArray(response.records);
      if (save) {
        context.commit(IssueMutations.SAVE_ISSUES, issues);
      }
      return issues;
    },
    [IssueActions.FIND_ONE]: async (context: MyActionContext<IssueStoreState>, payload: string) => {
      const response = await issueRepository.findOne(payload);
      const issue = Issue.parseFromObject(response);
      context.commit(IssueMutations.SET_ACTIVE_ISSUE, issue);
      return issue;
    },
    [IssueActions.CREATE_ISSUE]: async (context: MyActionContext<IssueStoreState>, payload: {
      body: Issue,
      save: boolean
    } | Issue) => {
      let body = (payload as any).body;
      const save = (payload as any).save ?? true;
      if (body === undefined) {
        body = payload;
      }
      const response = await issueRepository.create(body);
      const issue = Issue.parseFromObject(response);
      if (save) {
        context.commit(IssueMutations.SAVE_ISSUE, issue);
      }
      return issue;
    },
    [IssueActions.UPDATE_ISSUE]: async (context: MyActionContext<IssueStoreState>, payload: Partial<Issue> & Required<{
      id: string
    }> | {
      body: Partial<Issue> & Required<{
        id: string
      }>, save: boolean
    }) => {
      let body = (payload as any).body;
      const save = (payload as any).save ?? true;
      if (body === undefined) {
        body = payload;
      }
      const response = await issueRepository.update(body.id, body);
      if (save) {
        context.commit(IssueMutations.SAVE_ISSUE, response);
      }
      return response;
    },
    [IssueActions.DELETE_ISSUE]: async (context: MyActionContext<IssueStoreState>, payload: string) => {
      await issueRepository.delete(payload);
      context.commit(IssueMutations.REMOVE_ISSUE, payload);
    },
  },
  mutations: {
    [IssueMutations.SAVE_ISSUES](state: IssueStoreState, issues: Issue[]) {
      state.issues = issues;
    },
    [IssueMutations.SAVE_ISSUE](state: IssueStoreState, issue: Issue) {
      saveElementToArray(state.issues, 'id', issue);
    },
    [IssueMutations.SET_ACTIVE_ISSUE](state: IssueStoreState, issue: Issue) {
      state.issue = Issue.parseFromObject(issue);
    },
    [IssueMutations.CLEAR_ACTIVE_ISSUE](state: IssueStoreState) {
      state.issue = null;
    },
    [IssueMutations.REMOVE_ISSUE](state: IssueStoreState, id: string) {
      removeFromArray(state.issues, 'id', id);
    },
  },
  getters: {
    issues(state: IssueStoreState) {
      return state.issues;
    },
    activeIssue(state: IssueStoreState) {
      return state.issue;
    },
  },
};

export function useIssueStore(): MyStore<typeof issueStore> {
  issueRepository.setAuthStore(useAuthStore());
  return baseUseStore<IssueStoreState>(key);
}

export default createStore({
  ...issueStore,
});
