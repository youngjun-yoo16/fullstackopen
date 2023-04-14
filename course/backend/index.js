/* It's important that dotenv gets imported before the note model is imported. 
This ensures that the environment variables from the .env file are available globally 
before the code from the other modules is imported. */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Note = require('./models/note')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
	})
})

app.delete('api/notes/:id', (request, response) => {
	const id = Number(request.params.id)
	notes = notes.filter(note => note.id !== id)
	
	response.status(204).end()
})

const generateId = () => {
	const maxId = notes.length > 0
		/* notes.map(n => n.id) creates a new array that contains all the ids of the notes. 
		Math.max returns the maximum value of the numbers that are passed to it. However, 
		notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max. 
		The array can be transformed into individual numbers by using the "three dot" spread syntax */
		? Math.max(...notes.map(note => note.id))
		: 0
	return maxId + 1
}
app.post('/api/notes', (request, response) => {
	const body = request.body
	
	if (body.content === undefined) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	
	const note = new Note({
		content: body.content,
		important: body.important || false,
	})
	
	note.save().then(savedNote => {
		response.json(savedNote)
	})
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
