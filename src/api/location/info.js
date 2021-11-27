import request from '@/utils/request'

// 查询地点信息列表
export function listInfo(query) {
  return request({
    url: '/location/info/list',
    method: 'get',
    params: query
  })
}

// 获取地点信息所有经纬度
export function getTude() {
  return request({
    url: '/location/info/selectLocationTude',
    method: 'get'
  })
}

// 查询地点信息详细
export function getInfo(locationId) {
  return request({
    url: '/location/info/' + locationId,
    method: 'get'
  })
}

// 新增地点信息
export function addInfo(data) {
  return request({
    url: '/location/info',
    method: 'post',
    data: data
  })
}

// 修改地点信息
export function updateInfo(data) {
  return request({
    url: '/location/info',
    method: 'put',
    data: data
  })
}

// 删除地点信息
export function delInfo(locationId) {
  return request({
    url: '/location/info/' + locationId,
    method: 'delete'
  })
}

// 导出地点信息
export function exportInfo(query) {
  return request({
    url: '/location/info/export',
    method: 'get',
    params: query
  })
}

