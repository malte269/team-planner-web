import { NavigationItemInterface } from '@/interfaces/NavigationItem.interface';
import { Views } from '@/views';

export const NavigationItemsStorage: NavigationItemInterface[] =
  [
    {
      icon: 'mdi-factory',
      title: 'Projekte',
      routerName: Views.PROJECT_VIEW,
      dropdownOptions: [],
    },
    {
      icon: 'mdi-timeline',
      title: 'Sprintübersicht',
      routerName: Views.INCREMENT_VIEW,
      dropdownOptions: [],
      projectRequired: true,
      props: ['projectId'],
    },
    {
      icon: 'mdi-clock',
      title: 'Zeitleiste',
      routerName: Views.TIMELINE_VIEW,
      dropdownOptions: [],
      projectRequired: true,
      props: ['projectId'],
    },
    {
      icon: 'mdi-view-list',
      title: 'Backlog',
      routerName: Views.BACKLOG_VIEW,
      dropdownOptions: [],
      projectRequired: true,
      props: ['projectId'],
    },
    {
      icon: 'mdi-group',
      title: 'Gruppen',
      routerName: Views.GROUP_VIEW,
      dropdownOptions: [],
      projectRequired: true,
      props: ['projectId'],
    },
    {
      icon: 'mdi-cog',
      title: 'Projekt-Einstellungen',
      routerName: Views.PROJECT_DETAILS,
      dropdownOptions: [],
      projectRequired: true,
      props: ['projectId'],
    },
    {
      icon: 'mdi-home',
      title: 'Einstellungen',
      routerName: Views.TENANT_DETAILS,
      dropdownOptions: [],
      projectRequired: false,
      props: ['projectId'],
    },
    {
      icon: 'mdi-account',
      title: 'Mitarbeiter',
      routerName: Views.USERS_VIEW,
      dropdownOptions: [],
    },
    {
      icon: 'mdi-notebook-outline',
      title: 'Fähigkeiten',
      routerName: Views.SKILL_VIEW,
      dropdownOptions: [],
    },
  ];
