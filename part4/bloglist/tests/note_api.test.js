const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Day of my life',
	author: 'Youngjun Yoo',
 	url: 'https://www.myblog.com',
	likes: 15
  },
  {
    title: 'Guide to SWE Intern 101',
	author: 'Joma Tech',
 	url: 'https://www.jomatech.com',
	likes: 55
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000) 

test('there are two notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')
  
  const ids = response.body.map(blog => blog.id)
  ids.forEach(id => expect(id).toBeDefined())
})

test('a valid note can be added', async () => {
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

  const response = await api.get('/api/blogs')

  const contents = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain(
    'For the HTTP POST request test'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})