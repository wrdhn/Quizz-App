import { useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

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
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '70vh' }}
    >
      <Card style={{ width: '400px' }} className='shadow'>
        <Card.Body className='p-4'>
          <div className='text-center mb-4'>
            <div className='icon fs-1'>Quizz</div>
            <p className='text-muted'>Please log in to continue</p>
          </div>

          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label className=' ms-2'>
                <i className='bi bi-person me-2'></i>
                Username
              </Form.Label>
              <Form.Control
                type='text'
                name='username'
                className='form-select-lg'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter username'
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label className='ms-2'>
                <i className='bi bi-lock me-2'></i>
                Password
              </Form.Label>
              <Form.Control
                type='password'
                name='password'
                className='form-control-lg'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password'
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant='success'
              type='submit'
              className='login-btn green-btn w-100'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation='border' size='sm' className='me-2' />
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>

          <div className='mt-3 text-center'>
            <small className='text-muted'>
              Demo: username = admin, password = password
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
