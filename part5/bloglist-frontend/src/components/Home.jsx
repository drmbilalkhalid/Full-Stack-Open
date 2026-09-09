import Notification from './Notification'
import { Link } from 'react-router-dom'

const Home = ({ blogs, notification }) => {
  //   const newBlogFormRef = useRef()
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />

      {/* <Toggleable buttonLabel='create new blog' ref={newBlogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Toggleable> */}

      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
