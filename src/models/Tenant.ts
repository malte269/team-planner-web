import Parseable from '@/misc/Parseable';
import SettingsEntity from '@/models/SettingsEntity';
import { DEFAULT_SETTINGS } from '@/helper/Constants';

export default class Tenant extends Parseable {
  name!: string;
  settingsId?: string | null;
  settings!: SettingsEntity;

  constructor(object?: Partial<Tenant>) {
    super();
    if (object) {
      Object.assign(this, object);
    }
    this.settings = this.settings ?? SettingsEntity.parseFromObject(DEFAULT_SETTINGS);
  }

  public static parseFromObject(object: Partial<Tenant>, target: Tenant = new Tenant()): Tenant {
    Parseable.parseFromObject(object, target);

    target.settings = SettingsEntity.parseFromObject(object.settings ?? DEFAULT_SETTINGS);
    return target;
  }

  public parseToObject(): Pick<Tenant, keyof Tenant> {
    const tmp: Pick<Tenant, keyof Tenant> = { ...this };
    tmp.settings = this.settings?.parseToObject() ?? null;
    return tmp;
  }
}