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
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'dummy', url:'https://dummy.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}