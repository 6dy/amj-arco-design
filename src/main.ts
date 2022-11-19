import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import SvgIcon from '@/components/SvgIcon/index.vue';

import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';

// 公共样式
import '@/assets/icons';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.component(
  'SvgIcon',
  // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`，否则回退到使用模块的根
  SvgIcon.default || SvgIcon
);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
