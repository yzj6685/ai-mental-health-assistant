import request from '@/utils/request'
export const getEmotionListApi = (params) => {
  return request.get('/emotion-diary/admin/page', { params })
}
export const deleteEmotionListApi = (id) => {
  return request.delete(`/emotion-diary/admin/${id}`)
}