import request from '../request'

export const authAPI = {
  register: (data) => request.post('/auth/register', data),
  login: (data) => request.post('/auth/login', data),
  getMe: () => request.get('/auth/me'),
  updateProfile: (data) => request.put('/users/profile', data),
  getUsers: (params) => request.get('/users', { params }),
  getUser: (id) => request.get(`/users/${id}`)
}

export default authAPI
