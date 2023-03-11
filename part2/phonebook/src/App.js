import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('') 
  const [filtered, setFiltered] = useState(persons)
  
  const hook = () => {
	  axios
		.get("https://json-sever-dev.run.goorm.site/persons")
	    .then(response => {
		  setPersons(response.data)
	  })
  }
  /* The useEffect is always run after the component has been rendered. 
  In our case, however, we only want to execute the effect along with the first render.
  The second parameter of useEffect is used to specify how often the effect is run. 
  If the second parameter is an empty array [], then the effect is only run along with the first render of the component. */
  useEffect(hook, [])
	
  const checkDuplicateName = () => {
	   let find = false
	   
	   /* The find() method returns the first element in the provided array 
	   that satisfies the provided testing function. If no values satisfy the 
	   testing function, undefined is returned. 
	   
	   JS String Comparision using localCompare: https://www.freecodecamp.org/news/javascript-string-comparison-how-to-compare-strings-in-js/ */
	   const result = persons.find(({ name }) => name.localeCompare(newName) === 0)
	   
	   /* result not equal to undefined means that there is a name that already
	   exists in the phonebook. */
	   if (result !== undefined) {
		   find = true
		   window.alert(`${newName} is already added to phonebook`)
	   }
	  
	   return find
  }
  
  const addInfo = (event) => {
	  event.preventDefault()
	  const nameObject = {
		  name: newName,
		  number: newNumber
	  }
	  const result = checkDuplicateName()
	  
	  /* Add name to the existing phonebook only when the checkDuplicateName function
	  returns false */
	  if (!result) {
		axios
		  .post('https://json-sever-dev.run.goorm.site/persons', nameObject)
		  .then(response => {
			setPersons(persons.concat(response.data))
			setNewName('')
	  	    setNewNumber('')
		})
	  }
  }
  
  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setNewFilter(event.target.value)
  
  /* By using this Hook, you tell React that your component needs to do something after render. 
  React will remember the function you passed (we’ll refer to it as our “effect”), 
  and call it later after performing the DOM updates.
  useEffect runs both after the first render and after every update. */
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
	  <Filter text="filter shown with" setFilter={newFilter} onFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
	  <PersonForm addInfoToPhonebook={addInfo} nameField="name" setName={newName} onNameChange={handleNameChange} 
		  numberField="number" setNumber={newNumber} onNumberChange={handleNumberChange} buttonType="submit" 
		  buttonText="add"
	  />
      <h3>Numbers</h3>
	  <Persons filtered={filtered} />	
    </div>
  )
}

export default App