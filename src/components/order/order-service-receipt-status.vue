<template>
  <el-tag :type="typ">{{ status }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const { order, service } = defineProps({
  order: {
    type: [Object, null],
    required: true,
  },
  service: {
    type: [Object, null],
    required: true,
  },
})

const typ = computed(() => {
  if (!service) {
    return 'info'
  }
  if (service.goods_receipt_status === 'NOT_RECEIVED') {
    return 'primary'
  }
  if (service.goods_receipt_status === 'RECEIVED') {
    return 'warning'
  }
  return 'info'
})

const status = computed(() => {
  if (!service) {
    return '无'
  }
  if (service.goods_receipt_status === 'NOT_RECEIVED') {
    return '未收到货'
  }
  if (service.goods_receipt_status === 'RECEIVED') {
    return '已收到货'
  }
  return service.goods_receipt_status
})
</script>

<style scoped lang="less"></style>
