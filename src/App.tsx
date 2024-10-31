import { useState, useEffect } from 'react'
import Note from "./components/Note"
import noteService from './services/notes'
import Notification from './components/Notification.tsx'
import Footer from './components/Footer.tsx'


const App = () => {

  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const toggleImportanceOf = (id: any) => {
    const note: any = notes.find((n: any) => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
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
      important: true
    }
    const contents = notes.map(n => n.content)
    if (contents.includes(noteObject.content)) {
      setErrorMessage("That note already exists")
    } else {
      noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
    }
  }


  const removeNote = (id: any) => {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(n => n.id !== id))
        })
  }


  const updateNote = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    const note: any = notes.find((n: any) => n.id === editingId)
    const updatedNote = {...note, content: newContent}
    noteService
      .update(editingId, updatedNote)
      .then((returnedNote) => {
        setNotes(notes.map(note => note.id === editingId ? returnedNote : note))
        closeForm()
      })
  }

  function openForm(id: any): void {
    setEditingId(id)
    const formElement = document.getElementById("updateForm") as HTMLElement;
    if (formElement) {
      formElement.style.display = "block";
    }
  }
  
  function closeForm(): void {
    setEditingId(null)
    setNewContent('')
    const formElement = document.getElementById("myForm") as HTMLElement;
    if (formElement) {
      formElement.style.display = "none";
    }
  }


  return (
    <div>

      <h1>Add new Note</h1>
        <form onSubmit={addNote} id="form1">
          <input 
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder='Type a new note...'
            required
          />
        </form>
        <button form="form1" type="submit" value="add note">Add note</button>

      <h1>Notes</h1>
        <Notification message={errorMessage} />
        <ul>
          {notes.map((note: any) => 
            <li>
              <Note 
              key={note.id} 
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
              />
              <button onClick={() => openForm(note.id)} className="update">Update note</button>
              <button onClick={() => removeNote(note.id)} className='remove'>Delete note</button>

              {editingId === note.id && (
                <form onSubmit={updateNote} id="updateForm" style={{display: 'block'}}>
                  <input 
                    type="text" 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Update note" 
                    required 
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={closeForm}>Cancel</button>
                </form>
                )}

            </li>
          )}
        </ul>

      <Footer />
    </div>
  )
}


export default App
