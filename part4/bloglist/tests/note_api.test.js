const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const jwt = require("jsonwebtoken");
const Blog = require('../models/blog')
const User = require('../models/user')

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

describe('addition of a new blog', () => {
	let token = null
	
	beforeAll(async() => {
	  await Blog.deleteMany({})	
		
      const passwordHash = await bcrypt.hash("abcde", 10);
      const user = await new User({ username: "name", passwordHash }).save();

      const userForToken = { username: "name", id: user.id };
      return (token = jwt.sign(userForToken, process.env.SECRET));
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
		.set("Authorization", `Bearer ${token}`)	
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
		.set("Authorization", `Bearer ${token}`)
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
		.set("Authorization", `Bearer ${token}`)
		.send(newBlog)
		.expect(400)

	  const blogsAtEnd = await helper.blogsInDb()
	  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})
	
	test('fails with the status code 401 if a token is not provided', async () => {
	  token = null
		
	  const newBlog = {
		title: 'Andrew Tate the Top G',
		author: 'Tristan Tate',
		url: 'http://andrewtateismabro.com'
	  }
	
	  await api
		.post('/api/blogs')
		.set("Authorization", `Bearer ${token}`)
		.send(newBlog)
		.expect(401)

	  const blogsAtEnd = await helper.blogsInDb()
	  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})
})

describe('deletion of a blog', () => {
	let token = null
	
	beforeEach(async() => {
	  await Blog.deleteMany({})	
	  await User.deleteMany({})
		
      const passwordHash = await bcrypt.hash("abcde", 10);
      const user = await new User({ username: "name", passwordHash }).save();
	
	  const userForToken = { username: user.username, id: user._id };	
	  token = jwt.sign(userForToken, process.env.SECRET)	
	 
	  const newBlog = {
		title: 'For the HTTP POST request test',
		author: 'John Doe',
		url: 'http://fullstackopen.com'
	  }
	  
	  await api
		.post('/api/blogs')
		.set("Authorization", `Bearer ${token}`)	
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/) 	  
		
      
      return token
	})
	
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
	
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
	  .set("Authorization", `Bearer ${token}`)
      .expect(204)

	const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    const contents = blogsAtEnd.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id and content is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
	blogToUpdate.likes = 69

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
	
	const blogsAtEnd = await helper.blogsInDb()
	
	const blogUpdated = blogsAtEnd[0]
	expect(blogUpdated.likes).toBe(69)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
	
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
	
  test('creation fails with proper statuscode and message if username doesn\'t meet the length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rt',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })	
	
  test('creation fails with proper statuscode and message if password doesn\'t exist or doesn\'t meet the length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'hello',
      name: 'Superuser',
      password: 'as',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
	
	expect(result.body.error).toContain('invalid password')
	
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})	

afterAll(async () => {
  await mongoose.connection.close()
})