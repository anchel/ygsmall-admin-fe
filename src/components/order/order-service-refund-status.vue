<template>
  <el-tag :type="typ">{{ status }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const { order, service } = defineProps({
  order: {
    type: [Object, null, undefined],
    default() {
      return {}
    },
  },
  service: {
    type: [Object, null, undefined],
    default() {
      return {}
    },
  },
})

const typ = computed(() => {
  if (!service) {
    return 'info'
  }
  if (service.refund_status === 'approved') {
    return 'primary'
  }
  if (service.refund_status === 'processing') {
    return 'warning'
  }
  if (service.refund_status === 'completed') {
    return 'success'
  }
  return 'info'
})

// 'approved-审核通过 processing-退款中 completed-已完成'
const status = computed(() => {
  if (!service) {
    return '无'
  }
  if (service.refund_status === 'approved') {
    return '已同意退款'
  }
  if (service.refund_status === 'processing') {
    return '已执行退款'
  }
  if (service.refund_status === 'completed') {
    return '已完成退款'
  }
  return service.refund_status || '无'
})
</script>

<style scoped lang="less"></style>
