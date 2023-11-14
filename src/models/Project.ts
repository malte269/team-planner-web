import { Details } from '@/models/Details';
import Issue from '@/models/Issue';
import Increment from '@/models/Increment';
import User from '@/models/user';
import Phase from '@/models/Phase';
import Group from '@/models/Group';
import SettingsEntity from '@/models/SettingsEntity';
import { DEFAULT_SETTINGS } from '@/helper/Constants';
import Tenant from '@/models/Tenant';

export default class Project extends Details<Project> {
  short!: string;
  skills!: string[];
  status!: ProjectStatus;
  settingsId?: string | null;
  settings!: SettingsEntity;
  users?: User[];
  tenantId!: string;
  tenant?: Tenant;
  issues?: Issue[];
  increments?: Increment[];
  modules?: Group[];
  phases?: Phase[];

  constructor(object?: Partial<Project>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Project>, target: Project = new Project()): Project {
    Details.parseFromObject(object, target);
    if (object.users) {
      target.users = User.parseFromArray(object.users) as User[];
    } else {
      target.users = [];
    }
    if (object.increments) {
      target.increments = Increment.parseFromArray(object.increments) as Increment[];
    } else {
      target.increments = [];
    }
    if (object.tenant) {
      target.tenant = Tenant.parseFromObject(object.tenant);
    }
    target.settings = SettingsEntity.parseFromObject(object.settings ?? target.tenant?.settings ?? DEFAULT_SETTINGS);

    return target;
  }

  parseToObject(): Pick<Project, keyof Project> {
    const tmp: Pick<Project, keyof Project> = { ...this };
    tmp.settings = this.settings!.parseToObject();
    return tmp;
  }
}

export enum ProjectStatus {
  /**
   * The project is not active, but also not finished
   */
  PENDING = 'pending',
  /**
   * The project is currently active
   */
  ACTIVE = 'active',
  /**
   * The project is finished
   */
  FINISHED = 'finished',
}

export const projectStatusItems = [
  {
    title: 'Bevorstehend',
    value: ProjectStatus.PENDING,
  },
  {
    title: 'Aktiv',
    value: ProjectStatus.ACTIVE,
  },
  {
    title: 'Fertig',
    value: ProjectStatus.FINISHED,
  },
];