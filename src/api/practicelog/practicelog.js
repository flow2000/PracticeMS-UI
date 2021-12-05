import request from '@/utils/request'

// 查询实习日志列表
export function listPracticelog(query) {
  return request({
    url: '/practicelog/practicelog/list',
    method: 'get',
    params: query
  })
}

// 查询实习日志详细
export function getPracticelog(logId) {
  return request({
    url: '/practicelog/practicelog/' + logId,
    method: 'get'
  })
}

// 新增实习日志
export function addPracticelog(data) {
  return request({
    url: '/practicelog/practicelog',
    method: 'post',
    data: data
  })
}

// 修改实习日志
export function updatePracticelog(data) {
  return request({
    url: '/practicelog/practicelog',
    method: 'put',
    data: data
  })
}

// 删除实习日志
export function delPracticelog(logId) {
  return request({
    url: '/practicelog/practicelog/' + logId,
    method: 'delete'
  })
}

// 导出实习日志
export function exportPracticelog(query) {
  return request({
    url: '/practicelog/practicelog/export',
    method: 'get',
    params: query
  })
}
// 导出归档实习日志
export function exportArchivedPracticelog(query) {
  return request({
    url: '/practicelog/practicelog/exportArchived',
    method: 'get',
    params: query
  })
}


// 获得当天的填写日志人数
export function getTodayPracLogList() {
  return request({
    url: '/practicelog/practicelog/getTodayPracLogList',
    method: 'get'
  })
}

// 查询归档实习日志列表
export function archivedList(query) {
  return request({
    url: '/practicelog/practicelog/archivedList',
    method: 'get',
    params: query
  })
}
