/* eslint-disable import/prefer-default-export */
export const defaultRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      locale: 'menu.server.dashboard',
      requiresAuth: true,
      icon: 'icon-dashboard',
      order: 1,
    },
    children: [
      {
        path: 'workplace',
        name: 'Workplace',
        meta: {
          locale: 'menu.server.workplace',
          requiresAuth: true,
        },
      },
      {
        path: 'https://arco.design',
        name: 'arcoWebsite',
        meta: {
          locale: 'menu.arcoWebsite',
          requiresAuth: true,
        },
      },
    ],
  },
];
