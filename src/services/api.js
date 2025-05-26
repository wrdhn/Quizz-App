import axios from 'axios'

// Base configuration
const API_BASE_URL = 'http://localhost:3000/api' // Ganti sesuai API Anda nanti

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - untuk menambahkan token ke setiap request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor - untuk handle error global
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Jika token expired atau unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
