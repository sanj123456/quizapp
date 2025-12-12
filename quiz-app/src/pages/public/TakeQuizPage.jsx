import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import api from '../../services/api.js'

export default function TakeQuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [answers, setAnswers] = useState({})

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      // Current backend requires auth for GET /api/quizzes/:id
      const { data } = await api.get(`/quizzes/${id}`)
      setQuiz(data)
      const initial = {}
      ;(data.questions || []).forEach((q) => {
        initial[q._id] = ''
      })
      setAnswers(initial)
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? 'This endpoint requires login currently. Please login as admin (or add public take-quiz API in backend).'
          : err?.response?.data?.message || 'Failed to load quiz',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }))
  }

  const results = useMemo(() => {
    if (!quiz?.questions?.length) return null

    let score = 0
    const detailed = quiz.questions.map((q) => {
      const userAnswer = answers[q._id] ?? ''
      let isCorrect = false

      if (q.questionType === 'short-answer') {
        isCorrect = (userAnswer || '').trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase()
      } else {
        // for MCQ / TF we stored correctAnswer in backend as text
        isCorrect = (userAnswer || '').trim() === (q.correctAnswer || '').trim()
      }

      if (isCorrect) score += q.points || 1

      return {
        questionId: q._id,
        question: q.question,
        questionType: q.questionType,
        userAnswer,
        correctAnswer: q.correctAnswer,
        points: q.points || 1,
        isCorrect,
      }
    })

    const total = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)

    return {
      quizId: quiz._id,
      quizTitle: quiz.title,
      totalPoints: total,
      score,
      answers: detailed,
    }
  }, [quiz, answers])

  const submit = () => {
    if (!results) return
    navigate(`/quiz/${id}/results`, { state: { results } })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!quiz) {
    return <Alert severity="error">Quiz not found</Alert>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{quiz.title}</Typography>
      {quiz.description ? <Typography color="text.secondary">{quiz.description}</Typography> : null}

      <Divider />

      {(quiz.questions || []).map((q, idx) => (
        <Box key={q._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="subtitle1">
            {idx + 1}. {q.question}
          </Typography>

          {q.questionType === 'multiple-choice' ? (
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup value={answers[q._id] ?? ''} onChange={(e) => handleChange(q._id, e.target.value)}>
                {(q.options || []).map((opt, i) => (
                  <FormControlLabel key={i} value={opt.text} control={<Radio />} label={opt.text} />
                ))}
              </RadioGroup>
            </FormControl>
          ) : null}

          {q.questionType === 'true-false' ? (
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup value={answers[q._id] ?? ''} onChange={(e) => handleChange(q._id, e.target.value)}>
                <FormControlLabel value="true" control={<Radio />} label="True" />
                <FormControlLabel value="false" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          ) : null}

          {q.questionType === 'short-answer' ? (
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              label="Your answer"
              value={answers[q._id] ?? ''}
              onChange={(e) => handleChange(q._id, e.target.value)}
            />
          ) : null}
        </Box>
      ))}

      <Button variant="contained" onClick={submit} disabled={!results}>
        Submit & View Results
      </Button>
    </Stack>
  )
}
