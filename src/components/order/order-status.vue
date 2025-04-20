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

// 0-待付款 1-待发货 2-待收货 3-已收货 4-已评价 7-申请售后 8-已取消 9-已完成
const typ = computed(() => {
  if (order.status === 0) {
    return 'info'
  } else if (order.status === 1) {
    return 'primary'
  } else if (order.status === 2) {
    return 'info'
  } else if (order.status === 3) {
    return 'success'
  } else if (order.status === 4) {
    return 'success'
  } else if (order.status === 7) {
    return 'warning'
  } else if (order.status === 8) {
    return 'info'
  } else if (order.status === 9) {
    return 'success'
  } else {
    return 'info'
  }
})

const status = computed(() => {
  return order.status_desc || '无'
})
</script>

<style scoped lang="less"></style>
