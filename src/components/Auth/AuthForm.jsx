import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap'

function AuthForm({
  subtitle,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  submitLabel,
  footerText,
  footerActionLabel,
  onFooterAction,
}) {
  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '70vh' }}
    >
      <Card style={{ width: '400px' }} className='shadow'>
        <Card.Body className='p-4'>
          <div className='text-center mb-4'>
            <div className='icon fs-1'>Quizz</div>
            <p className='text-muted'>{subtitle}</p>
          </div>

          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={onSubmit}>
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
                onChange={onChange}
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
                onChange={onChange}
                placeholder='Enter password'
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant='success'
              type='submit'
              className='auth-btn btn-primary w-100'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation='border' size='sm' className='me-2' />
                  Loading...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </Form>

          <div className='d-flex justify-content-center gap-1 pt-5'>
            {footerText}
            <a
              className='link-primary text-decoration-none'
              onClick={onFooterAction}
              role='button'
            >
              {footerActionLabel}
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AuthForm
