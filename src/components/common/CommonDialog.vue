<template>
  <el-dialog :title="title" v-model="visible" :width="width" :close-on-click-modal="closeOnClickModal">
    <slot></slot>

    <template #footer>
      <el-button v-if="showCancelBtn" @click="handleCancel">{{ cancelBtnText }}</el-button>
      <el-button v-if="showConfirmBtn" type="primary" @click="handleConfirm" :loading="confirmBtnLoading">
        {{ confirmBtnText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const { title, confirmBtnLoading } = defineProps({
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
  confirmBtnLoading: {
    type: Boolean,
    default: false,
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '80%',
  },
})
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleConfirm = async () => {
  console.log('handleConfirm')
  emit('confirm')
}

const handleCancel = () => {
  console.log('handleCancel')
  visible.value = false
  emit('cancel')
}
</script>

<style lang="less" scoped></style>
