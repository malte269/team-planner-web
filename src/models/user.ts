import Parseable from '@/misc/Parseable';
import Project from '@/models/Project';
import Slot from '@/models/Slot';
import Issue from '@/models/Issue';
import WorkTimes from '@/models/WorkTimes';

export default class User extends Parseable {
  public email!: string;
  public password?: string;
  public firstName!: string;
  public lastName!: string;
  public income!: number;
  public isExpert!: boolean;
  public skills!: string[];
  public role?: string;
  public tenantId!: string;
  public workTimes: WorkTimes[];
  public slots?: Slot[];
  public projects?: Project[];
  public issues?: Issue[];

  constructor(object?: Partial<User>) {
    super();
    if (object) {
      Object.assign(this, object);
    }
    if (!this.skills) {
      this.skills = [];
    }
    this.workTimes = [new WorkTimes({ weeklyAmount: 0 })];
  }

  public get fullName() {
    return `${ this.firstName } ${ this.lastName }`;
  }

  public static parseFromObject(object: Partial<User>, user: User = new User()): User {
    Parseable.parseFromObject(object, user);
    if (object.projects) {
      user.projects = Project.parseFromArray(object.projects) as Project[];
    }
    if (object.issues) {
      user.issues = Issue.parseFromArray(object.issues) as Issue[];
    }
    if (object.slots) {
      user.slots = Slot.parseFromArray(object.slots) as Slot[];
    }
    if (!user.skills) {
      user.skills = [];
    }
    return user;
  }

  public hasSkill(skillName: string): boolean {
    return this.getSkillIndex(skillName) > -1;
  }

  public getSkillIndex(skillName: string): number {
    return this.skills?.findIndex((userSkill: string) => {
      return skillName === userSkill.split('+')[0];
    }) ?? -1;
  }

  parseToObject(): any {
    const tmp = { ...this };
    if (this.projects) {
      tmp.projects = Project.parseFromArray(this.projects) as Project[];
    }
    if (this.issues) {
      tmp.issues = Issue.parseFromArray(this.issues) as Issue[];
    }
    if (this.slots) {
      tmp.slots = Slot.parseFromArray(this.slots) as Slot[];
    }
    return tmp;
  }
}
