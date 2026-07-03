import request from '@/utils/request'
export const getArticlePageApi = (params) => {
  return request.get('/knowledge/article/page',{params})
}