import request from '@/utils/request'
export const getConsulationListApi = (params) => {
  return request.get('/psychological-chat/sessions', { params })
}
export const getConsulationDetailApi = (sessionId) => {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export const getSessionDetailApi = (params) => {
  return request.get(`/psychological-chat/sessions`,{params})
}
