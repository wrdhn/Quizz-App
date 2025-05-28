import api from './api'

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
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

  // Dummy login untuk development
  dummyLogin: async (username, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          resolve({
            success: true,
            data: {
              token: 'dummy-jwt-token-' + Date.now(),
              user: {
                id: 1,
                username: 'admin',
              },
            },
          })
        } else {
          resolve({
            success: false,
            error: 'Username atau    salah',
          })
        }
      }, 1000)
    })
  },
}
