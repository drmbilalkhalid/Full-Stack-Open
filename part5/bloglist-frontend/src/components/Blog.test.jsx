import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  author: 'rylus',
  id: '6a5ca5d367e0b5fd8280c8b4',
  likes: 19,
  title: 'fear mongering around AI',
  url: 'www.greatblogs.com',
  user: {
    id: '6a5ca4bd67e0b5fd8280c8b2',
    name: 'Bilal',
    username: 'bills',
  },
}

const currentUser = {
  name: 'Bilal',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJpbGxzIiwiaWQiOiI2YTVjYTRiZDY3ZTBiNWZkODI4MGM4YjIiLCJpYXQiOjE3ODY1MDQ0MzgsImV4cCI6MTc4NjUwODAzOH0.a--P_SP2CMRVTs0Cj5T-lDm_pdZu92FKcH2D4vTlTZE',
  username: 'bills',
}

const noUser = null

const anotherUser = {
  name: 'anotherUser',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJdbGxzIiwiaWQiOiI2YTVjYTRiZDY3ZTBiNWZkODI4MGM4YjIiLCJpYXQiOjE3ODY1MDQ0MzgsImV4cCI6MTc5NjUwODAzOH0.a--P_SP2CMRVTs0Cj5T-lDm_pdZu92FKcH2D4vTlTZP',
  username: 'anda',
}

describe('<Blog /> tests', () => {
  let incrementLike
  let deleteBlog

  beforeEach(() => {
    incrementLike = vi.fn()
    deleteBlog = vi.fn()
  })

  test('Blog information and number of likes are displayed to unauthenticated users but not buttons', () => {
    render(
      <Blog
        blog={blog}
        currentUser={noUser}
        onLike={incrementLike}
        onDelete={deleteBlog}
      />,
    )

    expect(screen.getByText(`${blog.title}`)).toBeVisible()
    expect(screen.getByText(`likes: ${blog.likes}`)).toBeVisible()
    expect(screen.getByText(`Added By ${blog.author}`)).toBeVisible()
    expect(screen.getByText(`${blog.url}`)).toBeVisible()

    expect(
      screen.queryByRole('button', { name: 'like' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument()
  })

  test('authenticated users who are not the creator see only the like button and can click the like button', async () => {
    render(
      <Blog
        blog={blog}
        currentUser={anotherUser}
        onLike={incrementLike}
        onDelete={deleteBlog}
      />,
    )
    const user = userEvent.setup()

    const likeBtn = screen.getByRole('button', { name: 'like' })
    expect(likeBtn).toBeVisible()

    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(incrementLike.mock.calls).toHaveLength(2)

    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument()
  })

  test('the creator is shown both the like and remove buttons and can click it', async () => {
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={incrementLike}
        onDelete={deleteBlog}
      />,
    )
    const user = userEvent.setup()

    const removeBtn = screen.getByRole('button', { name: 'remove' })
    const likeBtn = screen.getByRole('button', { name: 'like' })
    expect(removeBtn).toBeVisible()
    expect(likeBtn).toBeVisible()

    await user.click(removeBtn)
    expect(deleteBlog.mock.calls).toHaveLength(1)
  })
})
