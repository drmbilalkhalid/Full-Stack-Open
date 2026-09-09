const Blog = ({ blog, currentUser, onLike, onDelete }) => {
  if (!blog) {
    return null
  }

  return (
    <div>
      <h2 className='title'>{blog.title}</h2>
      <div className='url'>
        <a href={blog.url} target='_blank'>
          {blog.url}
        </a>
      </div>
      <div className='likes'>
        likes: {blog.likes}{' '}
        {currentUser?.username ? (
          <button onClick={() => onLike(blog)}>like</button>
        ) : null}
      </div>
      <div className='author'>Added By {blog.author}</div>
      <div className='deleteBtn'>
        {currentUser?.username === blog.user?.username ? (
          <button onClick={() => onDelete(blog)}>remove</button>
        ) : null}
      </div>
    </div>
  )
}

export default Blog
