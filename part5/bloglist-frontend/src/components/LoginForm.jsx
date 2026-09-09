import { useState } from 'react'
import Notification from './Notification'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginForm = (event) => {
    event.preventDefault()
    login({ username, password })
  }

  return (
    <div>
      <h2>Login in to application</h2>
      <form onSubmit={handleLoginForm}>
        <div>
          <label>
            username{' '}
            <input
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password{' '}
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
