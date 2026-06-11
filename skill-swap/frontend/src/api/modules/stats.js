import request from '../request'

export const statsAPI = {
  getPopularSkills: () => request.get('/stats/popular-skills'),
  getSuccessRate: () => request.get('/stats/success-rate')
}

export default statsAPI
