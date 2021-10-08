import request from '@/utils/request'

// 查询实习信息列表
export function listPracticeInfo(query) {
  return request({
    url: '/practice-info/practiceInfo/list',
    method: 'get',
    params: query
  })
}

// 查询指导老师信息
export function listTeacherInfo(query) {
	console.log(query)
  return request({
    url: '/system/user/listByRole',
    method: 'get',
    params: query
  })
}

// 查询实习信息详细
export function getPracticeInfo(infoId) {
  return request({
    url: '/practice-info/practiceInfo/' + infoId,
    method: 'get'
  })
}

// 新增实习信息
export function addPracticeInfo(data) {
	data.surplus = data.number
  return request({
    url: '/practice-info/practiceInfo',
    method: 'post',
    data: data
  })
}

// 修改实习信息
export function updatePracticeInfo(data) {
  return request({
    url: '/practice-info/practiceInfo',
    method: 'put',
    data: data
  })
}

// 删除实习信息
export function delPracticeInfo(infoId) {
  return request({
    url: '/practice-info/practiceInfo/' + infoId,
    method: 'delete'
  })
}

// 导出实习信息
export function exportPracticeInfo(query) {
  return request({
    url: '/practice-info/practiceInfo/export',
    method: 'get',
    params: query
  })
}