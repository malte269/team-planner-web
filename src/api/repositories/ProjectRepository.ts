import EntityBaseRepository from '@/api/repositories/EntityBaseRepository';
import Project from '@/models/Project';
import { Stores } from '@/store';
import SettingsEntity from '@/models/SettingsEntity';

export default class ProjectRepository extends EntityBaseRepository<Project> {
  protected base: Stores = 'project';

  public createTeam(projectId: string, settings: SettingsEntity): Promise<Project> {
    return this.axiosClient.post(`${ this.base }/${ projectId }/allocation`, settings);
  }

  public createTeams(projectIds: string[], settings: SettingsEntity): Promise<Project[]> {
    return this.axiosClient.post(`${ this.base }/allocate/multiple`, { projects: projectIds, settings });
  }

  public exchangeUser(projectId: string, oldUserId: string, newUserId: string): Promise<Project> {
    return this.axiosClient.patch(`${ this.base }/${ projectId }/exchange-user/${ oldUserId }/${ newUserId }`);
  }

  public saveProjectTeam(projectId: string, users: string[]): Promise<Project> {
    return this.axiosClient.patch(`${ this.base }/${ projectId }/save-team/`, {
      users,
    });
  }
}
