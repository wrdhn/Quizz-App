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

    // basic validation
    if (!formData.username || !formData.password) {
      setError('Username dan password harus diisi')
      setLoading(false)
      return
    }

    const result = await login(formData.username, formData.password)

    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error || 'Login gagal')
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
            <h2 className='icon fs-2'>Quizz</h2>
            <p className='text-muted'>Silakan login untuk melanjutkan</p>
          </div>

          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Masukkan username'
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Masukkan password'
                disabled={loading}
              />
            </Form.Group>

            <Button type='submit' className='w-100' disabled={loading}>
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
