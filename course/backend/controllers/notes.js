const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
	
  const user = await User.findById(decodedToken.id)
  // Information about the user who created a note is sent in the userId field of the request body.
  const user = await User.findById(body.userId)
  
  // Note scheme is updated so that the note is assigned to the user who created it.
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
  })
  
  const savedNote = await note.save()
  // The id of the note is stored in the notes field of the user object.
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
	
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end() 
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  /* By default, the updatedNote parameter of the event handler
  receives the original document without the modifications.
  We added the optional { new: true } parameter, which will cause our
  event handler to be called with the new modified document instead of the original. */
  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter