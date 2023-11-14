import { Stores } from '@/store';
import ProjectRepository from '@/api/repositories/ProjectRepository';
import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import SkillRepository from '@/api/repositories/SkillRepository';
import AuthRepository from '@/api/repositories/AuthRepository';
import AuthBaseRepository from '@/api/repositories/AuthBaseRepository';
import RoleRepository from '@/api/repositories/RoleRepository';
import UserRepository from '@/api/repositories/UserRepository';
import IncrementRepository from '@/api/repositories/IncrementRepository';
import GroupRepository from '@/api/repositories/GroupRepository';
import IssueRepository from '@/api/repositories/IssueRepository';
import PhaseRepository from '@/api/repositories/PhaseRepository';
import TenantRepository from '@/api/repositories/TenantRepository';

type RepoType = {
  [key in Stores]: {
    repository: { new(): EntityBaseRepository<any> | AuthBaseRepository };
    instance: EntityBaseRepository<any> | AuthBaseRepository | null;
  }
}

const repositories: RepoType = {
  project: { repository: ProjectRepository, instance: null },
  increment: { repository: IncrementRepository, instance: null },
  group: { repository: GroupRepository, instance: null },
  phase: { repository: PhaseRepository, instance: null },
  issue: { repository: IssueRepository, instance: null },
  skill: { repository: SkillRepository, instance: null },
  auth: { repository: AuthRepository, instance: null },
  role: { repository: RoleRepository, instance: null },
  user: { repository: UserRepository, instance: null },
  tenant: { repository: TenantRepository, instance: null },
};

/**
 *  Factory to create repositories. All created repositories are singleton instances.
 */
export const RepositoryFactory = {
  get: (name: keyof RepoType): any => {
    if (!repositories[name].instance) {
      repositories[name].instance = new repositories[name].repository();
    }
    return repositories[name].instance!;
  },
};
