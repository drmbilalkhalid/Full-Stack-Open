import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'
import { test, vi, expect } from 'vitest'

test('<NewFormBlog /> handles typing in its form and invoking createBlog prop correctly', async () => {
  const createNewBlog = vi.fn()
  const user = userEvent.setup()

  render(<NewBlogForm createNewBlog={createNewBlog} />)

  await user.type(screen.getByLabelText('title'), 'this is a test blog')
  await user.type(screen.getByLabelText('author'), 'test')
  await user.type(screen.getByLabelText('url'), 'www.scarytests.com')

  const createBtn = screen.getByRole('button', { name: 'create' })
  await user.click(createBtn)

  expect(createNewBlog).toHaveBeenCalledTimes(1)
  expect(createNewBlog).toHaveBeenCalledWith({
    title: 'this is a test blog',
    author: 'test',
    url: 'www.scarytests.com',
  })
})
