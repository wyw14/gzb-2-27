import request from '../request'

export const skillAPI = {
  getSkills: (params) => request.get('/skills', { params }),
  createSkill: (data) => request.post('/skills', data),
  updateSkill: (id, data) => request.put(`/skills/${id}`, data),
  deleteSkill: (id) => request.delete(`/skills/${id}`),
  getCategories: () => request.get('/skill-categories')
}

export default skillAPI
