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
        <el-table-column prop="id" label="订单ID" />
        <el-table-column prop="user_id" label="用户ID" />

        <el-table-column prop="created_at" label="创建时间">
          <template #default="{ row }">
            <span>{{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="pay_at" label="支付时间">
          <template #default="{ row }">
            <span>{{ dayjs(row.pay_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="total_amount" label="总金额">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.total_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="product_amount" label="商品金额">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.product_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="pay_amount" label="支付金额">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.pay_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="freight" label="运费">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.freight) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status_desc" label="订单状态">
          <template #default="{ row }">
            <OrderStatus :order="row" :service="row.aftersales_service_info" />
          </template>
        </el-table-column>
        <el-table-column prop="service_status_desc" label="售后状态">
          <template #default="{ row }">
            <OrderServiceStatus :order="row" :service="row.aftersales_service_info" />
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ $index, row }">
            <el-button
              link
              type="primary"
              size="small"
              :disabled="!row.can_shipped"
              @click="handleClickMarkShipped($index, row)"
              >发货
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

    <common-dialog v-model:dialogVisible="status.dialogVisibleMarkShipped" title="发货"></common-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { ElMessage } from 'element-plus'
import CommonDialog from '@/components/common/CommonDialog.vue'
import OrderStatus from '@/components/order/order-status.vue'
import OrderServiceStatus from '@/components/order/order-service-status.vue'

import { useGlobalStore } from '@/stores/global'
import { Search } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } =
  useListFetcher('/api/order/paid/list')

const status = reactive({
  loading: false,
  dialogVisibleMarkShipped: false,
})

const handleClickMarkShipped = (index, row) => {
  console.log('发货', index, row)
  status.dialogVisibleMarkShipped = true
}

function fenToYuan(fen) {
  if (typeof fen !== 'number' || isNaN(fen)) {
    return 'N/A'
  }
  return (fen / 100).toFixed(2)
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
    margin-top: 20px;
    text-align: center;
  }
}
</style>
