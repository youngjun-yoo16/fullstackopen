/* It's important that dotenv gets imported before the note model is imported. 
This ensures that the environment variables from the .env file are available globally 
before the code from the other modules is imported. */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Note = require('./models/note')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

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

app.put('/api/notes/:id', (request, response, next) => {
	const body = request.body
	
	const note = {
		content: body.content,
		important: body.important,
	}
	
	Note.findByIdAndUpdate(request.params.id, note, { new: true })
	/* By default, the updatedNote parameter of the event handler 
	receives the original document without the modifications.  
	We added the optional { new: true } parameter, which will cause our 
	event handler to be called with the new modified document instead of the original.*/
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))
})

app.delete('api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint "})	
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

/* app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
}) */

const PORT = process.env.PORT 
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
