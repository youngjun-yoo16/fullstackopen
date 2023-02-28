import { useState } from 'react'

const Name = ({ person }) => <li>{person.name} {person.number}</li>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
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
	  if (!result) setPersons(persons.concat(nameObject))
	  
	  setNewName('')
	  setNewNumber('')
  }
  
  const handleNameChange = (event) => {
	  console.log(event.target.value)
	  setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
	  console.log(event.target.value)
	  setNewNumber(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addInfo}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
		<div>
		  number: <input value={newNumber} onChange={handleNumberChange}/>	
		</div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
		  {persons.map(person => 
			<Name key={person.name} person={person} />
		  )}
	  </ul>
    </div>
  )
}

export default App