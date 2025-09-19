import request from '@/utils/request'

// 查询岗位列表
export function listUserSmsLog(query) {
  return request({
    url: '/user/getVerificationCodeLog',
    method: 'get',
    params: query
  })
}
