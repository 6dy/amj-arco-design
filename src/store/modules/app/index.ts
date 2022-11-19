import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import router from '@/router';
import { AppState } from './types';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    // key对应表
    keyTransform(key: string) {
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
    },
    // key转换
    transformKey(arr: any[]) {
      const ary = [] as any;
      arr.forEach((item, index) => {
        const obj = {} as any;
        Object.keys(item).forEach((k) => {
          obj[this.keyTransform(k)] = item[k];
          obj.order = index;
          if (k === 'meta') {
            Object.keys(item.meta).forEach((metaKey) => {
              obj.meta[this.keyTransform(metaKey)] = item.meta[metaKey];
            });
          }
          if (k === 'children') {
            obj.children = this.transformKey(item[k]);
          }
        });
        ary.push(obj);
      });
      return ary;
    },

    loadView(view: string) {
      // 路由懒加载
      return () => import(`/src/views/${view}/index.vue`);
    },

    // 遍历后台传来的路由字符串，转换为组件对象
    filterAsyncRouter(asyncRouterMap: any[]) {
      return asyncRouterMap.filter((route) => {
        if (route.component) {
          // Layout组件特殊处理
          if (route.component === 'Layout') {
            route.component = DEFAULT_LAYOUT;
          } else {
            route.component = this.loadView(route.component);
          }
        }
        if (route.children != null && route.children && route.children.length) {
          route.children = this.filterAsyncRouter(route.children);
        }
        return true;
      });
    },

    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await getMenuList();
        console.log(121, data);

        // this.serverMenu = this.transformKey(data);
        this.serverMenu = this.filterAsyncRouter(this.transformKey(data));
        // this.updateSettings({ serverMenu: this.serverMenu });
        this.serverMenu.forEach((v) => {
          router.addRoute(v);
        });
        console.log('router9999', router.getRoutes());
        console.log('servermenu', this.serverMenu);
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
  // persist: {
  //   enabled: true,
  // },
});

export default useAppStore;
