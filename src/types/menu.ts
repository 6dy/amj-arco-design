export interface OriginRoute {
  name: string;
  path: string;
  component: string;
  redirect: string;
  hidden: boolean;
  alwaysShow: boolean;
  noCache: boolean; // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  title: string; // 设置该路由在侧边栏和面包屑中展示的名字
  icon: string; // 设置该路由的图标，对应路径src/assets/icons/svg
  breadcrumb: boolean;
  children?: Array<OriginRoute>;
}
