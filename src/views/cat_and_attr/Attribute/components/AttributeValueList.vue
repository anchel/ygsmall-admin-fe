<template>
  <el-dialog :title="title" v-model="visible" :width="width" :close-on-click-modal="closeOnClickModal">
    <div class="content">
      <div class="list">
        <div class="filter">
          <div class="top-left-container">
            <el-button type="primary" @click="handleAdd" size="default">添加</el-button>
          </div>

          <div class="top-right-container">
            <el-button :icon="Refresh" @click="refreshList" />
            <el-input clearable v-model="search.keyword" placeholder="请输入关键字" @change="handleKeywordChange">
              <template #append>
                <el-button :icon="Search" />
              </template>
            </el-input>
          </div>
        </div>

        <el-table stripe table-layout="auto" size="small" :data="listData.list" v-loading="listStatus.loading">
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="value" label="属性值" />

          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{ $index, row }">
              <el-button link type="primary" size="small" @click="handleEdit($index, row)">编辑</el-button>

              <el-button link type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
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

      <common-dialog
        v-model:visible="status.dialogVisible"
        :title="formData.id ? '编辑属性值' : '添加属性值'"
        :confirm-btn-loading="status.loading"
        @confirm="handleConfirm"
      >
        <el-form :model="formData" label-position="left" label-width="130">
          <el-form-item label="ID">
            <el-input v-model="formData.id" placeholder="" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="属性ID">
            <el-input v-model="formData.attribute_id" placeholder="" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="属性值">
            <el-input v-model="formData.value" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </common-dialog>
    </div>

    <template #footer>
      <el-button v-if="showCancelBtn" @click="handleCancelDialog">{{ cancelBtnText }}</el-button>
      <el-button v-if="showConfirmBtn" type="primary" @click="handleConfirmDialog">{{ confirmBtnText }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useGlobalStore } from '@/stores/global'
import { Refresh, Search } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'
import CommonDialog from '@/components/common/CommonDialog.vue'
import { useListOperation } from '@/composables/useListOperation.js'

const { title, attributeId } = defineProps({
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
  attributeId: {
    type: [Number, undefined],
    default: undefined,
  },
})
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleCancelDialog = () => {
  console.log('handleCancelDialog')
  visible.value = false
  emit('cancel')
}
const handleConfirmDialog = () => {
  console.log('handleConfirmDialog')
  visible.value = false
  emit('confirm')
}

// const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange, refreshList } = useListFetcher({
  listApiUrl: '/api/attribute/value/list',
  listApiParams: {
    attribute_id: attributeId,
  },
})

const { formData, setFormData, resetForm, status, doSubmit, doDelete, openDialog, closeDialog } = useListOperation({
  defaults: {
    attribute_id: attributeId,
    value: '',
  },
  addApiUrl: '/api/attribute/value/add',
  updateApiUrl: '/api/attribute/value/update',
  deleteApiUrl: '/api/attribute/value/delete',
})

const handleAdd = () => {
  resetForm()
  openDialog()
}
const handleEdit = (index, row) => {
  resetForm()
  setFormData(row)
  openDialog()
}

const handleConfirm = async () => {
  try {
    await doSubmit()
    ElMessage.success('操作成功')
    closeDialog() // 关闭对话框
    refreshList() // 刷新页面数据
  } catch (e) {
    ElMessage.error('操作失败', e)
  }
}

const handleDelete = async (index, row) => {
  ElMessageBox.confirm('确定删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doDelete(row.id, { attribute_id: attributeId })
        .then(() => {
          ElMessage.success('删除成功')
          refreshList() // 刷新页面数据
        })
        .catch((e) => {
          ElMessage.error('删除失败', e)
        })
    })
    .catch(() => {
      // 用户取消删除操作
    })
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

.top-left-container {
  display: flex;
  align-items: center;
}

.top-right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;

  .el-input {
    width: 360px;
  }
}
</style>
