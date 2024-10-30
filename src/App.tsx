import { useState, useEffect } from 'react'
import Note from "./components/Note"
import noteService from './services/notes'
import Notification from './components/Notification.tsx'
import Footer from './components/Footer.tsx'


const App = () => {

  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const toggleImportanceOf = (id: any) => {
    const note: any = notes.find((n: any) => n.id === id)
    const changedNote = { ...note, important: note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }


  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  useEffect(hook, [])


  const addNote = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }


  return (
    <div>
      <h1>Add new Note</h1>
      <form onSubmit={addNote}>
        <input 
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder='Type a new note'
          required
        />
      </form>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notes.map((note: any) => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <Footer />
    </div>
  )
}


export default App
