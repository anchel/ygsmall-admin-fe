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
            <span>{{ formatTime(row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="pay_at" label="支付时间">
          <template #default="{ row }">
            <span>{{ formatTime(row.pay_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="shipped_at" label="发货时间">
          <template #default="{ row }">
            <span>{{ formatTime(row.shipped_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="confirm_receipt_at" label="收货时间">
          <template #default="{ row }">
            <span>{{ formatTime(row.confirm_receipt_at) }}</span>
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

    <!-- 订单详情 -->
    <order-detail-dialog
      v-if="status.dialogVisibleOrderDetail"
      v-model:visible="status.dialogVisibleOrderDetail"
      :order="listData.list[status.currentIndex]"
      :service="listData.list[status.currentIndex].aftersales_service_info"
      @cancel="status.dialogVisibleOrderDetail = false"
      @confirm="status.dialogVisibleOrderDetail = false"
    ></order-detail-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage } from 'element-plus'
import CommonDialog from '@/components/common/CommonDialog.vue'
import OrderStatus from '@/components/order/order-status.vue'
import OrderServiceStatus from '@/components/order/order-service-status.vue'
import IconViewInfo from '@/components/common/IconViewInfo.vue'
import CommonInfoPanelDialog from '@/components/common/CommonInfoPanelDialog.vue'

import { useGlobalStore } from '@/stores/global'
import { Search } from '@element-plus/icons-vue'

import { useListFetcher } from '@/composables/useListFetcher'
import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue'

const { refreshPage } = useGlobalStore()

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } =
  useListFetcher('/api/order/completed/list')

const status = reactive({
  loading: false,

  dialogVisibleOrderDetail: false,

  currentIndex: -1,
})

// 查看订单详情
const handleClickViewOrderDetail = (index, row) => {
  console.log('查看订单详情', index)
  status.currentIndex = index
  status.dialogVisibleOrderDetail = true
}

// 物流信息
const logisticsInfoPanel = reactive({
  list: [],
  infoTitle: '物流信息',
  column: 3,
})
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
