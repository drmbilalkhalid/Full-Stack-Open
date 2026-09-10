import { useState } from 'react'
import Notification from './Notification'
import { Input, TextField, Button } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginForm = (event) => {
    event.preventDefault()
    console.log(username, password)
    login({ username, password })
  }
  
  return (
    <div>
      <h2>Login in to application</h2>
      <form onSubmit={handleLoginForm}>
        <div>
          <TextField
            variant='standard'
            label='username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <TextField
            variant='standard'
            label='password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button style={{ marginTop: 10 }} variant='contained' type='submit'>login</Button>
      </form>
    </div>
  )
}

export default LoginForm
