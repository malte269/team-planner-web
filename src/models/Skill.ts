import Parseable from '@/misc/Parseable';

export default class Skill extends Parseable {
  public name!: string;

  constructor(object?: Partial<Skill>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Skill>, target: Skill = new Skill()): Skill {
    return Parseable.parseFromObject(object, target) as Skill;
  }

  parseToObject(): any {
    return { ...this };
  }
}