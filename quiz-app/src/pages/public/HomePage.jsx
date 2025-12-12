import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import api from '../../services/api.js'

export default function HomePage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.get('/quizzes')
      setQuizzes(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Available Quizzes</Typography>
      <Typography color="text.secondary">
        Note: Taking a quiz requires backend support to fetch quiz questions publicly. Your current backend only returns published
        quiz list publicly.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && !error && quizzes.length === 0 ? (
        <Typography color="text.secondary">No published quizzes yet.</Typography>
      ) : null}

      <Stack spacing={1}>
        {quizzes.map((q) => (
          <Box key={q._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6">{q.title}</Typography>
            <Typography color="text.secondary">{q.description || '-'}</Typography>
            <Box sx={{ mt: 1 }}>
              <Button component={Link} to={`/quiz/${q._id}`} variant="contained" size="small">
                Take Quiz
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
