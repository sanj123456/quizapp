import { useState } from 'react'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import QuizForm from '../../components/quiz/QuizForm.jsx'

export default function QuizCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async ({ title, description }) => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/quizzes', { title, description })
      navigate(`/admin/quizzes/${data._id}/edit`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Quiz
      </Typography>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      ) : null}

      <QuizForm onSubmit={handleCreate} submitLabel="Create" />
    </Box>
  )
}
