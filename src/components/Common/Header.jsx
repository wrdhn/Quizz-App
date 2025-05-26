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

  return (
    <Navbar
      className='bg-white border-bottom shadow-sm'
      sticky='top'
      expand='lg'
      variant='light'
    >
      <Container>
        <Navbar.Brand className='fs-3 icon'>Quizz</Navbar.Brand>

        {isAuthenticated && (
          <Button size='sm' onClick={handleLogout} className='green-btn'>
            <i className='bi bi-box-arrow-right me-2'></i>
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
