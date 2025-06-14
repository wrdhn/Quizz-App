import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // check localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Data error: ', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password)
      console.log('result', result)

      if (result.success) {
        const { data } = result.response
        const { token, username } = data

        console.log('token', token)
        console.log('user', JSON.stringify(username))

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(username))

        setUser(user)
        setIsAuthenticated(true)

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'System error occurred' }
    }
  }

  const register = async (username, password) => {
    try {
      const result = await authService.register(username, password)

      if (result.success) {
        const { data } = result.response
        const { token, username } = data

        console.log('token', token)
        console.log('user', JSON.stringify(username))

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(username))

        setUser(user)
        setIsAuthenticated(true)

        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'System error occurred' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
