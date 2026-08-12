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

describe('<Blog /> tests', () => {
  let incrementLike
  let deleteBlog

  beforeEach(() => {
    incrementLike = vi.fn()
    deleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={incrementLike}
        onDelete={deleteBlog}
      />,
    )
  })

  test('Initally Blog only render the title and name of the author', () => {
    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(
      screen.queryByText('likes:', { exact: false }),
    ).not.toBeInTheDocument()
  })

  test('when view button click the likes and url renders', async () => {
    const user = userEvent.setup()

    const viewBtn = screen.getByRole('button', { name: 'view' })

    await user.click(viewBtn)

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(
      screen.getByText(`likes: ${blog.likes}`, { exact: false }),
    ).toBeVisible()
  })

  test('button clicks and the invoke event handler the right number of time', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'view' }))

    const likeBtn = screen.getByRole('button', { name: 'like' })

    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(incrementLike.mock.calls).toHaveLength(2)

  })
})
