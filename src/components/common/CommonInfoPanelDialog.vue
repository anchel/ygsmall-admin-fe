<template>
  <el-dialog :title="title" v-model="visible" :close-on-click-modal="closeOnClickModal">
    <el-descriptions :title="infoTitle" :column="column" border>
      <slot name="extra" />
      <el-descriptions-item v-for="item in list" :key="item.label" :label="item.label" :span="item.span || 1">
        {{ item.value }}
      </el-descriptions-item>
    </el-descriptions>

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
    default: false,
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
  infoTitle: {
    type: String,
    default: '',
  },
  column: {
    type: Number,
    default: 3,
  },
  list: {
    type: Array,
    default: () => [],
  },
})
const visible = defineModel('visible', { type: Boolean })
const emit = defineEmits(['cancel', 'confirm'])

const handleConfirm = async () => {
  console.log('handleConfirm')
  visible.value = false
  emit('confirm')
}

const handleCancel = () => {
  console.log('handleCancel')
  visible.value = false
  emit('cancel')
}
</script>

<style lang="less" scoped></style>
