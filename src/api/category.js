import request from '@/utils/request'
export const getCategoryListApi = () => {
  return request.get('/knowledge/category/tree')
}