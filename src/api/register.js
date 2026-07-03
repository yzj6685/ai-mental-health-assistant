import request from '@/utils/request'
export const registerApi=(data)=>{
    return request({
        url:'/user/add',
        method:'post',
        data
    })
}