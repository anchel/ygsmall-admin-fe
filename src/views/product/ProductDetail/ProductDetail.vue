<template>
  <div class="content-root">
    <div>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
        <el-form-item label="主图">
          <image-cropper
            :preview-height="300"
            :crop-size-height="600"
            :crop-width-height-ratio="2"
            :crop-img-original-ratio="true"
            :img-url="form.primary_image"
            v-model="cropImg"
          ></image-cropper>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category_id" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import ajax from '@/utils/request'
import { formatTime, fenToYuan } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'
// import AttributeValueList from './components/AttributeValueList.vue'

import { useGlobalStore } from '@/stores/global'
import { Search, Refresh } from '@element-plus/icons-vue'

import CommonDialog from '@/components/common/CommonDialog.vue'
import ImageCropper from '@/components/common/image-cropper.vue'

const { refreshPage } = useGlobalStore()

const form = reactive({
  title: '',
  description: '',
  primary_image: '',
  category_id: '',
})
const cropImg = ref(null)
</script>

<style lang="less" scoped>
.content-root {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
}
</style>
