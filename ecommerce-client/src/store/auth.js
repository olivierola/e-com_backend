import { defineStore } from 'pinia'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getUser: (state) => state.user
  },
  
  actions: {
    initAuth() {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (token && user) {
        this.setUser(user)
        this.setToken(token)
      }
    },
    
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        this.setUser(response.data.user)
        this.setToken(response.data.token)
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de la connexion'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(userData)
        this.setUser(response.data.user)
        this.setToken(response.data.token)
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    
    async fetchProfile() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await authService.getProfile()
        this.setUser(response.data.user)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    }
  }
})