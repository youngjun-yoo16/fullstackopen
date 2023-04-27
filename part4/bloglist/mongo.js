const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@fullstackopen.toxqsyf.mongodb.net/testBlogList?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Guide to SWE Intern 101',
  author: 'Joma Tech',
  url: 'https://www.jomatech.com',
  likes: 55
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})