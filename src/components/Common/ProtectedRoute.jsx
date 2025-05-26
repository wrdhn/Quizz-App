import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '50vh' }}
      >
        <Spinner animation='border' variant='success' />
      </div>
    )
  }

  // redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
