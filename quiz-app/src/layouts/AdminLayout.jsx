import { Outlet, Link, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button component={Link} to="/admin/quizzes" color="inherit">
            Quizzes
          </Button>
          <Button component={Link} to="/admin/quizzes/create" color="inherit">
            Create
          </Button>
          <Typography sx={{ mx: 2 }} variant="body2">
            {user?.email}
          </Typography>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
