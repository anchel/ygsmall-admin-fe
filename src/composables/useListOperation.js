import { reactive, ref, toRef, unref } from 'vue'
import { ElMessage } from 'element-plus'
import ajax from '@/utils/request'

export function useListOperation(options = {}) {
  const { defaults = {}, addApiUrl = '', updateApiUrl = '', deleteApiUrl = '' } = options

  const formData = ref({
    ...defaults,
  })
  const setFormData = (data = {}) => {
    formData.value = data
  }
  const resetForm = () => {
    formData.value = {
      ...defaults,
    }
  }

  const status = reactive({
    loading: false,
    dialogVisible: false,
  })

  const openDialog = () => {
    status.dialogVisible = true
  }

  const closeDialog = () => {
    status.dialogVisible = false
    resetForm()
  }

  const doSubmit = async () => {
    status.loading = true
    let response
    let form = unref(formData)
    try {
      if (form.id) {
        // Update operation
        response = await ajax.post(updateApiUrl, {
          ...form,
        })
      } else {
        // Add operation
        response = await ajax.post(addApiUrl, {
          ...form,
        })
      }
    } catch (e) {
      console.error(e)
      // ElMessage.error('操作失败')
      status.loading = false
      return Promise.reject(e || '操作失败')
    }

    console.log('handleSubmit', response)

    status.loading = false
    if (response.code !== 0) {
      // ElMessage.error(response.message)
      return Promise.reject(response.message)
    }

    // ElMessage.success('操作成功')

    return response.data || null
  }

  const doDelete = async (id) => {
    if (!id) {
      ElMessage.error('ID不能为空')
      return
    }

    status.loading = true
    let response
    try {
      response = await ajax.post(deleteApiUrl, { id })
    } catch (e) {
      console.error(e)
      // ElMessage.error('删除失败')
      status.loading = false
      return Promise.reject(e || '操作失败')
    }

    status.loading = false
    if (response.code !== 0) {
      // ElMessage.error(response.message)
      return Promise.reject(response.message)
    }

    // ElMessage.success('删除成功')
    return response.data || null
  }

  return {
    formData,
    resetForm,
    setFormData,
    status,
    doSubmit,
    doDelete,
    openDialog,
    closeDialog,
  }
}
