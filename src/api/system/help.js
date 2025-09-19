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
export function getSetIds() {
  return request({
    url: '/help/getSetIdByAddHelp',
    method: 'get',
  })
}

export function insert(data) {
  return request({
    url: '/help/insert',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}
export function getHelpById(query) {
  return request({
    url: '/help/getHelpById',
    method: 'get',
    params: query
  })
}


export function edit(data) {
  return request({
    url: '/help/edit',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}


export function addType(data) {
  return request({
    url: '/help/addType',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}
export function editType(data) {
  return request({
    url: '/help/editType',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}
export function listCategory(query) {
  return request({
    url: '/help/getCategory',
    method: 'get',
    params:query
  })
}

export function delHelpCategory(query) {
  return request({
    url: '/help/delHelpCategory',
    method: 'get',
    params:query
  })
}
export function categoryAddToUpdate(data) {
  return request({
    url: '/help/category/addToUpdate',
    method: 'post',
    headers: {
      "Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data:data
  })
}

export function upOrDownCatagory(query) {
  return request({
    url: '/help/upOrDownCatagory',
    method: 'get',
    params:query
  })
}


