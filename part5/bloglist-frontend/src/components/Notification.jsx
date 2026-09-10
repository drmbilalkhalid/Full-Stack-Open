import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  const [message, error] = notification

  if (error) {
    return (
      <Alert severity='error'>{message}</Alert>
    )
  }

  return (
    <Alert severity='success'>{message}</Alert>
  )
}

export default Notification