import request from '@/utils/request'

export function uploadImage(data) {
    return request({
        url: '/file/uploadImage',
        method: 'post',
        headers: {
            "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: data
    })
}
export function getCategory(query) {
    return request({
        url: '/help/getGroupCategory',
        method: 'get',
        params: query
    })
}

