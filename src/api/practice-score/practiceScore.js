import request from '@/utils/request'

// 查询实习成绩列表
export function listPracticeScore(query) {
  return request({
    url: '/practice-score/practiceScore/list',
    method: 'get',
    params: query
  })
}

// 查询实习成绩详细
export function getPracticeScore(scoreId) {
  return request({
    url: '/practice-score/practiceScore/' + scoreId,
    method: 'get'
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

// 修改实习成绩
export function updatePracticeScore(data) {
  return request({
    url: '/practice-score/practiceScore',
    method: 'put',
    data: data
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
