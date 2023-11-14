import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import User from '@/models/user';
import { Stores } from '@/store';

export default class UserRepository extends EntityBaseRepository<User> {
  protected base: Stores = 'user';
}