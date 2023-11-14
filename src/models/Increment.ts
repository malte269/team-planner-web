import { Details } from '@/models/Details';
import Project from '@/models/Project';
import Issue from '@/models/Issue';
import Phase from '@/models/Phase';
import Group from '@/models/Group';

export default class Increment extends Details<Increment> {
  incrementNumber!: number;
  projectId!: string;
  project?: Project;
  issues?: Issue[];
  phases?: Phase[];
  modules?: Group[];

  constructor(object?: Partial<Increment>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Increment>, target: Increment = new Increment()): Increment {
    Details.parseFromObject(object, target);
    if (object.phases) {
      target.phases = Phase.parseFromArray(object.phases) as Phase[];
    }
    if (object.modules) {
      target.modules = Group.parseFromArray(object.modules) as Group[];
    }
    if (object.issues) {
      target.issues = Issue.parseFromArray(object.issues) as Issue[];
    }
    if (object.project) {
      target.project = Project.parseFromObject(object.project);
    }
    return target;
  }

  parseToObject(): any {
    const tmp = { ...this };
    if (this.phases) {
      tmp.phases = this.phases.map((phase) => phase.parseToObject());
    }
    if (this.modules) {
      tmp.modules = this.modules.map((module) => module.parseToObject());
    }
    if (this.issues) {
      tmp.issues = this.issues.map((issue) => issue.parseToObject());
    }
    if (this.project) {
      tmp.project = this.project.parseToObject();
    }
    return tmp;
  }
}
