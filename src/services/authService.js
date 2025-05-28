import api from './api'

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', {
        username,
        password,
      })
      console.info('Login success')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  },
  register: async (username, password) => {
    try {
      const response = await api.post('/register', {
        username,
        password,
      })
      console.info('Register success')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  },
}
