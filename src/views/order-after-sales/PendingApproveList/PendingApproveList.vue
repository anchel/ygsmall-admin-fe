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
        <el-table-column prop="after_sales_id" label="售后服务ID" />
        <el-table-column prop="order_id" label="订单ID" />
        <el-table-column prop="user_id" label="用户ID" />

        <el-table-column prop="apply_time" label="申请时间">
          <template #default="{ row }">
            <span>{{ formatTime(row.apply_time) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="approved_time" label="审核时间">
          <template #default="{ row }">
            <span>{{ formatTime(row.approved_time) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="service_type" label="售后类型">
          <template #default="{ row }">
            <span>{{ row.service_type === 'RETURN_GOODS_MONEY' ? '退货退款' : '退款' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="refund_amount" label="申请退款金额">
          <template #default="{ row }">
            <span>{{ fenToYuan(row.refund_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status_desc" label="订单状态">
          <template #default="{ row }">
            <!--            <OrderStatus :order="row.order" :service="row" />-->
            <span>{{ row.order.status_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="service_status_desc" label="售后状态">
          <template #default="{ row }">
            <OrderServiceStatus :order="row.order" :service="row" />
          </template>
        </el-table-column>

        <!--        <el-table-column prop="logistics_no" label="发货单号">-->
        <!--          <template #default="{ $index, row }">-->
        <!--            <div style="display: flex; align-items: center">-->
        <!--              <div>{{ row.shipped_logistics ? row.shipped_logistics.logistics_no : '无' }}</div>-->
        <!--              <IconViewInfo @click="handleViewLogistics($index, row)" />-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ $index, row }">
            <el-button link type="primary" size="small" @click="handleClickViewOrderDetail($index, row)"
              >查看
            </el-button>

            <el-button link type="primary" size="small" :disabled="status.loading" @click="handleApprove($index, row)">
              通过
            </el-button>

            <el-button link type="primary" size="small" :disabled="status.loading" @click="handleReject($index, row)">
              拒绝
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

    <!--物流信息面板-->
    <common-info-panel-dialog
      v-if="status.dialogVisibleViewLogistics"
      v-model:visible="status.dialogVisibleViewLogistics"
      title="查看物流"
      :info-title="logisticsInfoPanel.infoTitle"
      :column="logisticsInfoPanel.column"
      :list="logisticsInfoPanel.list"
    >
    </common-info-panel-dialog>

    <!-- 订单详情 -->
    <order-detail-dialog
      v-if="status.dialogVisibleOrderDetail"
      v-model:visible="status.dialogVisibleOrderDetail"
      :service="listData.list[status.currentIndex]"
      :order="listData.list[status.currentIndex].order"
      @cancel="status.dialogVisibleOrderDetail = false"
      @confirm="status.dialogVisibleOrderDetail = false"
    ></order-detail-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'
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

const { handleKeywordChange, search, listStatus, listData, pagination, onPageChange } = useListFetcher({
  listApiUrl: '/api/order/aftersales/pending-approve/list',
})

const status = reactive({
  loading: false,

  dialogVisibleViewLogistics: false,
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

const handleApprove = (index, row) => {
  let message = '该售后申请是“退款”类型，审核通过后，将直接退款给客户，是否继续？'
  if (row.service_type === 'RETURN_GOODS_MONEY') {
    message = '该售后申请是“退货退款”类型，审核通过后，请等待客户退货，是否继续？'
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doApprove(row.order_no, row.after_sales_id)
    })
    .catch(() => {
      console.log('取消审核')
    })
}

const doApprove = async (order_no, after_sales_id) => {
  status.loading = true
  try {
    await ajax.post('/api/order/aftersales/approve', {
      order_no,
      after_sales_id,
    })
    ElMessage.success('审核通过')
    refreshPage()
  } catch (error) {
    console.error(error)
    ElMessage.error((error && error.message) || '审核失败，请重试')
  } finally {
    status.loading = false
  }
}

// 拒绝
const handleReject = (index, row) => {
  let message = '拒绝该订单的售后申请？'

  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doReject(row.order_no, row.after_sales_id)
    })
    .catch(() => {
      console.log('取消审核')
    })
}

const doReject = async (order_no, after_sales_id) => {
  status.loading = true
  try {
    await ajax.post('/api/order/aftersales/reject', {
      order_no,
      after_sales_id,
    })
    ElMessage.success('审核拒绝成功')
    refreshPage()
  } catch (error) {
    console.error(error)
    ElMessage.error((error && error.message) || '审核拒绝失败，请重试')
  } finally {
    status.loading = false
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
</style>
