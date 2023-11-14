import { InjectionKey } from 'vue';
import Skill from '@/models/Skill';
import { createStore, useStore as baseUseStore } from 'vuex';
import { RepositoryFactory } from '@/api/RepositoryFactory';
import SkillRepository from '@/api/repositories/SkillRepository';
import { MyActionContext, MyStore } from '@/interfaces/StoreTypes';
import { removeFromArray, saveElementToArray } from '@/helper/Arrays';
import { QueryObject } from '@/interfaces/Request';
import { useAuthStore } from '@/stores/auth.store';

const skillRepository: SkillRepository = RepositoryFactory.get('skill');

export const key: InjectionKey<typeof storeState> = Symbol();

export enum SkillActions {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE_SKILL = 'createSkill',
  DELETE_SKILL = 'deleteSkill',
}

export enum SkillMutations {
  SAVE_SKILLS = 'saveSkills',
  SAVE_SKILL = 'saveSkill',
  REMOVE_SKILL = 'removeSkill',
}

type SkillStoreState = {
  skills: Skill[];
}

const storeState: SkillStoreState = {
  skills: new Array<Skill>(0),
};

const skillStore = {
  state: storeState,
  actions: {
    [SkillActions.FIND_ALL]: async (context: MyActionContext<SkillStoreState>, payload: QueryObject<Skill> = {}) => {
      const response = await skillRepository.findAll(payload);
      const skills = Skill.parseFromArray(response.records);
      context.commit(SkillMutations.SAVE_SKILLS, skills);
      return skills;
    },
    [SkillActions.FIND_ONE]: async (context: MyActionContext<SkillStoreState>, payload: string) => {
      const response = await skillRepository.findOne(payload);
      const skill = Skill.parseFromObject(response);
      context.commit(SkillMutations.SAVE_SKILL, skill);
      return skill;
    },
    [SkillActions.CREATE_SKILL]: async (context: MyActionContext<SkillStoreState>, payload: Skill) => {
      const response = await skillRepository.create(payload);
      const skill = Skill.parseFromObject(response);
      context.commit(SkillMutations.SAVE_SKILL, skill);
      return skill;
    },
    [SkillActions.DELETE_SKILL]: async (context: MyActionContext<SkillStoreState>, payload: string) => {
      await skillRepository.delete(payload);
      context.commit(SkillMutations.REMOVE_SKILL, payload);
    },
  },
  mutations: {
    [SkillMutations.SAVE_SKILLS](state: SkillStoreState, skills: Skill[]) {
      state.skills = skills;
    },
    [SkillMutations.SAVE_SKILL](state: SkillStoreState, skill: Skill) {
      saveElementToArray(state.skills, 'id', skill);
    },
    [SkillMutations.REMOVE_SKILL](state: SkillStoreState, skillId: string) {
      removeFromArray(state.skills, 'id', skillId);
    },
  },
  getters: {
    skills(state: typeof storeState): Skill[] {
      return state.skills;
    },
  },
};

export function useSkillStore(): MyStore<typeof skillStore> {
  skillRepository.setAuthStore(useAuthStore());
  return baseUseStore<typeof skillStore['state']>(key);
}

export default createStore(skillStore);
