import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import QuizList from '../../components/quiz/QuizList.jsx'

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.get('/quizzes/my-quizzes')
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">My Quizzes</Typography>
        <Button component={Link} to="/admin/quizzes/create" variant="contained">
          Create Quiz
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading ? <QuizList quizzes={quizzes} onRefresh={load} /> : null}
    </Stack>
  )
}
