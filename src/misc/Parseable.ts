export type KeyOf<Entity, V = any> = {
  [K in keyof Entity]-?: Entity[K] extends V ? K : never;
}[keyof Entity] &
  string;

export default abstract class Parseable {
  public id!: string;

  public static parseFromObject(object: Partial<Parseable>, target?: Parseable): Parseable {
    if (!target) {
      throw new Error('No Target specified: parseFromObject');
    }
    // static abstract methods are not allowed in ts :(
    return Object.assign(target, object);
  }

  public static parseFromArray(array: any[]): Parseable[] {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.map((obj) => this.parseFromObject(obj));
  }

  public abstract parseToObject(): any;

  /**
   * Creates a copy based on the parsedFromObject and parsedToObject functions.
   */
  public copy(): Parseable {
    return (this.constructor as any).parseFromObject(this.parseToObject());
  }
}
