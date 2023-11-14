import Parseable from '@/misc/Parseable';
import { DateTime } from 'luxon';
import Project from '@/models/Project';
import Increment from '@/models/Increment';
import Group from '@/models/Group';
import User from '@/models/user';
import Phase from '@/models/Phase';

export enum SlotFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export default class Slot extends Parseable {
  public allocation!: number;
  public dateStart!: DateTime;
  public dateEnd!: DateTime;
  public frequency!: SlotFrequency;
  public projectId!: string;
  public project?: Project;
  public incrementId!: string;
  public increment?: Increment;
  public moduleId!: string;
  public module?: Group;
  public userId!: string;
  public user?: User;
  public phaseId!: string;
  public phase?: Phase;

  public constructor(object?: Partial<SlotFrequency>) {
    super();
    Object.assign(this, object);
  }

  static parseFromObject(object: Partial<Slot>, target: Slot = new Slot()) {
    Parseable.parseFromObject(object, target);
    ([
      { key: 'project', factory: Project },
      { key: 'user', factory: User },
      { key: 'increment', factory: Increment },
      { key: 'module', factory: Group },
      { key: 'phase', factory: Phase }] as Array<{
      key: keyof Slot,
      factory: typeof Parseable
    }>)
      .forEach(({
                  key,
                  factory,
                }) => {
        if (object[key]) {
          (target[key] as any) = factory.parseFromObject(object[key] as any);
        }
      });
    return target;
  }

  parseToObject(): any {
    const tmp = { ...this };
    (['project', 'user', 'increment', 'module', 'phase'] as (keyof Slot)[]).forEach((key) => {
      if (this[key]) {
        (tmp[key] as any) = (this[key] as Parseable).parseToObject();
      }
    });
    return tmp;
  }
}