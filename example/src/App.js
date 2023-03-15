import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

const Notification = ({ message }) => {
  if (message === null) {
	  return null
  }

  return (
	  <div className='error'>
		  {message}
	  </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')	
  useEffect(() => {
	noteService
	  .getAll()
	  .then(initialNotes => {
		setNotes(initialNotes)
	  })
  }, [])
  
  const toggleImportnaceOf = id => {
	// Finding the note we want to modify, and we then assign it to the note variable.
	const note = notes.find(n => n.id === id)
	/* Creating a new object that is an exact copy of the old note, apart from the 
	important property that has the value flipped. */
	const changedNote = { ...note, important: !note.important }
	/* The map method creates a new array by mapping every item from the old array
	into an item in the new array. For each note object, if note.id !== id is true
	then we simply copy the item from the old array into the new array. If the
	condition is false, then the note object returned by the server is added to then
	array instead. */
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
	  .catch(error => {
		setErrorMessage(
		`Note '${note.content}' was already removed from the server`
		)
		setTimeout(() => {
			setErrorMessage(null)
		}, 5000)
		
		/* The filter method returns a new array comprising only the items from the list 
		for which the function that was passed as a parameter returns true. */
		setNotes(notes.filter(note => note.id !== id))
	})
  }
  	
  const addNote = (event) => {
    event.preventDefault()
	const noteObject = {
    	content: newNote,
    	important: Math.random() < 0.5
  	}
	
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  
  /* The event handler is called "every time a change occurs" in the input element. 
  The event handler function receives the event object as its event parameter.
  
  The target property of the event object now corresponds to the controlled 
  input element, and event.target.value refers to the input value of that element.
  
  Now the App component's newNote state reflects the current value of the input. */
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  
  /* If the value of showAll is false, the notesToShow variable will be assigned
  to a list that only contains notes that have the important property set to true. */
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
	
  return (
    <div>
      <h1>Notes</h1>
	  <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
		{notesToShow.map(note => 
		  <Note 
			key={note.id} 
			note={note} 
			toggleImportance={()=>toggleImportnaceOf(note.id)}
		  />
		)}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>  	
    </div>
  )
}

export default App