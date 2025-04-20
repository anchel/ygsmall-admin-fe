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

        <el-table-column prop="logistics_no" label="物流单号">
          <template #default="{ $index, row }">
            <div style="display: flex; align-items: center">
              <div>{{ row.shipped_logistics ? row.shipped_logistics.logistics_no : '无' }}</div>
              <IconViewInfo @click="handleViewLogistics($index, row)" />
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ $index, row }">
            <el-button link type="primary" size="small" @click="handleClickViewOrderDetail($index, row)"
              >查看
            </el-button>

            <el-button link type="primary" size="small" @click="handleClickModifyShipped($index, row)"
              >修改物流
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

    <common-dialog
      v-model:visible="status.dialogVisibleModifyShipped"
      title="发货"
      @confirm="handleConfirmModifyShipped"
    >
      <el-form label-position="left" label-width="130">
        <el-form-item label="物流公司code">
          <el-input v-model="form.logistics_company_code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物流公司名称">
          <el-input v-model="form.logistics_company_name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="form.logistics_no" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </common-dialog>

    <common-info-panel-dialog
      v-if="status.dialogVisibleViewLogistics"
      v-model:visible="status.dialogVisibleViewLogistics"
      title="查看物流"
      :info-title="logisticsInfoPanel.infoTitle"
      :column="logisticsInfoPanel.column"
      :list="logisticsInfoPanel.list"
    >
    </common-info-panel-dialog>

    <order-detail-dialog
      v-if="status.dialogVisibleOrderDetail"
      v-model:visible="status.dialogVisibleOrderDetail"
      :order="listData.list[status.currentIndex]"
      @cancel="status.dialogVisibleOrderDetail = false"
    ></order-detail-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
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
  useListFetcher('/api/order/shipped/list')

const status = reactive({
  loading: false,
  dialogVisibleModifyShipped: false,
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
const handleViewLogistics = async (index, row) => {
  console.log('查看物流', index)
  status.currentIndex = index
  logisticsInfoPanel.list = []
  if (!row.shipped_logistics) {
    ElMessage.error('暂无物流信息')
    return
  }
  logisticsInfoPanel.list = [
    {
      label: '物流公司code',
      value: row.shipped_logistics.logistics_company_code,
    },
    {
      label: '物流公司名称',
      value: row.shipped_logistics.logistics_company_name,
    },
    {
      label: '物流单号',
      value: row.shipped_logistics.logistics_no,
    },
    {
      label: '物流备注',
      value: row.shipped_logistics.remark,
    },
  ]
  status.dialogVisibleViewLogistics = true
}

// 修改物流
const form = reactive({
  logistics_company_code: '',
  logistics_company_name: '',
  logistics_no: '',
  remark: '',
})

const handleClickModifyShipped = (index, row) => {
  status.currentIndex = index
  if (row.shipped_logistics) {
    form.logistics_company_code = row.shipped_logistics.logistics_company_code
    form.logistics_company_name = row.shipped_logistics.logistics_company_name
    form.logistics_no = row.shipped_logistics.logistics_no
    form.remark = row.shipped_logistics.remark
  } else {
    form.logistics_company_code = ''
    form.logistics_company_name = ''
    form.logistics_no = ''
    form.remark = ''
  }
  status.dialogVisibleModifyShipped = true
}

const handleConfirmModifyShipped = async () => {
  if (!form.logistics_company_code) {
    ElMessage.error('请输入物流公司code')
    return
  }
  if (!form.logistics_company_name) {
    ElMessage.error('请输入物流公司名称')
    return
  }
  if (!form.logistics_no) {
    ElMessage.error('请输入物流单号')
    return
  }

  status.loading = true
  try {
    const res = await ajax.post('/api/order/modify-shipped', {
      ...form,
      order_id: listData.list[status.currentIndex].id,
    })
    if (res.code === 0) {
      ElMessage.success('修改成功')
      status.dialogVisibleModifyShipped = false
      refreshPage()
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('修改失败，请重试')
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
    margin-top: 20px;
    text-align: center;
  }
}
</style>
