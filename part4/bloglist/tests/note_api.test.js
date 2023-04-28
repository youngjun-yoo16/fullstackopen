const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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