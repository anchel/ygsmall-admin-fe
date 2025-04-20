import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const ajax = axios.create({
  baseURL: '/',
  timeout: 600000,
  headers: {},
})

// Add a response interceptor
ajax.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data) {
      if (response.data.code !== 0 && response.data.message === 'no login') {
        router.push({
          name: 'Login',
        })
        return Promise.reject('no login')
      }

      if (response.data.code !== 0) {
        return Promise.reject(response.data.message)
      }

      // 正常情况
      return response.data
    }

    return Promise.reject('no http data')
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('ajax error', error)
    if (error.response && error.response.data) {
      let data = error.response.data
      if (data.code !== 0 && data.message === 'no login') {
        router.push({
          name: 'Login',
        })
        ElMessage.error(data.message)
      } else if (data.code !== 0) {
        ElMessage.error(data.message)
      }
    }
    return Promise.reject(error)
  },
)

export default ajax
