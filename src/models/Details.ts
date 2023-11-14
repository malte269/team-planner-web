import { DateTime } from 'luxon';
import Parseable from '@/misc/Parseable';
import { TimelineInterface } from '@/interfaces/Timeline.interface';

export abstract class Details<Model extends Parseable> extends Parseable implements TimelineInterface<Model> {
  public name!: string;
  description!: string | null;
  startDateSoft!: DateTime | string | null;
  startDateHard!: DateTime | string | null;
  endDateSoft!: DateTime | string | null;
  endDateHard!: DateTime | string | null;
  duration!: number | null;
  unit: DurationUnit | null;
  teamSize!: number | null;

  protected constructor() {
    super();
    this.unit = DurationUnit.PT;
  }

  get startDateSoftIso(): string {
    return (this.startDateSoft as DateTime)?.toISODate() ?? '';
  }

  set startDateSoftIso(value: string) {
    this.startDateSoft = DateTime.fromISO(value);
  }

  get startDateHardIso() {
    return (this.startDateHard as DateTime)?.toISODate() ?? '';
  }

  set startDateHardIso(value: string) {
    this.startDateHard = DateTime.fromISO(value);
  }

  get endDateSoftIso() {
    return (this.endDateSoft as DateTime)?.toISODate() ?? '';
  }

  set endDateSoftIso(value: string) {
    this.endDateSoft = DateTime.fromISO(value);
  }

  get endDateHardIso() {
    return (this.endDateHard as DateTime)?.toISODate() ?? '';
  }

  set endDateHardIso(value: string) {
    this.endDateHard = DateTime.fromISO(value);
  }

  public static parseFromObject(object: Partial<Details<any>>, target?: Details<any>): Details<any> {
    Parseable.parseFromObject(object, target);
    (['startDateSoft', 'startDateHard', 'endDateSoft', 'endDateHard'] as (keyof Details<any>)[]).forEach((key) => {
      if (target![key]) {
        if (typeof target![key] === 'string') {
          (target![key] as any) = DateTime.fromISO(target![key] as any);
        }
      }
    });
    return target!;
  }

  public copy(): Model {
    return super.copy() as Model;
  }
}

export enum DurationUnit {
  // in months. Equals 4 weeks
  MONTHS = 'months',
  // in weeks. Equals 7d of 24h
  WEEKS = 'weeks',
  // In days. Equals 24h
  DAYS = 'days',
  // in hours
  HOURS = 'hours',
  // person weeks. Equals 5d of 8h
  PW = 'pw',
  // person days. Equals 8h
  PT = 'pt',
}