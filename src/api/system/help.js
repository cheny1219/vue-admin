import request from '@/utils/request'

export function listHelp(query) {
  return request({
    url: '/help/getHelp',
    method: 'get',
    params: query
  })
}
export function getCategory(query) {
  return request({
    url: '/help/getGroupCategory',
    method: 'get',
    params: query
  })
}

export function editTop(data) {
  return request({
    url: '/help/editTopInfo',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}
export function checkCount(query) {
  return request({
    url: '/help/getTopCount',
    method: 'get',
    params:query
  })
}
export function downHelp(query) {
  return request({
    url: '/help/editShow',
    method: 'get',
    params:query
  })
}

export function delHelp(query) {
  return request({
    url: '/help/del',
    method: 'get',
    params:query
  })
}




