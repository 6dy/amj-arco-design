<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="10">
                <a-form-item field="number" :label="$t('menu.form.name')">
                  <a-input
                    v-model="formModel.number"
                    :placeholder="$t('menu.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item
                  field="contentType"
                  :label="$t('menu.form.status')"
                >
                  <a-select
                    v-model="formModel.contentType"
                    :options="contentTypeOptions"
                    :placeholder="$t('menu.form.status.selectDefault')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 34px" direction="vertical" />
        <a-col
          :flex="'86px'"
          style="display: flex; flex-direction: row; text-align: right"
        >
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search" style="margin-right: 10px">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 10px" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addChange">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="menuId"
        :loading="loading"
        :hide-expand-button-on-empty="true"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        v-model:expandedKeys="expandedKeys"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #contentType="{ record }">
          <a-space>
            <a-avatar
              v-if="record.contentType === 'img'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.contentType === 'horizontalVideo'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar v-else :size="16" shape="square">
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
          </a-space>
        </template>
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === '1'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`menu.columns.status.${record.status ? 'normal' : 'error'}`) }}
        </template>
        <template #operations>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
    <!-- 新增编辑弹窗 -->
    <a-modal
      v-model:visible="visible"
      :title="modalTitle ? '新增' : '编辑'"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-form :model="modalForm">
        <a-row>
          <a-col :span="24">
            <a-form-item label="上级菜单">
              <treeselect
                v-model="modalForm.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="菜单类型" prop="menuType">
              <a-radio-group v-model="modalForm.menuType">
                <a-radio value="M">目录</a-radio>
                <a-radio value="C">菜单</a-radio>
                <a-radio value="F">按钮</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item v-if="modalForm.menuType != 'F'" label="菜单图标">
              <IconSelect v-model:value="modalForm.icon"></IconSelect>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item field="name" label="部门名称">
          <a-input v-model="modalForm.name" />
        </a-form-item>
        <a-form-item field="code" label="部门编号">
          <a-input v-model="modalForm.code" />
        </a-form-item>
        <a-form-item field="note" label="备注">
          <a-input v-model="modalForm.note" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { querySystemMneuList, MenuRrecord, MenuParams } from '@/api/system';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { handleTree } from '@/utils/ruoyi';
  import Treeselect from 'vue3-treeselect';
  import IconSelect from '@/components/IconSelect/index.vue';

  // import the styles
  import 'vue3-treeselect/dist/vue3-treeselect.css';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      menuName: undefined,
      visible: undefined,
    };
  };

  const generateModalForm = () => {
    return {
      menuId: undefined,
      parentId: 0,
      menuName: undefined,
      icon: undefined,
      menuType: 'M',
      orderNum: undefined,
      isFrame: '1',
      isCache: '0',
      visible: '0',
      status: '0',
    };
  };

  const visible = ref(false);
  const modalTitle = ref(true);

  const handleOk = () => {};

  const expandedKeys = ref([]);

  // 菜单树选项
  const menuOptions = ref([] as any[]);
  // 点击图标选择框
  const iconSelect = ref();
  const popoverVisible = ref(false);

  const iconSelectShow = () => {
    iconSelect.value.reset();
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<MenuRrecord[]>([]);
  const formModel = ref(generateFormModel());
  const modalForm = ref(generateModalForm());

  // 选择图标
  const selected = (icon) => {
    modalForm.value.icon = icon;
    popoverVisible.value = false;
  };

  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('menu.columns.menuName'),
      dataIndex: 'menuName',
      slotName: 'menuName',
      align: 'center',
    },
    {
      title: t('menu.columns.icon'),
      dataIndex: 'icon',
      slotName: 'icon',
      align: 'center',
    },
    {
      title: t('menu.columns.orderNum'),
      dataIndex: 'orderNum',
      slotName: 'orderNum',
      align: 'center',
    },
    {
      title: t('menu.columns.perms'),
      dataIndex: 'perms',
      slotName: 'perms',
      align: 'center',
    },
    {
      title: t('menu.columns.component'),
      dataIndex: 'component',
      slotName: 'component',
      align: 'center',
    },
    {
      title: t('menu.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
    },
    {
      title: t('menu.columns.createTime'),
      dataIndex: 'createTime',
      slotName: 'createTime',
      align: 'center',
    },
    {
      title: t('menu.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
    },
  ]);
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.contentType.img'),
      value: 'img',
    },
    {
      label: t('searchTable.form.contentType.horizontalVideo'),
      value: 'horizontalVideo',
    },
    {
      label: t('searchTable.form.contentType.verticalVideo'),
      value: 'verticalVideo',
    },
  ]);
  const filterTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.filterType.artificial'),
      value: 'artificial',
    },
    {
      label: t('searchTable.form.filterType.rules'),
      value: 'rules',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.status.online'),
      value: 'online',
    },
    {
      label: t('searchTable.form.status.offline'),
      value: 'offline',
    },
  ]);
  const fetchData = async (
    params: MenuParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySystemMneuList(params);
      console.log('data', data);

      console.log(
        'tree',
        handleTree(data.list, 'menuId', 'parentId', 'children', 0)
      );

      renderData.value = handleTree(
        data.list,
        'menuId',
        'parentId',
        'children',
        0
      );
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  /** 查询菜单下拉树结构 */
  const getTreeselect = async () => {
    try {
      const { data } = await querySystemMneuList();
      const menu = { menuId: 0, menuName: '主类目', children: [] };
      menu.children = handleTree(
        data.list,
        'menuId',
        'parentId',
        'children',
        0
      );
      menuOptions.value.push(menu);
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  /** 转换菜单数据结构 */
  const normalizer = (node) => {
    if (node.children && !node.children.length) {
      delete node.children;
    }
    return {
      id: node.menuId,
      label: node.menuName,
      children: node.children,
    };
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as MenuParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  // 打开新增弹窗
  const addChange = () => {
    visible.value = true;
    getTreeselect();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
