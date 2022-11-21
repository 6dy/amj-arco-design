/* eslint-disable no-unused-expressions */
import { isExternal } from '@/utils';
import { resolve } from 'path-browserify';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { defaultRoutes } from '@/router/routes/default-routes';
import { OriginRoute } from '../../types/menu';

export const LAYOUT = () => import('@/layout/default-layout.vue');

export function loadComponents() {
  return import.meta.glob('/src/views/**/*.vue');
}

export const asynComponents = loadComponents();
console.log('asynComponents', asynComponents);

export function getFilePath(it: OriginRoute) {
  it.component = resolve('/', it.component);
  console.log('path', `/src/views${it.component}/index.vue`);
  return `/src/views${it.component}/index.vue`;
}

export function getComponent(it: OriginRoute) {
  return asynComponents[getFilePath(it)];
}

export function isMenu(it: OriginRoute) {
  return it.children && it.children.length > 0;
}

export function filterRoutesFromLocalRoutes(
  route: OriginRoute,
  localRoutes: Array<RouteRecordRaw>,
  path = '/'
) {
  const filterRoute = localRoutes.find((it) => {
    debugger;

    return resolve(path, it.path) === route.path;
  });
  if (filterRoute) {
    filterRoute.meta = {
      noAffix: route.breadcrumb,
      locale: route.title,
      ignoreCache: route.noCache,
      icon: route.icon || 'icon-menu',
      hideInMenu: !!route.hidden,
      ...filterRoute.meta,
    };
    const parentPath = resolve(path, filterRoute.path);
    if (
      Array.isArray(route.children) &&
      route.children.length > 0 &&
      Array.isArray(filterRoute.children) &&
      filterRoute.children.length > 0
    ) {
      const tempChildren: RouteRecordRaw[] = [];
      route.children.forEach((it: any) => {
        const childFilterRoute = filterRoutesFromLocalRoutes(
          it,
          filterRoute.children!,
          parentPath
        );
        childFilterRoute && tempChildren.push(childFilterRoute);
      });
      filterRoute.children = tempChildren;
    }
  }
  return filterRoute;
}

export function generatorRoutes(res: Array<OriginRoute>) {
  const tempRoutes: Array<RouteRecordRaw> = [];
  res.forEach((it) => {
    const isMenuFlag = isMenu(it);
    const localRoute = isMenuFlag ? filterRoutesFromLocalRoutes(it, []) : null;
    if (localRoute) {
      debugger;
      tempRoutes.push(localRoute as RouteRecordRaw);
    } else {
      const route: RouteRecordRaw = {
        path: it.path,
        name: it.name,
        component: isMenuFlag ? LAYOUT : getComponent(it),
        meta: {
          noAffix: it.meta.breadcrumb,
          locale: it.meta.title,
          ignoreCache: it.noCache,
          icon: it.icon || 'icon-menu',
          hideInMenu: !!it.hidden,
        },
      };
      if (it.children) {
        route.children = generatorRoutes(it.children);
      }
      tempRoutes.push(route);
    }
  });
  console.log('tempRoutes', tempRoutes);

  return tempRoutes;
}

export function mapTwoLevelRouter(srcRoutes: Array<RouteRecordRaw>) {
  function addParentRoute(routes: any, parent: any, parentPath: string) {
    routes.forEach((it: RouteRecordRaw) => {
      if (!isExternal(it.path)) {
        it.path = resolve(parentPath, it.path);
      }
      parent.push(it);
      if (it.children && it.children.length > 0) {
        addParentRoute(it.children, parent, it.path);
      }
    });
  }
  if (srcRoutes && srcRoutes.length > 0) {
    const tempRoutes = [] as Array<any>;
    srcRoutes.forEach((it) => {
      const route = { ...it };
      const parentRoutes = [] as Array<any>;
      if (route.children && route.children.length > 0) {
        addParentRoute(route.children, parentRoutes, route.path);
      }
      parentRoutes &&
        parentRoutes.length > 0 &&
        (route.children = parentRoutes);
      tempRoutes.push(route);
    });
    return tempRoutes;
  }
  return [];
}
