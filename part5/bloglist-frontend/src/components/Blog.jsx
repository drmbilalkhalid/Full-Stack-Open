import { useState } from 'react'

const Blog = ({ blog, currentUser, onLike, onDelete }) => {
  const [detailView, setDetailView] = useState(false)

  const viewToggle = () => {
    setDetailView(!detailView)
  }

  const buttonLabel = () => (detailView ? 'hide' : 'view')

  const showToDelete = () => {
    if (blog.user?.username === undefined) {
      return { display: '' }
    }
    if (currentUser?.username !== blog.user?.username) {
      return { display: 'none' }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (detailView) {
    return (
      <div style={blogStyle}>
        <div className='title'>
          {blog.title}{' '}
          <button className='detailToggleBtn' onClick={viewToggle}>
            {buttonLabel()}
          </button>
        </div>
        <div className='url'>
          <a href={blog.url} target='_blank'>
            {blog.url}
          </a>
        </div>
        <div className='likes'>
          likes: {blog.likes} <button onClick={() => onLike(blog)}>like</button>
        </div>
        <div className='author'>{blog.author}</div>
        <div className='deleteBtn'>
          <button style={showToDelete()} onClick={() => onDelete(blog)}>
            delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle} className='headline'>
      {blog.title} {blog.author}{' '}
      <button className='detailToggleBtn' onClick={viewToggle}>
        {buttonLabel()}
      </button>
    </div>
  )
}

export default Blog
