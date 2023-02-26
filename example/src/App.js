import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
	/* The placeholder text stored as the initial value of the newNote state appears
  	in the input element. */
    '' 
  )
  const [showAll, setShowAll] = useState(true)
  
  const addNote = (event) => {
    event.preventDefault()
	  
	/* Creating a new object for the note called noteObject that will receive its
	content from the component's newNote state. */
	const noteObject = {
    	content: newNote,
    	important: Math.random() < 0.5,
    	id: notes.length + 1,
  	}
	
	/* The new note is added to the list of notes using the concat array method. 
	This method does not mutate the original notes array, but rather creates a new
	copy of the array with the new item added to the end. */
	setNotes(notes.concat(noteObject))
	
	/* The event handler also resets the value of the controlled input element by
	calling the setNewNote function of the newNote state. */
  	setNewNote('')
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
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
		{notesToShow.map(note => 
		  <Note key={note.id} note={note} />
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