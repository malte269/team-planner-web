import { Details } from '@/models/Details';
import Project from '@/models/Project';
import Increment from '@/models/Increment';
import Issue from '@/models/Issue';
import Group from '@/models/Group';

export default class Phase extends Details<Phase> {
  order!: number;
  projectId!: string;
  project?: Project;
  requiredRoles!: string[] | null;
  incrementId!: string;
  increment?: Increment;
  issues?: Issue[];
  modules?: Group[];

  constructor(object?: Partial<Phase>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Phase>, target: Phase = new Phase()): Phase {
    Details.parseFromObject(object, target);
    if (object.project) {
      target.project = Project.parseFromObject(object.project);
    }
    if (object.modules) {
      target.modules = Group.parseFromArray(object.modules) as Group[];
    }
    if (object.issues) {
      target.issues = Issue.parseFromArray(object.issues) as Issue[];
    }
    if (object.increment) {
      target.increment = Increment.parseFromObject(object.increment);
    }
    return target;
  }

  parseToObject(): any {
    const tmp = { ...this };
    if (this.project) {
      tmp.project = this.project.parseToObject();
    }
    if (this.issues) {
      tmp.issues = this.issues.map((issue) => issue.parseToObject());
    }
    if (this.modules) {
      tmp.modules = this.modules.map((group) => group.parseToObject());
    }
    return tmp;
  }
}
