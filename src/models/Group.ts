import { Details } from '@/models/Details';
import Project from '@/models/Project';
import Issue from '@/models/Issue';
import Increment from '@/models/Increment';
import Phase from '@/models/Phase';
import Parseable from '@/misc/Parseable';
import User from '@/models/user';

export default class Group extends Details<Group> {
  projectId!: string;
  project?: Project;
  parentId!: string | null;
  parent?: Group | null;
  children?: Group[];
  issues?: Issue[];
  increments?: Increment[];
  phases?: Phase[];
  users?: User[];

  constructor(object?: Partial<Group>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Group>, target: Group = new Group()): Group {
    Details.parseFromObject(object, target);
    if (object.project) {
      target.project = Project.parseFromObject(object.project);
    }
    if (object.parent) {
      target.parent = Group.parseFromObject(object.parent);
    }
    ([
      { key: 'children', factory: Group },
      { key: 'issues', factory: Issue },
      { key: 'increments', factory: Increment },
      { key: 'users', factory: User },
      { key: 'phases', factory: Phase }] as Array<{
      key: keyof Group,
      factory: typeof Parseable
    }>)
      .forEach(({
                  key,
                  factory,
                }) => {
        if (object[key]) {
          (target[key] as any) = factory.parseFromArray(object[key] as any);
        }
      });
    return target;
  }

  parseToObject(): any {
    const tmp = { ...this };
    if (this.increments) {
      tmp.increments = this.increments.map((inc) => inc.parseToObject());
    }
    if (this.issues) {
      tmp.issues = this.issues.map((issue) => issue.parseToObject());
    }
    if (this.phases) {
      tmp.phases = this.phases.map((phase) => phase.parseToObject());
    }
    if (this.parent) {
      tmp.parent = this.parent.parseToObject();
    }
    return tmp;
  }
}
