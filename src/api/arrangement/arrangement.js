import request from '@/utils/request'

// 查询实习安排列表
export function listArrangement(query) {
  return request({
    url: '/arrangement/arrangement/list',
    method: 'post',
    params: query
  })
}

// 获取实习大屏数据
export function getScreenData(query) {
  return request({
    url: '/arrangement/arrangement/getScreenData',
    method: 'post',
    params: query
  })
}

//获取所有学生实习信息
export function selectAllPractice(query) {
  return request({
    url: '/arrangement/arrangement/selectAllPractice',
    method: 'post',
    params: query
  })
}

// 查询老师指导的学生信息
export function stuInfoList(query) {
  return request({
    url: '/arrangement/arrangement/stuInfoList',
    method: 'get',
    params: query
  })
}

// 查询实习安排详细
export function getArrangement(arrangementId) {
  return request({
    url: '/arrangement/arrangement/' + arrangementId,
    method: 'get'
  })
}

// 新增实习安排
export function addArrangement(data) {
  return request({
    url: '/arrangement/arrangement',
    method: 'post',
    data: data
  })
}

// 修改实习安排
export function updateArrangement(data) {
  return request({
    url: '/arrangement/arrangement',
    method: 'put',
    data: data
  })
}

// 删除实习安排
export function delArrangement(arrangementId) {
  return request({
    url: '/arrangement/arrangement/' + arrangementId,
    method: 'delete'
  })
}

// 导出实习安排
export function exportArrangement(query) {
  return request({
    url: '/arrangement/arrangement/export',
    method: 'get',
    params: query
  })
}
