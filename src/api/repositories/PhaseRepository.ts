import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import { Stores } from '@/store';
import Phase from '@/models/Phase';

export default class PhaseRepository extends EntityBaseRepository<Phase> {
  protected base: Stores = 'phase';
}
