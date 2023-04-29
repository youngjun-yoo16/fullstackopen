const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000) 

test('there are two notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')
  
  const ids = response.body.map(blog => blog.id)
  ids.forEach(id => expect(id).toBeDefined())
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'For the HTTP POST request test',
    author: 'John Doe',
	url: 'http://fullstackopen.com',
	likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/) 
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
  const contents = blogsAtEnd.map(blog => blog.title)	
  expect(contents).toContain(
    'For the HTTP POST request test'
  )
})

test('missing likes property will default to the value 0', async () => {
  const newBlog = {
    title: 'Blog without the likes property',
    author: 'Ada Lovelace',
	url: 'http://dummytest.com'
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
  const contents = blogsAtEnd.map(blog => blog.title)	
  expect(contents).toContain(
    'Blog without the likes property'
  )
})

test('missing title or url properties will respond with the status code 400', async () => {
  const newBlog = {
    author: 'Ada Lovelace',
	likes: 23
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
	
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

	const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})