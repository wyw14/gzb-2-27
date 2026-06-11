import request from '../request'

export const skillTreeAPI = {
  updateSkillTree: (data) => request.put('/skill-tree', data)
}

export default skillTreeAPI
