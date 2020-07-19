import React, { useState } from 'react'
import { render } from 'react-dom'
import Split from 'react-split'
import { add, set } from 'unchanged'
import uuid from 'uuid/dist/esm-browser/v4'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import NoteListing from './NoteListing'
import TagListing from './TagListing'

type Note = {
  id: string
  name: string
  selected: boolean
  tags: string[]
  text: string
}

const setSelected = set('selected')

const tags = [
  {
    name: 'Places',
    numNotes: 10,
  },
  {
    name: 'People',
    numNotes: 10,
  },
  {
    name: 'Ideas',
    numNotes: 10,
  },
]

const rawNotes = [
  {
    id: '12345',
    name: 'Aetheal',
    tags: ['Places', 'Places/Alassia'],
    text:
      'Aetheal is big by elven standards, but smaller by human and dwarven standards.\nNearly 10,000 elves live in Aetheal.',
  },
  {
    id: '123556',
    name: 'Enseria',
  },
  {
    id: '6535432',
    name: 'Funky Town',
  },
]

const newNote = () => ({
  id: uuid(),
  name: 'Untitled',
})

const App = () => {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(rawNotes)
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)
  const [sizes, setSizes] = useState([33, 33, 33])

  const addNote = () => {
    setNotes((n) => add(null, newNote(), n) as Note[])
  }

  const toggleEditing = () => setEditing((e) => !e)

  const notesWithSelected = notes.map((note) =>
    setSelected(selectedNoteId === note.id, note)
  ) as Note[]
  // TODO: Don't loop through the notes twice
  const selectedNote = notesWithSelected.find((n) => n.selected)

  return (
    <Split className="app-container" gutterSize={3} onDrag={setSizes}>
      <section className="tag-listing-container">
        <TagListing
          selected={selectedTag}
          tags={tags}
          onClick={setSelectedTag}
        />
      </section>

      <section className="note-listing-container">
        <NoteListing
          onCreate={addNote}
          onSelect={setSelectedNoteId}
          notes={notesWithSelected}
        />
      </section>

      <section className="editor-container">
        <EditorToolbar editing={editing} onEditing={toggleEditing} />
        <Editor sizes={sizes} text={selectedNote?.text} />
      </section>
    </Split>
  )
}

render(<App />, document.querySelector('#app'))
