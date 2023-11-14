import Parseable from '@/misc/Parseable';
import { DEFAULT_SETTINGS } from '@/helper/Constants';

export default class SettingsEntity extends Parseable {
  estimatedAvailability!: number;
  tacticalUnderload!: number;
  incrementPenaltyConstant!: number;
  novicePenaltyConstant!: number;
  teamSizePenaltyConstant!: number;
  skillPenaltyConstant!: number;
  sharedDeveloperPenalty!: number;
  timePenalty!: number;
  randomness!: number;
  similarResultCount!: number;
  worseResultCount!: number;
  innerLoopCount!: number;
  alpha!: number;
  initialTemperature!: number;
  tenantId?: string | null;
  projectId?: string | null;

  constructor(object?: Partial<SettingsEntity>) {
    super();
    Object.assign(this, DEFAULT_SETTINGS);
    if (object) {
      Object.assign(this, object);
    }
  }

  public static parseFromObject(object: Partial<SettingsEntity>, target: SettingsEntity = new SettingsEntity()): SettingsEntity {
    Parseable.parseFromObject(object, target);

    return target;
  }

  public parseToObject(): Pick<SettingsEntity, keyof SettingsEntity> {
    return { ...this };
  }
}