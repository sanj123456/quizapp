import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'
import QuizForm from '../../components/quiz/QuizForm.jsx'
import QuestionForm from '../../components/quiz/QuestionForm.jsx'

export default function QuizEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.get(`/quizzes/${id}`)
      setQuiz(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleSaveMeta = async ({ title, description, isPublished }) => {
    setError('')
    setSaving(true)
    try {
      const { data } = await api.put(`/quizzes/${id}`, { title, description, isPublished })
      setQuiz(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async (questionPayload) => {
    setError('')
    setSaving(true)
    try {
      await api.post(`/quizzes/${id}/questions`, questionPayload)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add question')
    } finally {
      setSaving(false)
    }
  }

  const handleGoPublic = () => {
    navigate(`/quiz/${id}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!quiz) {
    return <Alert severity="error">Quiz not found</Alert>
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Edit Quiz</Typography>
        <Button variant="outlined" onClick={handleGoPublic}>
          Open Public View
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <QuizForm
        initialValues={{
          title: quiz.title || '',
          description: quiz.description || '',
          isPublished: !!quiz.isPublished,
        }}
        onSubmit={handleSaveMeta}
        submitLabel={saving ? 'Saving...' : 'Save'}
        showPublish
        disabled={saving}
      />

      <Divider />

      <Typography variant="h6">Add Question</Typography>
      <QuestionForm onSubmit={handleAddQuestion} disabled={saving} />

      <Divider />

      <Typography variant="h6">Questions ({quiz.questions?.length || 0})</Typography>
      {quiz.questions?.length ? (
        <Stack spacing={1}>
          {quiz.questions.map((q, idx) => (
            <Box key={q._id || idx} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {idx + 1}. [{q.questionType}] {q.question}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">No questions added yet.</Typography>
      )}
    </Stack>
  )
}
