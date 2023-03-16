import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'

const Notification = ({ message }) => {
  let className = 'error'
  if (message === null) {
	  return null
  } 
	
  if (message.includes('Added') || message.includes("Changed")) className = 'success'

  return (
	  <div className={className}>
		  {message}
	  </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('') 
  const [filtered, setFiltered] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  
  /* The useEffect is always run after the component has been rendered. 
  In our case, however, we only want to execute the effect along with the first render.
  The second parameter of useEffect is used to specify how often the effect is run. 
  If the second parameter is an empty array [], then the effect is only run along with the 
  first render of the component. */
  useEffect(() => {
	personService
	  .getAll()
	  .then(initialEntries => {
		setPersons(initialEntries)
	})
  }, []) 
  
  const toggleDelete = id => {
	const personToDelete = persons.find(person => person.id === id)
	if (window.confirm(`Delete ${personToDelete.name}?`)) {
		personService
		  .remove(id)
		  .then(setPersons(persons.filter(person => person.id !== id)))
		  .catch(error => {
			alert(
			`The person '${personToDelete.name}' was already deleted from the server.`
			)
		 })		
	}
  }
  
  const checkDuplicateName = () => {
	   let find = false
	   
	   /* The find() method returns the first element in the provided array 
	   that satisfies the provided testing function. If no values satisfy the 
	   testing function, undefined is returned. 
	   
	   JS String Comparision using localCompare: https://www.freecodecamp.org/news/javascript-string-comparison-how-to-compare-strings-in-js/ */
	   const result = persons.find(({ name }) => name.localeCompare(newName) === 0)
	   
	   /* result not equal to undefined means that there is a name that already
	   exists in the phonebook. */
	   if (result !== undefined) find = true
	
	   return [find, result]
  }
  
  const addInfo = (event) => {
	  event.preventDefault()
	  const nameObject = {
		  name: newName,
		  number: newNumber
	  }
	  const [found, personToUpdate] = checkDuplicateName()
	
	  /* Add new name to the existing phonebook only when the checkDuplicateName function
	  returns false */
	  if (!found) {
		personService
		   .create(nameObject)
		   .then(initialEntries => {
				setPersons(persons.concat(initialEntries))
		   		setErrorMessage(
					`Added ${nameObject.name}`
				)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
		   })
	  } else {
		  /* If a number is added to an already existing user, the new number will replace the old number.*/
		  if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
			  const changedInfo = { ...personToUpdate, number: newNumber}
			  personService
			  /* We can put either nameObject or changedInfo as a parameter. nameObject contains name and number without
			  an id but since we are updating the info in the specified id, json-server automatically takes care of that for us.
			  However, using changedInfo is safer because it just creates a copy of the person object that needs to be updated
			  that alreday includes the id field as key and id as value. tldr; nameObject for adding entirely new name to the
			  phonebook while changedInfo for updating the number to an already existing user. */ 
			     .update(personToUpdate.id, changedInfo)
			     .then(initialEntries => {
					setPersons(persons.map(person => person.id !== personToUpdate.id ? person : initialEntries)) 
				  	setErrorMessage(
						`Changed ${changedInfo.name}'s number to ${changedInfo.number}`
					)
					setTimeout(() => {
						setErrorMessage(null)
					}, 5000)
			  	 })
			   	 .catch(error => {
				  setErrorMessage(
					  `Information of ${changedInfo.name} has already been removed from server`
				  )
				  setTimeout(() => {
					  setErrorMessage(null)
				  },5000)
			  })
		  }
	  }
	  setNewName('')
      setNewNumber('')
  }
  
  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setNewFilter(event.target.value)
  
  useEffect(() => {
	if (newFilter.length > 0) {
		
		/* The filter() method creates a shallow copy of a portion of a given array, 
		filtered down to just the elements from the given array that pass the test 
		implemented by the provided function. 
		
		The match() method retrieves the result of matching a string against a regular expression. */
		const filteredInfo = persons.filter(({ name }) => name.toLowerCase().match(newFilter.toLowerCase().trim()))
		setFiltered(filteredInfo) 
	} else {
		setFiltered(persons) 
	}
  }, [newFilter, persons])

  return (
    <div>
      <h2>Phonebook</h2>
	  <Notification message={errorMessage} />
	  <Filter text="filter shown with" setFilter={newFilter} onFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
	  <PersonForm addInfoToPhonebook={addInfo} nameField="name" setName={newName} onNameChange={handleNameChange} 
		  numberField="number" setNumber={newNumber} onNumberChange={handleNumberChange} buttonType="submit" 
		  buttonText="add"
	  />
      <h3>Numbers</h3>
	  <Persons filtered={filtered} toggleDelete={toggleDelete} />	
    </div>
  )
}

export default App