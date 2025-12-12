
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
