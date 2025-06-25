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
        <el-table-column prop="id" label="商品ID" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="primary_image" label="主图">
          <template #default="{ row }">
            <el-image
              :src="row.primary_image"
              style="width: 50px; height: 50px"
              fit="cover"
              :preview-src-list="[row.primary_image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="stock_quantity" label="总库存" />
        <el-table-column prop="price_origin" label="原价">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.price_origin) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price_sale" label="销售价">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.price_sale) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="category" label="分类">
          <template #default="{ row }">
            <span>{{ row.category ? row.category.name : '未分类' }}</span>
          </template>
        </el-table-column>

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
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'
// import AttributeValueList from './components/AttributeValueList.vue'

import { useGlobalStore } from '@/stores/global'
import { Search, Refresh } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'
import { useListOperation } from '@/composables/useListOperation'
import CommonDialog from '@/components/common/CommonDialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } = useListFetcher({
  listApiUrl: '/api/product/list',
})

const handleAdd = () => {
  // resetForm()
  // openDialog()
  router.push({ name: 'ProductDetail' }) // 跳转到添加商品页面
}

const handleEdit = (index, row) => {
  // resetForm()
  // setFormData(row)
  // openDialog()
  router.push({ name: 'ProductDetail', query: { id: row.id } }) // 跳转到添加商品页面
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

const doDelete = async (id) => {
  let response = await ajax.post('/api/product/delete', { id })
  let data = response.data
  if (data.code !== 0) {
    throw new Error(data.message)
  }
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
