const Note = (note: any, toggleImportance: any) => {
  const label = note.note.important
    ? 'make not important' : 'make important'

  return (
      <li className="note">
        {note.note.content}&nbsp;
        <button onClick={toggleImportance} className="importance">{label}</button>
      </li>
    )
}

export default Note