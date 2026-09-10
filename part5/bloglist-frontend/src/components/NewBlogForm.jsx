import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const success = await createNewBlog({
      title,
      author: author === '' ? 'unknown' : author,
      url,
    })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  const marginB = {
    marginBottom: 1
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNewBlog}>
        <div>
          <TextField
            variant='outlined'
            label='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            size='small'
            sx={marginB}
          />
        </div>
        <div>
          <TextField
            variant='outlined'
            label='author'
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            size='small'
            sx={marginB}
          />
        </div>
        <div>
          <TextField
            variant='outlined'
            label='url'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            size='small'
            sx={marginB}
          />
        </div>
        <Button variant='contained' type='submit'>create</Button>
      </form>
    </div>
  )
}

export default NewBlogForm
