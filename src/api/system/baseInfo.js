import request from '@/utils/request'

// 查询基地信息管理列表
export function listBaseInfo(query) {
  return request({
    url: '/system/baseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询基地信息管理详细
export function getBaseInfo(baseId) {
  return request({
    url: '/system/baseInfo/' + baseId,
    method: 'get'
  })
}

// 新增基地信息管理
export function addBaseInfo(data) {
  return request({
    url: '/system/baseInfo',
    method: 'post',
    data: data
  })
}

// 修改基地信息管理
export function updateBaseInfo(data) {
  return request({
    url: '/system/baseInfo',
    method: 'put',
    data: data
  })
}

// 修改基地信息状态
export function changeBaseStatus(baseId,status) {
  const data = {
    baseId,
    status
  }
  return request({
    url: '/system/baseInfo/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除基地信息管理
export function delBaseInfo(baseId) {
  return request({
    url: '/system/baseInfo/' + baseId,
    method: 'delete'
  })
}

// 导出基地信息管理
export function exportBaseInfo(query) {
  return request({
    url: '/system/baseInfo/export',
    method: 'get',
    params: query
  })
}

// 获取地点信息所有经纬度
export function getBaseTude() {
  return request({
    url: '/system/baseInfo/selectBaseTudeAndID',
    method: 'get'
  })
}


