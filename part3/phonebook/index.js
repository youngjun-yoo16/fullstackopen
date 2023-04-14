require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/people')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('req', (req, res) => { 
	if (req.method === "POST") return JSON.stringify(req.body)
	else return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req'))


let persons = [
	{
		"id": 1,
      	"name": "Arto Hellas", 
      	"number": "040-123456"
    },
    { 
      	"id": 2,
      	"name": "Ada Lovelace", 
      	"number": "39-44-5323523"
    },
    { 
      	"id": 3,
      	"name": "Dan Abramov", 
      	"number": "12-43-234345"
    },
    { 
      	"id": 4,
      	"name": "Mary Poppendieck", 
      	"number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
	response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${Date()}`)
})

app.get('/api/persons', (request, response) => {
	console.log("Phonebook:")
	Person.find({}).then(people => {
		response.json(people)
		people.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
	})
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	
	response.status(204).end()
})

/* const generateId = () => {
	min = 5
	max = 10000
	const randomId = Math.random() * (max - min) + min
	return Math.floor(randomId)
} */

app.post('/api/persons', (request, response) => {
	const body = request.body
	
	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})			
	} else if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})		
	} /* else {
		const person = persons.find(person => person.name === body.name)
		if (person) {
			return response.status(400).json({
				error: 'name must be unique'
			})			
		}
	} */
	
	const person = new Person({
		name: body.name,
		number: body.number,
	})
	
	person.save().then(savedPerson => {
		console.log(`Added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
		response.json(savedPerson)
	})
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
