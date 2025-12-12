
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../../services/api.js'

export default function QuizList({ quizzes = [], onRefresh }) {
  const handleDelete = async (id) => {
    // minimal guard
    const ok = window.confirm('Delete this quiz?')
    if (!ok) return
    await api.delete(`/quizzes/${id}`)
    onRefresh?.()
  }

  if (!quizzes.length) {
    return <Typography color="text.secondary">No quizzes found.</Typography>
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Questions</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quizzes.map((q) => (
            <TableRow key={q._id}>
              <TableCell>{q.title}</TableCell>
              <TableCell>{q.description || '-'}</TableCell>
              <TableCell>{q.isPublished ? 'Yes' : 'No'}</TableCell>
              <TableCell>{q.questions?.length ?? '-'}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button component={Link} to={`/admin/quizzes/${q._id}/edit`} size="small" variant="outlined">
                    Edit
                  </Button>
                  <Button component={Link} to={`/quiz/${q._id}`} size="small" variant="text">
                    Public
                  </Button>
                  <IconButton onClick={() => handleDelete(q._id)} size="small" aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
