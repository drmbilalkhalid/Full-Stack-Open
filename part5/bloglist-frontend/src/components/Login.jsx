import Notification from './Notification'
import LoginForm from './LoginForm'

const Login = ({ login, notification }) => {

  return (
    <div>
      <Notification notification={notification} />
      {<LoginForm login={login} />}
    </div>
  )
}

export default Login
