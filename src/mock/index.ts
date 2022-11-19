import Mock from 'mockjs';

import './user';
import './message-box';

import '@/views/dashboard/workplace/mock';

// 系统配置接口mock
import '@/views/system/mock';

Mock.setup({
  timeout: '600-1000',
});
