import api from './api'

export default {
  register(userData) {
    return api.post('/auth/register', userData)
  },
  
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  
  getProfile() {
    return api.get('/auth/profile')
  }
}