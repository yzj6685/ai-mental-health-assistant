import axios from 'axios'
import { ElMessage } from 'element-plus'
import pinia from '@/stores'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      config.headers['token'] = userStore.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const { data, config } = response
    if (data.code === '200') {
      return data
    } else if (data.code === '-1') {
      if (!config.url?.includes('/login')) {
        ElMessage.error('登录过期，请重新登录')
        const userStore = useUserStore(pinia)
        userStore.logout()
        window.location.href = '/auth/login'
      } else {
        ElMessage.error(data.msg || '请求失败')
        return Promise.reject('请求失败')
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default request