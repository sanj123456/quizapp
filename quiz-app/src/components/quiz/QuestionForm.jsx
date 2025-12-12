
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const QUESTION_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True / False' },
  { value: 'short-answer', label: 'Short Answer' },
]

export default function QuestionForm({ onSubmit, disabled = false }) {
  const [questionType, setQuestionType] = useState('multiple-choice')
  const [question, setQuestion] = useState('')
  const [points, setPoints] = useState(1)

  const [mcqOptions, setMcqOptions] = useState(['', '', '', ''])
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState(0)

  const [tfCorrect, setTfCorrect] = useState('true')
  const [shortCorrect, setShortCorrect] = useState('')

  const payload = useMemo(() => {
    if (questionType === 'multiple-choice') {
      const options = mcqOptions
        .map((text, idx) => ({ text: text.trim(), isCorrect: idx === mcqCorrectIndex }))
        .filter((o) => o.text.length > 0)

      const correctAnswer = options.find((o) => o.isCorrect)?.text || ''

      return {
        questionType,
        question: question.trim(),
        options,
        correctAnswer,
        points: Number(points) || 1,
      }
    }

    if (questionType === 'true-false') {
      return {
        questionType,
        question: question.trim(),
        options: [
          { text: 'true', isCorrect: tfCorrect === 'true' },
          { text: 'false', isCorrect: tfCorrect === 'false' },
        ],
        correctAnswer: tfCorrect,
        points: Number(points) || 1,
      }
    }

    return {
      questionType,
      question: question.trim(),
      options: [],
      correctAnswer: shortCorrect.trim(),
      points: Number(points) || 1,
    }
  }, [questionType, question, points, mcqOptions, mcqCorrectIndex, tfCorrect, shortCorrect])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!payload.question) return
    if (payload.questionType === 'short-answer' && !payload.correctAnswer) return
    if (payload.questionType === 'multiple-choice' && payload.options.length < 2) return

    onSubmit?.(payload)

    setQuestion('')
    setPoints(1)
    setMcqOptions(['', '', '', ''])
    setMcqCorrectIndex(0)
    setTfCorrect('true')
    setShortCorrect('')
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="qtype-label">Question Type</InputLabel>
          <Select
            labelId="qtype-label"
            label="Question Type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            disabled={disabled}
          >
            {QUESTION_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          disabled={disabled}
        />

        <TextField
          label="Points"
          type="number"
          inputProps={{ min: 1 }}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          disabled={disabled}
        />

        {questionType === 'multiple-choice' ? (
          <Stack spacing={2}>
            <Divider />
            <Typography variant="subtitle2">Options (pick correct index)</Typography>
            {mcqOptions.map((opt, idx) => (
              <TextField
                key={idx}
                label={`Option ${idx + 1}${idx === mcqCorrectIndex ? ' (Correct)' : ''}`}
                value={opt}
                onChange={(e) => {
                  const next = [...mcqOptions]
                  next[idx] = e.target.value
                  setMcqOptions(next)
                }}
                disabled={disabled}
                helperText={idx === mcqCorrectIndex ? 'This option will be marked correct.' : ' '}
              />
            ))}
            <FormControl fullWidth>
              <InputLabel id="mcq-correct">Correct Option</InputLabel>
              <Select
                labelId="mcq-correct"
                label="Correct Option"
                value={mcqCorrectIndex}
                onChange={(e) => setMcqCorrectIndex(Number(e.target.value))}
                disabled={disabled}
              >
                {mcqOptions.map((_, idx) => (
                  <MenuItem key={idx} value={idx}>
                    Option {idx + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        ) : null}

        {questionType === 'true-false' ? (
          <Stack spacing={2}>
            <Divider />
            <FormControl fullWidth>
              <InputLabel id="tf-correct">Correct Answer</InputLabel>
              <Select
                labelId="tf-correct"
                label="Correct Answer"
                value={tfCorrect}
                onChange={(e) => setTfCorrect(e.target.value)}
                disabled={disabled}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        ) : null}

        {questionType === 'short-answer' ? (
          <Stack spacing={2}>
            <Divider />
            <TextField
              label="Correct Answer"
              value={shortCorrect}
              onChange={(e) => setShortCorrect(e.target.value)}
              required
              disabled={disabled}
              helperText="Exact match (case-insensitive match is handled in UI results)."
            />
          </Stack>
        ) : null}

        <Button type="submit" variant="contained" disabled={disabled}>
          Add Question
        </Button>
      </Stack>
    </Box>
  )
}
