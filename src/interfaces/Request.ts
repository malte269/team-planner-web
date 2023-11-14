import User from '@/models/user';
import { KeyOf } from '@/misc/Parseable';

export interface FindAllResponse<Model> {
  total: number;
  records: Model[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export type LoginBody = { username: string, password: string };

export type QueryObject<Entity> =
// KeyOf<Entity> is for autosuggestion feature but does not work in .vue files properly :(
  { [key in KeyOf<Entity, undefined | number | string | string[]>]?: number | string | string[] | null }
  & {
  // The query is not restricted to Entity Props only :)
  [key: string]: number | string | string[] | null
}
