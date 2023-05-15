const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  	.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const body = request.body
  const token = request.token
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
	
  const blog = await new Blog({
    url: body.url,
	title: body.title,
	author: body.author,
	user: user._id,
	likes: body.likes
  })
	
  const savedBlog = await blog.save()
	
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
	  
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const user = request.user
  const body = request.body
  const token = request.token
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  // Finding a blog to be deleted.
  const blog = await Blog.findById(request.params.id)
  
  // Deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator.
  if (blog.user.toString() === user._id.toString()) {
    await Blog.deleteOne({ _id: request.params.id });
	response.status(204).end()
  } else {
    return response.status(401).json({ error: 'invalid user' })  	  
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  
  const blog = {
    title: body.title,
	author: body.author,
	url: body.url,
	likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter