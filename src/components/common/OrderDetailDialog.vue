<template>
  <common-dialog v-model:visible="visible" title="订单详情" width="80%" @confirm="handleConfirm">
    <el-card>
      <el-descriptions title="" :column="3" size="small">
        <el-descriptions-item label="订单号" :span="3">{{ order.order_no }}</el-descriptions-item>
        <el-descriptions-item label="订单状态" :span="3">
          <OrderStatus :order="order" :service="service" />
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatTime(order.created_at) }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ formatTime(order.pay_at) }}</el-descriptions-item>
        <el-descriptions-item label="发货时间">{{ formatTime(order.shipped_at) }}</el-descriptions-item>

        <el-descriptions-item label="总金额">{{ fenToYuan(order.total_amount) }}</el-descriptions-item>
        <el-descriptions-item label="商品金额">{{ fenToYuan(order.product_amount) }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">{{ fenToYuan(order.pay_amount) }}</el-descriptions-item>
        <el-descriptions-item label="运费">{{ fenToYuan(order.freight) }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />
      <div class="">
        <div>商品列表</div>
        <el-table :data="order.order_items" border stripe>
          <el-table-column prop="sku_title" label="名称" />
          <el-table-column prop="sku_specs" label="规格" />
          <el-table-column prop="sku_image" label="图片">
            <template #default="{ row }">
              <el-image
                :src="row.sku_image"
                fit="fill"
                :preview-src-list="[row.sku_image]"
                alt=""
                style="width: 50px; height: 50px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="price" label="单价">
            <template #default="{ row }">
              <span>{{ fenToYuan(row.unit_price) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-divider />
      <div>
        <div>订单收货地址</div>
        <el-descriptions size="small" v-if="order.order_address">
          <el-descriptions-item label="收货人">{{ order.order_address.recipient_name }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ order.order_address.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">
            {{ order.order_address.province }}{{ order.order_address.city }} {{ order.order_address.district
            }}{{ order.order_address.detail_address }}
          </el-descriptions-item>
        </el-descriptions>
        <el-tag type="info" v-else>暂无订单收货地址</el-tag>
      </div>

      <div>
        <div>订单物流信息</div>
        <el-descriptions size="small" border v-if="order.shipped_logistics">
          <el-descriptions-item label="物流公司code"
            >{{ order.shipped_logistics.logistics_company_code }}
          </el-descriptions-item>
          <el-descriptions-item label="物流公司名称"
            >{{ order.shipped_logistics.logistics_company_name }}
          </el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ order.shipped_logistics.logistics_no }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ order.shipped_logistics.remark }}</el-descriptions-item>
        </el-descriptions>
        <el-tag type="info" v-else>暂无订单物流信息</el-tag>
      </div>

      <el-divider />
      <div>
        <div>售后申请信息</div>
        <el-descriptions size="small" v-if="service">
          <el-descriptions-item label="状态" :span="1">
            <OrderServiceStatus :order="order" :service="service" />
          </el-descriptions-item>
          <el-descriptions-item label="退款状态" :span="1">
            <OrderServiceRefundStatus :order="order" :service="service" />
          </el-descriptions-item>
          <el-descriptions-item label="退款金额" :span="1">
            <span style="color: red">
              {{ fenToYuan(service.refund_amount) }}
            </span>
          </el-descriptions-item>

          <el-descriptions-item label="申请时间">
            {{ formatTime(service.apply_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="申请类型">
            <OrderServiceTypeDesc :order="order" :service="service" />
          </el-descriptions-item>
          <el-descriptions-item label="是否已收到货">
            <OrderServiceReceiptStatus :order="order" :service="service" />
          </el-descriptions-item>

          <el-descriptions-item label="申请原因">
            {{ service.reason_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="申请说明" :span="2">
            {{ service.remark }}
          </el-descriptions-item>
        </el-descriptions>
        <el-tag type="info" v-else>未申请售后</el-tag>

        <el-table v-if="service && service.evidence" :data="service.evidence.list || []" border stripe>
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="url" label="图片">
            <template #default="{ row }">
              <el-image
                :src="row.url"
                fit="fill"
                :preview-src-list="[row.url]"
                alt=""
                style="width: 50px; height: 50px"
              />
            </template>
          </el-table-column>
        </el-table>

        <div>退货物流信息</div>
        <el-descriptions size="small" border v-if="service && service.return_logistics">
          <el-descriptions-item label="物流公司code"
            >{{ service.return_logistics.logistics_company_code }}
          </el-descriptions-item>
          <el-descriptions-item label="物流公司名称"
            >{{ service.return_logistics.logistics_company_name }}
          </el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ service.return_logistics.logistics_no }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ service.return_logistics.remark }}</el-descriptions-item>
        </el-descriptions>
        <el-tag type="info" v-else>暂无退货物流信息</el-tag>
      </div>
    </el-card>
  </common-dialog>
</template>

<script setup>
import { formatTime, fenToYuan } from '@/utils/tools'
import CommonDialog from '@/components/common/CommonDialog.vue'
import OrderStatus from '@/components/order/order-status.vue'
import OrderServiceStatus from '@/components/order/order-service-status.vue'
import OrderServiceTypeDesc from '@/components/order/order-service-type-desc.vue'
import OrderServiceReceiptStatus from '@/components/order/order-service-receipt-status.vue'
import OrderServiceRefundStatus from '@/components/order/order-service-refund-status.vue'

const { order } = defineProps({
  order: {
    type: Object,
    required: true,
  },
  service: {
    type: [Object, null, undefined],
  },
})
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleConfirm = () => {
  // Handle confirm action
  console.log('handleConfirm')
  emit('confirm')
}
</script>

<style scoped lang="less"></style>
