import request from '../request'

export const exchangeAPI = {
  getExchanges: () => request.get('/exchanges'),
  createExchange: (data) => request.post('/exchanges', data),
  confirmExchange: (id) => request.put(`/exchanges/${id}/confirm`)
}

export default exchangeAPI
