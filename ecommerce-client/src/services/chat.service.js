import api from './api'

export default {
  sendMessage(query) {
    return api.post('/chat', { query })
  }
}