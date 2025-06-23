<template>
  <div class="content">
    <div class="list">
      <div class="filter">
        <div class="top-left-container">
          <el-button type="primary" @click="handleAdd" size="default">添加</el-button>
        </div>

        <div class="top-right-container">
          <el-button :icon="Refresh" @click="refreshPage" />
          <el-input clearable v-model="search.keyword" placeholder="请输入关键字" @change="handleKeywordChange">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </div>
      </div>

      <el-table stripe table-layout="auto" size="small" :data="listData.list" v-loading="listStatus.loading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ $index, row }">
            <el-button link type="primary" size="small" @click="handleClickViewOrderDetail($index, row)"
              >查看
            </el-button>

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

    <attribute-value-list
      :show-cancel-btn="false"
      confirm-btn-text="关闭"
      v-if="status2.dialogVisibleValueList"
      v-model:visible="status2.dialogVisibleValueList"
      title="属性值列表"
      :attribute-id="status2.currentAttributeId"
    />

    <common-dialog
      v-model:visible="status.dialogVisible"
      :title="formData.id ? '编辑属性' : '添加属性'"
      :confirm-btn-loading="status.loading"
      @confirm="handleConfirm"
    >
      <el-form :model="formData" label-position="left" label-width="130">
        <el-form-item label="ID">
          <el-input v-model="formData.id" placeholder="" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formData.name" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </common-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'
import AttributeValueList from './components/AttributeValueList.vue'

import { useGlobalStore } from '@/stores/global'
import { Search, Refresh } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'
import { useListOperation } from '@/composables/useListOperation'
import CommonDialog from '@/components/common/CommonDialog.vue'

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } = useListFetcher({
  listApiUrl: '/api/attribute/list',
})

const { formData, setFormData, resetForm, status, doSubmit, doDelete, openDialog, closeDialog } = useListOperation({
  defaults: {
    name: '',
  },
  addApiUrl: '/api/attribute/add',
  updateApiUrl: '/api/attribute/update',
  deleteApiUrl: '/api/attribute/delete',
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
    refreshPage() // 刷新页面数据
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
      doDelete(row.id)
        .then(() => {
          ElMessage.success('删除成功')
          refreshPage() // 刷新页面数据
        })
        .catch((e) => {
          ElMessage.error('删除失败', e)
        })
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

const status2 = reactive({
  dialogVisibleValueList: false,
  currentAttributeId: null,
})
const handleClickViewOrderDetail = (index, row) => {
  status2.currentAttributeId = row.id
  status2.dialogVisibleValueList = true
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
