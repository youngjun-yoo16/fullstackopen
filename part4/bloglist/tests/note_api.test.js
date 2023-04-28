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

  expect(response.body).toHaveLength(2)
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')
  
  const ids = response.body.map(blog => blog.id)
  ids.forEach(id => expect(id).toBeDefined())
})

afterAll(async () => {
  await mongoose.connection.close()
})