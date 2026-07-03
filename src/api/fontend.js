import request from '@/utils/request'
export const deleteSessionListApi = (sessionId) => {
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}
export const getChatMessagesApi = (sessionId) => {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
export const getEmotionAnalysisApi = (sessionId) => {
  return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}
export const setEmotionAnalysisApi = (data) => {
  return request.post('/emotion-diary',data)
}
export const getKnowledgeListApi = (params) => {
  return request.get('/knowledge/article/page',{params})
}
export const getKnowledgeDetailApi = (id) => {
  return request.get(`/knowledge/article/${id}`)
}