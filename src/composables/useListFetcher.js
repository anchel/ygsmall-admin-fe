import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ajax from '@/utils/request'

export function useListFetcher(apiUrl) {
  const search = reactive({
    keyword: '',
  })

  const pagination = reactive({
    page: 1,
    size: 10,
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

      response = await ajax.get(apiUrl, {
        params: {
          offset,
          count,
          keyword: search.keyword,
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

    listData.list = data.data.list || []
    listData.total = data.data.total || 0
  }

  const handleKeywordChange = () => {
    listData.total = 0
    listData.list = []
    pagination.page = 1
    getList()
  }

  const onPageChange = (page) => {
    pagination.page = page
    getList()
  }

  onMounted(() => {
    getList()
  })

  return {
    search,
    pagination,
    listData,
    listStatus,
    handleKeywordChange,
    onPageChange,
    getList,
  }
}
