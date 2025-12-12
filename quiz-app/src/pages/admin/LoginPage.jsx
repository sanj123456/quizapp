import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => location.state?.from || '/admin', [location.state])

  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ username, email, password, role: 'admin' })
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper sx={{ width: 420, p: 3 }}>
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Typography variant="h5">{mode === 'login' ? 'Admin Login' : 'Create Admin Account'}</Typography>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {mode === 'register' ? (
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          ) : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an admin account? Register' : 'Already have an account? Login'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
