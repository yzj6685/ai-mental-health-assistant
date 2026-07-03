import request from '@/utils/request'
export const getDashboardApi = () => {
  return request.get('/data-analytics/overview')
}