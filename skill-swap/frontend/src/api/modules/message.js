import request from '../request'

export const messageAPI = {
  getConversations: () => request.get('/conversations'),
  getMessages: (userId) => request.get(`/messages/${userId}`),
  sendMessage: (data) => request.post('/messages', data)
}

export default messageAPI
