import React, { useState } from 'react'
import Split from 'react-split'
import { add, set } from 'unchanged'
import uuid from 'uuid/dist/esm-browser/v4'
import { OrderedMap } from 'immutable'

import CreateTag from './CreateTag'
import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import NoteListing from './NoteListing'
import TagListing from './TagListing'

import { useDb } from '../utils/db'

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
  const db = useDb()
  const [editing, setEditing] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [sizes, setSizes] = useState([20, 20, 60])
  // Create new tag modal
  const [showModal, setShowModal] = useState(false)

  const addNote = () => {}
  const toggleEditing = () => {}

  const currentNote = db.noteList.find((n) => n.id === selectedNote)

  return (
    <React.Fragment>
      <Split
        className="app-container"
        gutterSize={3}
        sizes={sizes}
        onDrag={setSizes}
      >
        <section className="tag-listing-container">
          <TagListing
            selected={db.selectedTag}
            tags={db.tagList}
            onClick={db.selectTag}
            onCreate={() => setShowModal(true)}
          />
        </section>

        <section className="note-listing-container">
          <NoteListing
            onCreate={addNote}
            onSelect={setSelectedNote}
            notes={db.noteList}
          />
        </section>

        <section className="editor-container">
          <EditorToolbar editing={editing} onEditing={toggleEditing} />
          <Editor
            noteId={selectedNote}
            sizes={sizes}
            text={currentNote?.content || ''}
          />
        </section>
      </Split>

      {showModal && (
        <CreateTag
          onCancel={() => setShowModal(false)}
          onSave={(newTag) => {
            db.createTag(newTag)
            setShowModal(false)
          }}
        />
      )}
    </React.Fragment>
  )
}

export default App
