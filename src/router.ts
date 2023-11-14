import { createRouter, createWebHistory } from 'vue-router';
import { Views } from '@/views';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: Views.LOGIN,
      path: '/login',
      component: () => import('@/views/general/Login.view.vue'),
    },
    {
      name: Views.SKILL_VIEW,
      path: '/skills',
      component: () => import('@/views/skill/SkillOverview.view.vue'),
    },
    {
      name: Views.PROJECT_VIEW,
      path: '/projects',
      component: () => import('@/views/project/ProjectOverview.view.vue'),
    },
    {
      name: Views.PROJECT_DETAILS,
      path: '/project/:projectId',
      component: () => import('@/views/project/ProjectDetails.vue'),
    },
    {
      name: Views.USERS_VIEW,
      path: '/users',
      component: () => import('@/views/user/UserOverview.view.vue'),
    },
    {
      name: Views.USER_DETAILS_VIEW,
      path: '/users/:userId',
      component: () => import('@/views/user/UserDetails.view.vue'),
    },
    {
      name: Views.INCREMENT_VIEW,
      path: '/project/:projectId/increments',
      component: () => import('@/views/increment/IncrementOverview.view.vue'),
    },
    {
      name: Views.GROUP_VIEW,
      path: '/project/:projectId/groups',
      component: () => import('@/views/group/GroupOverview.view.vue'),
    },
    {
      name: Views.ISSUE_DETAILS,
      path: '/project/:projectId/issue/:issueId',
      component: () => import('@/views/issue/IssueDetails.view.vue'),
    },
    {
      name: Views.TIMELINE_VIEW,
      path: '/project/:projectId/timeline',
      component: () => import('@/views/issue/Timeline.view.vue'),
    },
    {
      name: Views.BACKLOG_VIEW,
      path: '/project/:projectId/backlog',
      component: () => import('@/views/issue/Backlog.view.vue'),
    },
    {
      name: Views.TENANT_DETAILS,
      path: '/tenant/:projectId?',
      component: () => import('@/views/tenant/TenantDetails.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: Views.LOGIN },
    },
  ],
});
