import request from '@/utils/request'

// 查询分散实习申请列表
export function listDecentralize(query) {
  return request({
    url: '/decentralize/decentralize/list',
    method: 'get',
    params: query
  })
}

// 查询分散实习申请列表
export function getDecentralizeByLocation(query) {
  return request({
    url: '/decentralize/decentralize/getDecentralizeByLocation',
    method: 'get',
    params: query
  })
}

// 查询分散实习申请详细
export function getDecentralizeInfo(applyId) {
  return request({
    url: '/decentralize/decentralize/getDecentralizeInfo/' + applyId,
    method: 'get'
  })
}

// 查询分散实习申请详细
export function getDecentralize(applyId) {
  return request({
    url: '/decentralize/decentralize/' + applyId,
    method: 'get'
  })
}

// 新增分散实习申请
export function addDecentralize(data) {
  return request({
    url: '/decentralize/decentralize',
    method: 'post',
    data: data
  })
}
// 修改分散实习申请
export function updateDecentralize(data) {
  return request({
    url: '/decentralize/decentralize',
    method: 'put',
    data: data
  })
}

// 修改分散实习申请
export function updateDecentralizes(data) {
  return request({
    url: '/decentralize/decentralize/updatePractices',
    method: 'post',
    data: data
  })
}

// 删除分散实习申请
export function delDecentralize(applyId) {
  return request({
    url: '/decentralize/decentralize/' + applyId,
    method: 'delete'
  })
}

// 导出分散实习申请
export function exportDecentralize(query) {
  return request({
    url: '/decentralize/decentralize/export',
    method: 'get',
    params: query
  })
}

// 查询学生实习信息
export function getStudentPracticeInfo() {
  return request({
    url: '/arrangement/arrangement/getPracticeInfo',
    method: 'get'
  })
}
