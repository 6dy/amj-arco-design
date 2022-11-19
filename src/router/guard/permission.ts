import type { Router, RouteRecordNormalized, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import { appRoutes } from '../routes';
import { WHITE_LIST, NOT_FOUND } from '../constants';
import Layout from '../../layout/default-layout.vue';
import { AppRouteRecordRaw } from '../routes/types';

const MyRoutermodules = import.meta.glob('/src/views/*/*.vue');

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

const loadView = (view: string) => {
  // 路由懒加载
  return () => import(`/src/views/${view}/index.vue`);
  // return () => MyRoutermodules[`@/view${view}.vue`];
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any[]) {
  return asyncRouterMap.filter((route) => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        // route.component = DEFAULT_LAYOUT;
        route.component = () => import('@/layout/default-layout.vue');
      } else {
        route.component = loadView(route.component);
        // route.component = () =>
        //   MyRoutermodules[`/src/views/${route.component}.vue`];
        console.log('route.component', route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}

// key对应表
function keyTransform(key: string) {
  switch (key) {
    case 'title':
      return 'locale';
    case 'hidden':
      return 'hideInMenu';
    case 'noCache':
      return 'ignoreCache';
    case 'breadcrumb':
      return 'noAffix';
    default:
      return key;
  }
}

function transformKey(arr: any[]) {
  const ary = [] as any;
  arr.forEach((item, index) => {
    const obj = {} as any;
    Object.keys(item).forEach((k) => {
      obj[keyTransform(k)] = item[k];
      obj.order = index;
      if (k === 'meta') {
        Object.keys(item.meta).forEach((metaKey) => {
          obj.meta[keyTransform(metaKey)] = item.meta[metaKey];
        });
      }
      if (k === 'children') {
        obj.children = transformKey(item[k]);
      }
    });
    ary.push(obj);
  });
  return ary;
}

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    debugger;
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server

      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the permission logic from the server's menu configuration as needed
      if (
        !appStore.appAsyncMenus.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.fetchServerMenuConfig();
      }
      // tag 菜单

      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];
      console.log('appStore.appAsyncMenus', appStore.appAsyncMenus);
      console.log('routeryyyyy', router.getRoutes());
      // const sdata = JSON.parse(JSON.stringify(serverMenuConfig));
      // console.log('sdata', sdata);
      // const rewriteRoutes = filterAsyncRouter(sdata);
      // sdata.forEach((v: RouteRecordRaw) => {
      //   debugger;
      //   router.addRoute(v);
      // });
      // console.log('router', router.getRoutes());
      // debugger;

      let exist = false;
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        console.log('element', element);
        if (element?.name === to.name) exist = true;
        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      if (exist && permissionsAllow) {
        next();
      } else next(NOT_FOUND);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (permissionsAllow) next();
      else {
        const destination =
          Permission.findFirstPermissionRoute(appRoutes, userStore.role) ||
          NOT_FOUND;
        next(destination);
      }
    }
    NProgress.done();
  });
}
