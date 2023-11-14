import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import { Stores } from '@/store';
import Tenant from '@/models/Tenant';

export default class TenantRepository extends EntityBaseRepository<Tenant> {
  protected base: Stores = 'tenant';
}
