import request from '@/utils/request'

// 查询基地信息管理列表
export function listBaseInfo(query) {
  return request({
    url: '/baseInfo/baseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询基地信息管理详细
export function getBaseInfo(baseId) {
  return request({
    url: '/baseInfo/baseInfo/' + baseId,
    method: 'get'
  })
}

// 新增基地信息管理
export function addBaseInfo(data) {
  return request({
    url: '/baseInfo/baseInfo',
    method: 'post',
    data: data
  })
}

// 修改基地信息管理
export function updateBaseInfo(data) {
  return request({
    url: '/baseInfo/baseInfo',
    method: 'put',
    data: data
  })
}

// 删除基地信息管理
export function delBaseInfo(baseId) {
  return request({
    url: '/baseInfo/baseInfo/' + baseId,
    method: 'delete'
  })
}

// 导出基地信息管理
export function exportBaseInfo(query) {
  return request({
    url: '/baseInfo/baseInfo/export',
    method: 'get',
    params: query
  })
}