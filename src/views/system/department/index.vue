<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.department']" />
    <a-card class="general-card" :title="$t('menu.system.department')">
      <template #extra>
        <a-form
          :model="formModel"
          :label-col-props="{ span: 0 }"
          :wrapper-col-props="{ span: 20 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col>
              <a-form-item field="key">
                <a-input-search
                  v-model="formModel.key"
                  placeholder="请输入关键字"
                  @click="search"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-space direction="vertical" :size="18">
          <a-button type="primary" @click="addData">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.form.add') }}
          </a-button>
        </a-space>
      </template>
      <a-divider style="margin-top: 0" />
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{ wrapper: true, cell: true }"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="edit(record)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-button type="text" size="small">
            {{ $t('searchTable.columns.operations.delete') }}
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
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import {
    queryDepartmentList,
    DepartmentRecord,
    DepartmentParams,
  } from '@/api/system';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const generateFormModel = () => {
    return {
      key: '',
    };
  };
  const generateModalForm = () => {
    return {
      name: '',
      code: '',
      note: '',
    };
  };
  const { loading, setLoading } = useLoading(false);
  const renderData = ref<DepartmentRecord[]>([]);
  const formModel = ref(generateFormModel());
  const modalForm = ref(generateModalForm());
  const cloneColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '部门编号',
      dataIndex: 'code',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      slotName: 'createdTime',
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const visible = ref(false);
  const modalTitle = ref(true);

  const handleOk = () => {};

  const fetchData = async (
    params: DepartmentParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryDepartmentList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as DepartmentParams);
  };

  const addData = () => {
    visible.value = true;
    modalTitle.value = true;
  };
  const edit = (record: { name: string; code: string; note: string }) => {
    visible.value = true;
    modalTitle.value = false;
    modalForm.value = record;
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
    },
    { deep: true, immediate: true }
  );
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-card-header-extra) {
    display: flex;
    flex-direction: row;

    .arco-form-item {
      margin-bottom: 0;
    }
  }
</style>
