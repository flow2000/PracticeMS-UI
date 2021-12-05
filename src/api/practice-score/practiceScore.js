import request from '@/utils/request'

// 查询实习成绩列表
export function listPracticeScore(query) {
  return request({
    url: '/practice-score/practiceScore/list',
    method: 'get',
    params: query
  })
}
// 查询设置项
export function listSetting() {
  return request({
    url: '/practice-score/practiceScore/setting/list',
    method: 'get',
  })
}

// 查询实习成绩详细
export function getPracticeScore(query) {
  return request({
    url: '/practice-score/practiceScore/' ,
    method: 'get',
    params: query
  })
}

// 新增实习成绩
export function addPracticeScore(data) {
  return request({
    url: '/practice-score/practiceScore',
    method: 'post',
    data: data
  })
}

// 修改设置信息
export function updateSetting(data) {
  return request({
    url: '/practice-score/practiceScore/setting/edit',
    method: 'put',
    data: data
  })
}

// 修改实习成绩
export function updatePracticeScore(data) {
  return request({
    url: '/practice-score/practiceScore',
    method: 'put',
    data: data
  })
}

// 计算成绩
export function calculate(scoreId) {
  return request({
    url: '/practice-score/practiceScore/calculate/' + scoreId,
    method: 'put'
  })
}

// 删除实习成绩
export function delPracticeScore(scoreId) {
  return request({
    url: '/practice-score/practiceScore/' + scoreId,
    method: 'delete'
  })
}

// 导出实习成绩
export function exportPracticeScore(query) {
  return request({
    url: '/practice-score/practiceScore/export',
    method: 'get',
    params: query
  })
}

// 导出归档实习成绩
export function exportArchivedScore(query) {
  return request({
    url: '/practice-score/practiceScore/exportArchived',
    method: 'get',
    params: query
  })
}


// 修改实习成绩状态
export function updateScoreStatus(scoreId,status) {
  const data = {
    scoreId,
    status
  }
  return request({
    url: '/practice-score/practiceScore/changeStatus',
    method: 'put',
    data: data
  })
}


// 查询归档实习成绩列表
export function archivedList(query) {
  return request({
    url: '/practice-score/practiceScore/archivedList',
    method: 'get',
    params: query
  })
}
