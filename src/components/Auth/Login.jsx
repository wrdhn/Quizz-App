import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuthForm from './AuthForm'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.username || !formData.password) {
      setError('Username and password is required')
      setLoading(false)
      return
    }

    const result = await login(formData.username, formData.password)

    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <AuthForm
      subtitle='Please log in to continue'
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel='Login'
      footerText='New here?'
      footerActionLabel='Register'
      onFooterAction={() => navigate('/register')}
    />
  )
}

export default Login
