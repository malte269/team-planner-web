import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import Skill from '@/models/Skill';
import { Stores } from '@/store';

export default class SkillRepository extends EntityBaseRepository<Skill> {
  protected base: Stores = 'skill';
}
