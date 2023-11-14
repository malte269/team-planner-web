import { KeyOf } from '@/misc/Parseable';

export function sortArray<Model>(
  arr: Model[],
  desc: boolean,
  attr: ((el: Model) => number | string) | KeyOf<Model, string | number | undefined>): Model[];
export function sortArray(arr: number[], desc: boolean): number[];
export function sortArray(arr: string[], desc: boolean): string[];

export function sortArray<Model>(
  arr: Model[],
  desc: boolean,
  attributeOrCallback?: ((el: Model) => number | string) | KeyOf<Model>,
): Model[] {
  const callback =
    typeof attributeOrCallback === 'function' ?
      attributeOrCallback :
      (el: Model) => (attributeOrCallback ? el[attributeOrCallback] : el);
  return arr.sort((a, b) =>
    desc ?
      callback(a) < callback(b) ? 1 : -1 :
      callback(a) > callback(b) ? 1 : -1);
}

export function saveElementToArray(arr: number[], value: number): void;
export function saveElementToArray(arr: string[], value: string): void;
export function saveElementToArray<Model>(arr: Model[], call: (el: Model) => boolean, el: Model): void;
export function saveElementToArray<Model>(arr: Model[], compareKey: KeyOf<Model, string | number | undefined>, el: Model): void;
export function saveElementToArray<Model>(arr: Model[], a_c_v: ((el: Model) => boolean) | KeyOf<Model> | Model, value?: Model) {
  const callback = typeof a_c_v === 'function' ?
    a_c_v as () => boolean :
    (!!value ?
      (el: Model) => (el[a_c_v as string] === value![a_c_v as string]) :
      (el: Model) => el === a_c_v);
  const index = arr.findIndex(callback);
  value = value ?? a_c_v as any;
  if (index > -1) {
    arr.splice(index, 1, value as Model);
  } else {
    arr.push(value as Model);
  }
}

export function removeFromArray(arr: string[], value: string): void;
export function removeFromArray(arr: number[], value: number): void;
export function removeFromArray<Model>(arr: Model[], callback: ((el: Model) => boolean)): void;
export function removeFromArray<Model>(arr: Model[], attr: KeyOf<Model, string | number | undefined>, value: string | number): void;

export function removeFromArray<Model>(arr: Model[], a_c_v: ((el: Model) => boolean) | KeyOf<Model> | string | number, value?: string | number): void {
  const callback = typeof a_c_v === 'function' ? a_c_v : !!value ? (el: Model) => el[a_c_v as KeyOf<Model>] === value : (el: Model) => (el === a_c_v);
  const index = arr.findIndex(callback);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
