<template>
  <div class="content">
    <div class="list">
      <div class="filter">
        <el-button type="info" @click="refreshPage" size="default">刷新列表</el-button>
        <el-input
          clearable
          v-model="search.keyword"
          placeholder="请输入关键字"
          @change="handleKeywordChange"
          style="width: 400px; margin-bottom: 10px"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>

      <el-table stripe table-layout="auto" size="small" :data="listData.list" v-loading="listStatus.loading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ $index, row }">
            <el-button link type="primary" size="small" @click="handleClickViewOrderDetail($index, row)"
              >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagination.size"
        :total="listData.total"
        @current-change="onPageChange"
      />
    </div>

    <attribute-value-list v-model:visible="status.dialogVisibleValueList" title="属性值列表" />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage } from 'element-plus'
import AttributeValueList from './components/AttributeValueList.vue'

import { useGlobalStore } from '@/stores/global'
import { Search } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } =
  useListFetcher('/api/attribute/list')

const status = reactive({
  dialogVisibleValueList: false,

  currentIndex: -1,
})

const handleClickViewOrderDetail = (index, row) => {
  status.currentIndex = index
  status.dialogVisibleValueList = true
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);

  .header {
    margin-bottom: 20px;
  }

  .list {
    flex: 1;
    overflow: auto;

    .filter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  .footer {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
