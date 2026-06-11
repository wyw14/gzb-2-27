import request from '../request'

export const reviewAPI = {
  createReview: (data) => request.post('/reviews', data),
  getReviews: (userId) => request.get(`/reviews/${userId}`)
}

export default reviewAPI
