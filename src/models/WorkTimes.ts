import Parseable from '@/misc/Parseable';
import User from '@/models/user';
import { DateTime } from 'luxon';

export default class WorkTimes extends Parseable {
  monday!: number;
  tuesday!: number;
  wednesday!: number;
  thursday!: number;
  friday!: number;
  weeklyAmount!: number;
  validFrom!: DateTime | string | null;
  validTo!: DateTime | string | null;

  userId!: string;
  user?: User;

  constructor(object?: Partial<WorkTimes>) {
    super();
    Object.assign(this, object);
  }

  public static parseFromObject(object: Partial<WorkTimes>, target: WorkTimes = new WorkTimes()): WorkTimes {
    Parseable.parseFromObject(object, target);
    if (object.user) {
      target.user = User.parseFromObject(object.user);
    }
    if (typeof target.validFrom === 'string') {
      target.validFrom = DateTime.fromISO(target.validFrom);
    }
    if (typeof target.validTo === 'string') {
      target.validTo = DateTime.fromISO(target.validTo);
    }
    return target;
  }

  parseToObject(): { [key in keyof WorkTimes]: any } {
    const tmp = { ...this };
    if (this.user) {
      tmp.user = this.user.parseToObject();
    }
    return tmp;
  }
}