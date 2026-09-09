import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginService from './services/login'
import Login from './components/Login'
import Home from './components/Home'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, SetNotification] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blog = await blogService.getAll()
      setBlogs(blog)
    }
    fetchBlogs()
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('bloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const displayNotification = (message, error = false) => {
    SetNotification([message, error])
    setTimeout(() => {
      SetNotification(null)
    }, 5000)
  }

  const login = async (loginObject) => {
    try {
      const user = await LoginService.login(loginObject)
      window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      navigate('/')
    } catch (error) {
      if (error.response?.status === 401) {
        displayNotification('wrong username or password', true)
      } else {
        displayNotification(`Something went wrong, ${error.message}`, true)
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('bloglistAppUser')
    setUser(null)
    navigate('/login')
  }

  const createNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      console.log(newBlog)
      setBlogs(blogs.concat(newBlog))
      displayNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
      )
      navigate('/')
      return true
    } catch (error) {
      if (error.response?.status === 401) {
        displayNotification(
          'you are not allowed to add a new blog, please relogin',
          true,
        )
        window.localStorage.removeItem('bloglistAppUser')
        setUser(null)
      } else {
        const errorMessage = error.response?.data?.error
        displayNotification(
          `failed, ${errorMessage === undefined ? 'something went wrong' : errorMessage}`,
          true,
        )
      }
    }
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        displayNotification(
          `Successfully deleted ${blog.title} by ${blog.author}`,
        )
        navigate('/')
      } catch (error) {
        displayNotification(`failed, ${error.response?.data?.error}`, true)
      }
    }
  }

  const incrementLike = async (blog) => {
    if (user) {
      const updateLikes = { likes: blog.likes + 1 }
      const updatedObject = await blogService.update(blog.id, updateLikes)
      setBlogs(
        blogs.map((b) => (b.id === updatedObject.id ? updatedObject : b)),
      )
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  return (
    <div>
      <div>
        <Link to='/'>blogs</Link> <Link to={'/create'}>new blog</Link>{' '}
        <Link to='/login'>
          {user ? <button onClick={handleLogout}>logout</button> : 'login'}
        </Link>
      </div>

      <Routes>
        <Route
          path='/'
          element={
            <Home
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
              setUser={setUser}
              notification={notification}
              displayNotification={displayNotification}
            />
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <Blog
              onDelete={deleteBlog}
              onLike={incrementLike}
              currentUser={user}
              blog={blog}
            />
          }
        />

        <Route
          path='/create'
          element={<NewBlogForm createNewBlog={createNewBlog} />}
        />

        <Route
          path='/login'
          element={<Login login={login} notification={notification} />}
        />
      </Routes>
    </div>
  )
}

export default App
