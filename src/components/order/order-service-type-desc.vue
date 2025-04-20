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
  if (service.service_type === 'RETURN_MONEY') {
    return 'primary'
  }
  if (service.service_type === 'RETURN_GOODS_MONEY') {
    return 'warning'
  }
  return 'info'
})

const status = computed(() => {
  if (!service) {
    return '无'
  }
  if (service.service_type === 'RETURN_MONEY') {
    return '退款'
  }
  if (service.service_type === 'RETURN_GOODS_MONEY') {
    return '退货退款'
  }
  return service.service_type
})
</script>

<style scoped lang="less"></style>
