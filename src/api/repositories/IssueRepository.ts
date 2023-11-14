import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import Issue from '@/models/Issue';
import { Stores } from '@/store';

export default class IssueRepository extends EntityBaseRepository<Issue> {
  protected base: Stores = 'issue';
}
