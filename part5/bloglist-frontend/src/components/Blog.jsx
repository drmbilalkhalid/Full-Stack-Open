import {
  Card,
  CardContent,
  Typography,
  Link as MuiLink,
  Button,
  Stack,
} from '@mui/material'
const Blog = ({ blog, currentUser, onLike, onDelete }) => {
  if (!blog) {
    return null
  }

  return (
    <Card variant='outlined' sx={{ maxWidth: 700, p: 2, marginTop: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant='h4' component='h1' fontWeight='bold'>
          {blog.title}
        </Typography>

        <Typography variant='body1' color='text.secondary'>
          by {blog.author}
        </Typography>

        <MuiLink
          href={blog.url}
          target='_blank'
          rel='noreferrer'
          underline='always'
        >
          {blog.url}
        </MuiLink>

        <Typography variant='body2' color='text.secondary'>
          Added by {blog.author}
        </Typography>

        <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1 }}>
          <Typography variant='body1' fontWeight='medium'>
            {blog.likes} likes
          </Typography>

          {currentUser?.username ? (
            <Button
              variant='outlined'
              size='small'
              onClick={() => onLike(blog)}
            >
              LIKE
            </Button>
          ) : null}
          {currentUser?.username === blog.user?.username ? (
            <Button
              variant='outlined'
              color='error'
              size='small'
              onClick={() => onDelete(blog)}
            >
              REMOVE
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
