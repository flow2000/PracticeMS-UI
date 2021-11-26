import request from '@/utils/request'

// 查询实习信息列表
export function listPracticeInfo(query) {
  return request({
    url: '/practice-info/practiceInfo/list',
    method: 'get',
    params: query
  })
}


// 查询特定角色信息
export function listUserInfoByRole(query) {
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

// 修改实习信息状态
export function changeStatus(data) {
  return request({
    url: '/practice-info/practiceInfo/changeStatus',
    method: 'post',
    data: data
  })
}

// 实习分配
export function allocationPractice(data) {
  return request({
    url: '/practice-info/practiceInfo/allocationPractice',
    method: 'post',
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
