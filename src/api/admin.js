import request from '@/utils/request'
export const LoginApi = (data) => {
  return request.post('/user/login',data)
}

export const upLoadFileApi =(file,businessIfno) => {
  const formData = new FormData()
  formData.append('file',file)
  formData.append('businessType','ARTICLE')
  formData.append('businessId',businessIfno.businessId)
  formData.append('businessField','cover')
  return request.post('/file/upload',formData,{
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}

export const formDataSubmitApi =(data) => {
  return request.post('/knowledge/article',data)
}

export const getArticleListApi =(id) => {
  return request.get(`/knowledge/article/${id}`)
}

export const updateArticleApi =(id,data) => {
  return request.put(`/knowledge/article/${id}`,data)
}
export const publishArticleApi =(id,status) => {
  return request.put(`/knowledge/article/${id}/status`,status)
}
export const deleteArticleApi =(id) => {
  return request.delete(`/knowledge/article/${id}`)
}

export const logoutApi = () => {
  return request.post('/user/logout')
}
