<template>
  <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="closeOnClickModal">
    <slot></slot>

    <template #footer>
      <el-button v-if="showCancelBtn" @click="handleCancel">{{ cancelBtnText }}</el-button>
      <el-button v-if="showConfirmBtn" type="primary" @click="handleConfirm">{{ confirmBtnText }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const { title } = defineProps({
  title: {
    type: String,
    default: '对话框',
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  cancelBtnText: {
    type: String,
    default: '取 消',
  },
  confirmBtnText: {
    type: String,
    default: '确 定',
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
})
const dialogVisible = defineModel('dialogVisible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleConfirm = async () => {
  console.log('handleConfirm')
  emit('confirm')
}

const handleCancel = () => {
  console.log('handleCancel')
  dialogVisible.value = false
  emit('cancel')
}
</script>

<style lang="less" scoped></style>
