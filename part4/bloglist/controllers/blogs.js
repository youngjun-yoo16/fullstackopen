const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  if (blog.likes === undefined) {
    blog.likes = 0
  }
	
  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).end()
  } else {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter