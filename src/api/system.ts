import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { S } from 'mockjs';

// 系统设置-部门管理接口类型
export interface DepartmentRecord {
  id: string;
  name: string;
  code: number;
  createdTime: string;
  note: string;
}

export interface DepartmentParams extends Partial<DepartmentRecord> {
  current: number;
  pageSize: number;
}

export interface DepartmentListRes {
  list: DepartmentRecord[];
  total: number;
}

// 系统设置-部门管理接口api
export function queryDepartmentList(params: DepartmentParams) {
  return axios.get<DepartmentListRes>('/api/system/department', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 系统设置-用户管理接口类型
export interface UserRecord {
  id: string;
  username: string;
  department: string;
  email: string;
  phone: string;
  accountStatus: boolean;
  code: number;
  createdTime: string;
  note: string;
}

export interface UserParams extends Partial<UserRecord> {
  current: number;
  pageSize: number;
}

export interface UserListRes {
  list: UserRecord[];
  total: number;
}

// 系统设置-用户管理接口api
export function queryUserList(params: UserParams) {
  return axios.get<UserListRes>('/api/system/user', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 系统设置-角色管理接口类型
export interface RoleRecord {
  id: string;
  username: string;
  department: string;
  email: string;
  phone: string;
  accountStatus: boolean;
  code: number;
  createdTime: string;
  note: string;
}

export interface RoleParams extends Partial<RoleRecord> {
  current: number;
  pageSize: number;
}

export interface RoleListRes {
  list: RoleRecord[];
  total: number;
}

// 系统设置-用户管理接口api
export function queryRoleList(params: RoleParams) {
  return axios.get<RoleListRes>('/api/system/role', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 系统设置-菜单管理列表接口
export interface MenuRrecord {
  searchValue?: any;
  createBy?: any;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  param?: any;
  menuId: number;
  menuName: string;
  parentName?: any;
  parentId: number;
  orderNum: string;
  path: string;
  component?: any;
  isFrame: string;
  isCache: string;
  menuType: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  children: any[];
}

export interface MenuParams extends Partial<MenuRrecord> {
  current: number;
  pageSize: number;
}

export interface MenuListRes {
  list: MenuRrecord[];
  total: number;
}

export function querySystemMneuList(params?: MenuParams) {
  return axios.get<MenuListRes>('/dev-api/system/menu/list', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 系统设置-菜单管理
