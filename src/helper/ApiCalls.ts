import { QueryObject } from '@/interfaces/Request';

/**
 * Parses a QueryObject to a query. E.g.
 * {
 *   companyId: 1,
 *   userId: 1,
 * }
 * is parsed to
 * companyId=1,userId=1
 * @param queryObject
 */
export function parseQueryObject<Entity>(queryObject: QueryObject<Entity>) {
  return Object.keys(queryObject).map((key: string) => key + '=' + (Array.isArray(queryObject[key]) ? (queryObject[key] as string[]).join(',') : `${ queryObject[key] }`)).join('&');
}
