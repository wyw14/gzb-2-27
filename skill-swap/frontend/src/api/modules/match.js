import request from '../request'

export const matchAPI = {
  getMatches: (params) => request.get('/matches', { params })
}

export default matchAPI
