import request from '@/utils/request'
export const startSessionApi=(data)=>{
    return request({
        url:'/psychological-chat/session/start',
        method:'post',
        data
    })
}