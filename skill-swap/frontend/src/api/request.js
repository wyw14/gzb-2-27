import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

let onAuthFailure = null
let getToken = null
let setToken = null

export function setupRequestHelpers(helpers) {
  onAuthFailure = helpers.onAuthFailure
  getToken = helpers.getToken
  setToken = helpers.setToken
}

request.interceptors.request.use(config => {
  const token = getToken ? getToken() : localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => request(originalRequest))
          .catch(err => Promise.reject(err))
      }

      isRefreshing = true

      const token = getToken ? getToken() : localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (setToken) setToken('')
      }

      processQueue(new Error('登录已过期'))
      isRefreshing = false

      ElMessage.warning('登录已过期，请重新登录')

      if (onAuthFailure) {
        onAuthFailure()
      } else {
        window.location.href = '/login'
      }

      return Promise.reject(new Error('登录已过期，请重新登录'))
    }

    const msg = error.response?.data?.error || '请求失败，请稍后重试'
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  }
)

export default request
