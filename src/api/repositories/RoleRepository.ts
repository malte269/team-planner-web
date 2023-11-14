import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import Role from '@/models/Role';
import { Stores } from '@/store';

export default class RoleRepository extends EntityBaseRepository<Role> {
  protected base: Stores = 'role';
}