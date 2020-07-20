import React, { useState } from 'react'
import { render } from 'react-dom'
import Split from 'react-split'
import { add, set } from 'unchanged'
import uuid from 'uuid/dist/esm-browser/v4'
import { OrderedMap } from 'immutable'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import NoteListing from './NoteListing'
import TagListing from './TagListing'

import loadFromStrings from './loadFromStrings'

import type { Note } from './NoteListing'

const makeSelected = set('selected', true)

const rawNotes = [
  `---
tags: [Places, Places/Test Place 1]
title: Test 1
created: '2019-10-06T15:51:04.905Z'
modified: '2020-07-18T20:17:36.164Z'
---
  
  # Test 1
  
  Test number 1.`,
  `---
tags: [Places, Places/Test Place 2]
title: Test 2
created: '2019-07-27T12:49:00.748Z'
modified: '2020-07-18T06:39:24.766Z'
---
  
  # Test 2
  
  Test number 2.`,
  `---
tags: [Places, Places/Test Place 3]
title: Test 3
created: '2019-09-03T14:30:13.040Z'
modified: '2020-07-12T22:12:32.277Z'
---
  
  # Test 3
  
  Test number 3.`,
]

const [tagMapRaw, noteMapRaw] = loadFromStrings(rawNotes)
const tagMap = OrderedMap(tagMapRaw)
const noteMap = OrderedMap(noteMapRaw)

const newNote = () => ({
  created: new Date().toISOString(),
  content: '',
  id: uuid(),
  title: 'Untitled',
})

const App = () => {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(noteMap)
  const [selectedNote, setSelectedNote] = useState(null)
  // TODO: When a new tag is selected,
  // make sure the selected note is in that tag.
  // If it's not, show the top note from that new tag.
  const [selectedTag, setSelectedTag] = useState(null)
  const [sizes, setSizes] = useState([33, 33, 33])
  console.log(selectedTag, tagMap.get(selectedTag))

  const tags = [...tagMap.entries()].map(([tag, ids]) => ({
    name: tag,
    numNotes: ids.length,
  }))

  const addNote = () => {
    const note = newNote()
    setNotes((n) => n.set(note.id, note))
  }

  const toggleEditing = () => setEditing((e) => !e)

  // TODO: Make this transformation chain nicer
  const filteredNotes = selectedTag
    ? notes.filter((note, noteId) => {
        const notesInTag = tagMap.get(selectedTag)
        return notesInTag.includes(noteId)
      })
    : notes

  const notesWithSelected = filteredNotes.has(selectedNote)
    ? filteredNotes.update(
        selectedNote,
        (makeSelected as unknown) as (note: Note) => Note
      )
    : filteredNotes

  const noteList = [...notesWithSelected.entries()].map(([id, note]) =>
    set('id', id, note)
  ) as Note[]

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
          notes={noteList}
        />
      </section>

      <section className="editor-container">
        <EditorToolbar editing={editing} onEditing={toggleEditing} />
        <Editor
          noteId={selectedNote}
          sizes={sizes}
          text={notes.get(selectedNote)?.content}
        />
      </section>
    </Split>
  )
}

render(<App />, document.querySelector('#app'))
