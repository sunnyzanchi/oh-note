import React, { useState } from 'react'
import Split from 'react-split'
import { add, set } from 'unchanged'
import uuid from 'uuid/dist/esm-browser/v4'
import { OrderedMap } from 'immutable'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import NoteListing from './NoteListing'
import TagListing from './TagListing'

import type { Note } from './NoteListing'

type NoteMap = OrderedMap<string, Note>

const makeSelected = set('selected', true)

const newNote = () => ({
  created: new Date().toISOString(),
  content: '',
  id: uuid(),
  title: 'Untitled',
})

const addSelected = (selectedNote: string, noteMap: NoteMap): NoteMap => {
  if (!noteMap.has(selectedNote)) {
    return noteMap
  }

  return noteMap.update(
    selectedNote,
    (makeSelected as unknown) as (note: Note) => Note
  )
}

const App = () => {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  // TODO: When a new tag is selected,
  // make sure the selected note is in that tag.
  // If it's not, show the top note from that new tag.
  const [selectedTag, setSelectedTag] = useState(null)
  const [sizes, setSizes] = useState([33, 33, 33])

  const addNote = () => {}
  const toggleEditing = () => {}

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
          onSelect={setSelectedNote}
          notes={notes}
        />
      </section>

      <section className="editor-container">
        <EditorToolbar editing={editing} onEditing={toggleEditing} />
        <Editor noteId={selectedNote} sizes={sizes} text={''} />
      </section>
    </Split>
  )
}

export default App
