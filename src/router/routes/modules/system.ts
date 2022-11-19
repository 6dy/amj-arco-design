import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 7,
  },
  children: [
    // {
    //   path: 'department',
    //   name: 'department',
    //   component: () => import('@/views/system/department/index.vue'),
    //   meta: {
    //     locale: 'menu.system.department',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'user/index',
    //   name: 'User',
    //   component: () => import('@/views/system/user/index.vue'),
    //   meta: {
    //     locale: 'menu.system.user',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'role',
    //   name: 'role',
    //   component: () => import('@/views/system/role/index.vue'),
    //   meta: {
    //     locale: 'menu.system.role',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default DASHBOARD;
