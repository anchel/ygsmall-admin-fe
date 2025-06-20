<template>
  <div class="content-root">
    <div class="top">
      <el-button type="primary" @click="handleAdd(0)">添加顶级分类</el-button>
      <el-button type="info" @click="refreshList" style="margin-left: 10px">刷新列表</el-button>
    </div>
    <div class="list">
      <el-tree
        :data="listData.list"
        :props="{ class: 'my-tree-node' }"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div style="display: flex; align-items: center">
              <span>{{ node.label }}</span>
              <el-image
                v-if="data.thumbnail"
                :src="data.thumbnail"
                fit="contain"
                style="margin-left: 10px; width: 20px; height: 20px"
                :preview-src-list="[data.thumbnail]"
              />
            </div>

            <div>
              <el-button type="primary" link @click="handleAppend(data)"> 添加</el-button>
              <el-button style="margin-left: 4px" type="primary" link @click="handleEdit(node, data)"> 编辑</el-button>
              <el-button style="margin-left: 4px" type="danger" link @click="handleRemove(node, data)">
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <el-dialog
      v-model="status.dialogVisible"
      :title="editForm.id ? '编辑分类' : '添加分类'"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" class="edit-form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parent_id" v-if="editForm.parent_id">
          <el-select v-model="editForm.parent_id" placeholder="请选择上级分类">
            <el-option v-for="item in listData.list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="缩略图" prop="thumbnail">-->
        <!--          <el-upload-->
        <!--            class="thumbnail-uploader"-->
        <!--            action="/api/common/upload-image"-->
        <!--            :show-file-list="false"-->
        <!--            :on-success="onUploadSuccess"-->
        <!--            :before-upload="-->
        <!--              (file) => {-->
        <!--                const isImage = file.type.startsWith('image/')-->
        <!--                if (!isImage) {-->
        <!--                  ElMessage.error('只能上传图片文件')-->
        <!--                  return false-->
        <!--                }-->
        <!--                const isLt2M = file.size / 1024 / 1024 < 2-->
        <!--                if (!isLt2M) {-->
        <!--                  ElMessage.error('图片大小不能超过 2MB')-->
        <!--                  return false-->
        <!--                }-->
        <!--                return true-->
        <!--              }-->
        <!--            "-->
        <!--          >-->
        <!--            <el-button size="small" type="primary">点击上传缩略图</el-button>-->
        <!--          </el-upload>-->
        <!--          <div v-if="editForm.thumbnail" class="thumbnail-preview">-->
        <!--            <el-image-->
        <!--              :src="editForm.thumbnail"-->
        <!--              :preview-src-list="[editForm.thumbnail]"-->
        <!--              fit="contain"-->
        <!--              style="width: 100px; height: 100px; margin-top: 10px"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item label="缩略图">
          <image-cropper
            :preview-height="100"
            :crop-size-height="100"
            :crop-width-height-ratio="1"
            :crop-img-original-ratio="true"
            :img-url="editForm.thumbnail"
            v-model="cropImg"
          ></image-cropper>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="listStatus.loading" @click="handleSave">保存</el-button>
          <el-button @click="status.dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import ajax from '@/utils/request.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadImage } from '@/utils/tools.js'
import ImageCropper from '@/components/common/image-cropper.vue'

const pagination = reactive({
  page: 1,
  size: 2000,
})

const listData = reactive({
  list: [],
  total: 0,
})
const listStatus = reactive({
  loading: false,
})

const getList = async () => {
  listStatus.loading = true
  let response
  try {
    let offset = (pagination.page - 1) * pagination.size
    let count = pagination.size

    response = await ajax.get('/api/category/list', {
      params: {
        offset,
        count,
      },
    })
  } catch (e) {
    console.error(e)
    ElMessage.error('获取数据失败')
    listStatus.loading = false
    return
  }

  listStatus.loading = false
  let data = response
  if (data.code !== 0) {
    ElMessage.error(data.message)
    return
  }

  let list = data.data || []

  listData.list = list.map((item) => ({
    ...item,
    label: item.name,
  }))
}

onMounted(() => {
  getList()
})

const refreshList = async () => {
  pagination.page = 1
  await getList()
}

const cropImg = ref(null)
const editForm = ref({
  id: '',
  name: '',
  parent_id: 0,
  thumbnail: '',
})
const status = reactive({
  dialogVisible: false,
})

const resetForm = () => {
  editForm.value = {
    id: '',
    name: '',
    parent_id: 0,
    thumbnail: '',
  }
  cropImg.value = null
}

const handleAdd = (parentID) => {
  resetForm()
  editForm.value.parent_id = parentID || 0
  status.dialogVisible = true
}

const handleAppend = (data) => {
  resetForm()
  editForm.value.parent_id = data.id
  status.dialogVisible = true
}
const handleEdit = (node, data) => {
  resetForm()
  editForm.value = { ...data }
  status.dialogVisible = true
}

const onUploadSuccess = (response, file) => {
  console.log('上传成功', response, file)
  if (response.code === 0) {
    editForm.value.thumbnail = response.data.imgUrl
  } else {
    ElMessage.error(response.message)
  }
}

const handleSave = async () => {
  if (!editForm.value.name) {
    ElMessage.error('请输入分类名称')
    return
  }

  listStatus.loading = true
  try {
    if (!editForm.value.thumbnail) {
      if (!cropImg.value) {
        ElMessage.error('请选择分类的图片')
        listStatus.loading = false
        return
      }
      editForm.value.thumbnail = await uploadImage(cropImg.value, 'thumb.jpeg')
    } else {
      // 如果已经有缩略图，检查是否需要重新上传
      if (cropImg.value) {
        editForm.value.thumbnail = await uploadImage(cropImg.value, 'thumb.jpeg')
      }
    }

    let apiUrl = editForm.value.id ? '/api/category/update' : '/api/category/add'
    let response = await ajax.post(apiUrl, {
      ...editForm.value,
    })
    listStatus.loading = false

    if (response.code !== 0) {
      ElMessage.error(response.message)
      return
    }
    ElMessage.success('保存成功')

    status.dialogVisible = false
    await refreshList()
  } catch (e) {
    console.error(e)
    listStatus.loading = false
    ElMessage.error('保存失败，请重试')
  }
}

const handleRemove = async (node, data) => {
  if (data.children && data.children.length > 0) {
    ElMessage.warning('请先删除子节点')
    return
  }

  try {
    let confirmRet = await ElMessageBox.confirm('此操作将永久删除该节点, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    console.log(confirmRet)
    if (confirmRet !== 'confirm') {
      return
    }
  } catch (e) {
    console.log('取消删除', e)
    return
  }

  let response
  try {
    response = await ajax.post('/api/category/delete', {
      id: data.id,
    })
  } catch (e) {
    console.error(e)
    ElMessage.error('获取数据失败')
    listStatus.loading = false
    return
  }
  if (response.code !== 0) {
    ElMessage.error(response.message)
    return
  }
  ElMessage.success('删除成功')

  await refreshList()
}
</script>

<style lang="less" scoped>
.content-root {
  padding: 20px;
  //background-color: #f5f5f5;
  //height: calc(100vh - 60px);

  .list {
    //width: 100%;
    //height: calc(100vh - 60px);
    //overflow-y: auto;
    margin-top: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}

.my-tree-node {
  height: 100px;
}
</style>
