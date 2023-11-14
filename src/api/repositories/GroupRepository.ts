import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import { Stores } from '@/store';
import Group from '@/models/Group';

export default class GroupRepository extends EntityBaseRepository<Group> {
  protected base: Stores = 'group';
}
