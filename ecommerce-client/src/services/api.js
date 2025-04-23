import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})



// Request interceptor for API calls
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    
    // Handle token expired errors (401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Clear localStorage and redirect to login
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api