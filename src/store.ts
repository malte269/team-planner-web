import { Store } from 'vuex';
import { InjectionKey } from 'vue';
import authStore, { key as authKey } from '@/stores/auth.store';
import projectStore, { key as projectKey } from '@/stores/project.store';
import issueStore, { key as issueKey } from '@/stores/issue.store';
import skillStore, { key as skillKey } from '@/stores/skill.store';
import roleStore, { key as roleKey } from '@/stores/role.store';
import userStore, { key as userKey } from '@/stores/user.store';
import groupStore, { key as groupKey } from '@/stores/group.store';
import incrementStore, { key as incrementKey } from '@/stores/increment.store';
import phaseStore, { key as phaseKey } from '@/stores/phase.store';
import tenantStore, { key as tenantKey } from '@/stores/tenant.store';

export type Stores =
  'project'
  | 'issue'
  | 'skill'
  | 'auth'
  | 'role'
  | 'user'
  | 'increment'
  | 'group'
  | 'phase'
  | 'tenant';

export const stores: { [key in Stores]: { store: Store<any>, key: InjectionKey<any> } } = {
  auth: { store: authStore, key: authKey },
  project: { store: projectStore, key: projectKey },
  increment: { store: incrementStore, key: incrementKey },
  group: { store: groupStore, key: groupKey },
  phase: { store: phaseStore, key: phaseKey },
  issue: { store: issueStore, key: issueKey },
  skill: { store: skillStore, key: skillKey },
  role: { store: roleStore, key: roleKey },
  user: { store: userStore, key: userKey },
  tenant: { store: tenantStore, key: tenantKey },
};
