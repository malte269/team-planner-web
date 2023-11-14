import Parseable from '@/misc/Parseable';

export default class Role extends Parseable {
  public name!: string;

  constructor(object?: Partial<Role>) {
    super();
    Object.assign(this, object);
  }

  parseToObject(): any {
    return { ...this };
  }
}