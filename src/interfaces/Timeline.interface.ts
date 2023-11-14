import { DurationUnit } from '@/models/Details';
import { DateTime } from 'luxon';

export interface TimelineInterface<Module> {
  id: string;
  startDateSoft: string | DateTime | null;
  startDateHard: string | DateTime | null;
  endDateSoft: string | DateTime | null;
  endDateHard: string | DateTime | null;
  duration: number | null;
  unit: DurationUnit | null;

  // subclasses could overwrite these, but they don't have to
  following?: TimelineInterface<Module>[];
  previous?: TimelineInterface<Module>[];
}