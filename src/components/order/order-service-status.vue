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
  if (service.status === 'applied' || service.status === 'approved') {
    return 'primary'
  } else if (service.status === 'canceled' || service.status === 'rejected') {
    return 'warning'
  } else if (service.status === 'completed') {
    return 'success'
  } else {
    return 'info'
  }
})

const status = computed(() => {
  if (!service) {
    return '无'
  }
  return service.service_status_desc || '无'
})
</script>

<style scoped lang="less"></style>
