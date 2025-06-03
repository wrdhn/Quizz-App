import { Navbar, Container, Button } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCLick = () => {
    navigate('/')
  }

  return (
    <Navbar
      className='bg-white border-bottom shadow-sm'
      sticky='top'
      expand='lg'
      variant='light'
    >
      <Container>
        <Navbar.Brand className='fs-3 icon header' onClick={handleCLick}>
          Quizz
        </Navbar.Brand>
        {isAuthenticated && (
          <Button
            variant='success'
            size='sm'
            onClick={handleLogout}
            className='btn-primary'
          >
            <i className='bi bi-box-arrow-right me-2'></i>
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
