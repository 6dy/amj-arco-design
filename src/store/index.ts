import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import { App } from 'vue';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
// 引入持久化插件

const pinia = createPinia();

pinia.use(piniaPersist);
export function setupPinia(app: App) {
  app.use(pinia);
}

export { useAppStore, useUserStore, useTabBarStore };
export default pinia;
