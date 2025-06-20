<template>
  <el-dialog :title="title" v-model="visible" :width="width" :close-on-click-modal="closeOnClickModal">
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
              <el-button link type="primary" size="small" @click="handleClickViewValueList($index, row)"
                >查看订单
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
    </div>

    <template #footer>
      <el-button v-if="showCancelBtn" @click="handleCancel">{{ cancelBtnText }}</el-button>
      <el-button v-if="showConfirmBtn" type="primary" @click="handleConfirm">{{ confirmBtnText }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage } from 'element-plus'

import { useGlobalStore } from '@/stores/global'
import { Search } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'

const { title } = defineProps({
  title: {
    type: String,
    default: '对话框',
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  cancelBtnText: {
    type: String,
    default: '取 消',
  },
  confirmBtnText: {
    type: String,
    default: '确 定',
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '80%',
  },
})
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleConfirm = async () => {
  console.log('handleConfirm')
  emit('confirm')
}

const handleCancel = () => {
  console.log('handleCancel')
  visible.value = false
  emit('cancel')
}

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } =
  useListFetcher('/api/attribute/list')

const status = reactive({
  dialogVisibleValueList: false,

  currentIndex: -1,
})

const handleClickViewValueList = (index, row) => {
  console.log('查看订单详情', index)
  status.currentIndex = index
  status.dialogVisibleValueList = true
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;

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
