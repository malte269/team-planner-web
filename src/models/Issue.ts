import User from './user';
import { Details } from '@/models/Details';
import Increment from '@/models/Increment';
import Group from '@/models/Group';
import Phase from '@/models/Phase';
import { FamilyInterface } from '@/interfaces/Family.interface';
import Project from '@/models/Project';

export enum IssueType {
  EPIC = 'epic',
  USER_STORY = 'userStory',
  TASK = 'task',
  SUB_TASK = 'subTask',
  BUG = 'bug',
}

export enum IssueStatus {
  UNTOUCHED = 'untouched',
  IN_PROGRESS = 'inProgress',
  FINISHED = 'finished',
}

export default class Issue extends Details<Issue> implements FamilyInterface<Issue> {
  tenantId!: string;
  status: IssueStatus;
  type!: IssueType;
  description: string;
  identifier!: string;
  skills!: string[];

  userId!: string;
  user?: User;

  projectId!: string;
  project?: Project;
  incrementId!: string;
  increment?: Increment;
  groupId!: string | null;
  group?: Group | null;
  phaseId!: string | null;
  phase?: Phase | null;

  parentId!: string;
  parent?: Issue | null;
  children?: Issue[];

  previous?: Issue[];
  following?: Issue[];

  constructor(object?: Partial<Issue>) {
    super();
    this.children = [];
    this.description = '';
    this.status = IssueStatus.UNTOUCHED;
    Object.assign(this, object);
    this.teamSize = 1;
  }

  static parseFromObject(object: Partial<Issue>, target: Issue = new Issue()) {
    Details.parseFromObject(object, target);
    if (target.userId && target.user) {
      target.user = User.parseFromObject(target.user);
    } else {
      delete target.user;
    }
    (['children', 'previous', 'following'] as (keyof Issue)[]).forEach((key) => {
      if (object[key]) {
        (target[key] as any[]) = Issue.parseFromArray(object[key] as any[]);
      }
    });
    target.teamSize = 1;
    return target;
  }

  public static parseDefaultSubType(parentType: IssueType) {
    switch (parentType) {
      case IssueType.EPIC:
        return IssueType.USER_STORY;
      case IssueType.USER_STORY:
        return IssueType.TASK;
      default:
        return IssueType.SUB_TASK;
    }
  }

  public static getAllowedSubTypes(parentType: IssueType) {
    switch (parentType) {
      case IssueType.EPIC:
        return [IssueType.USER_STORY, IssueType.TASK, IssueType.BUG];
      case IssueType.USER_STORY:
        return [IssueType.TASK, IssueType.BUG];
      case IssueType.TASK:
        return [IssueType.SUB_TASK];
      default:
        return [];
    }
  }

  public static getAllowedParentTypes(type?: IssueType) {
    switch (type) {
      case IssueType.SUB_TASK:
        return [IssueType.TASK];
      case IssueType.BUG:
      case IssueType.TASK:
        return [IssueType.EPIC, IssueType.USER_STORY];
      case IssueType.USER_STORY:
        return [IssueType.EPIC];
      default:
        return [];
    }
  }

  parseToObject(): any {
    const tmp: Partial<Issue> = { ...this };
    if (this.user) {
      tmp.user = this.user.parseToObject();
    }
    (['children', 'previous', 'following'] as (keyof Issue)[]).forEach((key) => {
      if (this[key]) {
        (tmp[key] as any[]) = (this[key] as Issue[]).map((el) => el.parseToObject());
      }
    });
    return tmp;
  }
}

export const issueStatusItems = [
  {
    value: IssueStatus.UNTOUCHED,
    title: 'Zu erledigen',
  }, {
    value: IssueStatus.IN_PROGRESS,
    title: 'In Arbeit',
  }, {
    value: IssueStatus.FINISHED,
    title: 'Fertig',
  },
];