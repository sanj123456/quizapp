import { Link, useLocation, useParams } from 'react-router-dom'
import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material'

export default function QuizResultsPage() {
  const { id } = useParams()
  const location = useLocation()
  const results = location.state?.results

  if (!results) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">No results found. Please take the quiz first.</Alert>
        <Button component={Link} to={`/quiz/${id}`} variant="contained">
          Go to Quiz
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Results</Typography>
      <Typography variant="h6">{results.quizTitle}</Typography>

      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Typography>
          Score: <strong>{results.score}</strong> / {results.totalPoints}
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={1}>
        {results.answers.map((a, idx) => (
          <Box key={a.questionId} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle2">
              {idx + 1}. [{a.questionType}] {a.question}
            </Typography>
            <Typography color={a.isCorrect ? 'success.main' : 'error.main'}>
              {a.isCorrect ? 'Correct' : 'Incorrect'}
            </Typography>
            <Typography>Your answer: {a.userAnswer || '-'}</Typography>
            <Typography>Correct answer: {a.correctAnswer || '-'}</Typography>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button component={Link} to="/" variant="outlined">
          Back Home
        </Button>
        <Button component={Link} to={`/quiz/${id}`} variant="contained">
          Retake
        </Button>
      </Stack>
    </Stack>
  )
}
