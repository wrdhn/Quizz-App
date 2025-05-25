import { Navbar, Container, Button } from 'react-bootstrap'

function Header({ onLogout }) {
  return (
    <Navbar
      className='bg-white border-bottom shadow-sm'
      sticky='top'
      expand='lg'
      variant='light'
    >
      <Container>
        <Navbar.Brand className='fw-bold' style={{ color: '#059669' }}>
          Quiz App
        </Navbar.Brand>

        <Button
          variant='outline-danger'
          size='sm'
          onClick={onLogout}
          className='d-flex align-items-center ms-auto'
        >
          <i className='bi bi-box-arrow-right me-2'></i>
          Log out
        </Button>
      </Container>
    </Navbar>
  )
}

export default Header
