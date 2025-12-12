import { Outlet, Link } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

export default function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Quiz App
          </Typography>
          <Button component={Link} to="/admin/login" color="inherit">
            Admin
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
