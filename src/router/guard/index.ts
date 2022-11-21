import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import useAppStore from '@/store/modules/app';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

const whiteRoutes: string[] = ['/login'];

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change

    if (whiteRoutes.includes(to.path)) {
      return true;
    }
    const appStore = useAppStore();
    const isEmptyRoute = appStore.isEmptyPermissionRoute();
    if (isEmptyRoute) {
      await appStore.initPermissionRoute();
      return { ...to, replace: true };
    }
    setRouteEmitter(to);
    return true;
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
