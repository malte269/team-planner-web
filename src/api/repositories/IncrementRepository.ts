import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import { Stores } from '@/store';
import Increment from '@/models/Increment';

export default class IncrementRepository extends EntityBaseRepository<Increment> {
  protected base: Stores = 'increment';
}
