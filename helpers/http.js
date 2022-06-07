import { getAuthToken } from '@/plugins/Auth'
import http from 'axios'

export const getPortal = () => {
  return localStorage.getItem('portal')
}

http.interceptors.request.use(config => {
  config.headers.Authorization = getAuthToken(getPortal())
  config.headers['Access-Control-Allow-Origin'] = '*'
  return config
})

export default http

export * from '@/plugins/Auth'
