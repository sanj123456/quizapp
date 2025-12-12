
import { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material'

export default function QuizForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  showPublish = false,
  disabled = false,
}) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [isPublished, setIsPublished] = useState(!!initialValues?.isPublished)

  useEffect(() => {
    setTitle(initialValues?.title ?? '')
    setDescription(initialValues?.description ?? '')
    setIsPublished(!!initialValues?.isPublished)
  }, [initialValues?.title, initialValues?.description, initialValues?.isPublished])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({ title, description, isPublished })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={disabled}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={2}
          disabled={disabled}
        />
        {showPublish ? (
          <FormControlLabel
            control={
              <Switch
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                disabled={disabled}
              />
            }
            label="Published"
          />
        ) : null}
        <Button type="submit" variant="contained" disabled={disabled}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  )
}
