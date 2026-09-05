const router = require('express').Router()
const User = require('../models/user')
const BlogList = require('../models/bloglist')


router.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await BlogList.deleteMany({})
  response.status(201).end()
})

module.exports = router