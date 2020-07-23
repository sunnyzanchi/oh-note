import React, { useState } from 'react'
import cx from 'classnames'

export type Note = {
  content: string
  id: string
  title: string
  selected?: boolean
}

type Props = {
  onCreate: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSelect: (noteId: Note['id']) => void
  notes: Note[]
}

const NoteListing = ({ onCreate, onSelect, notes = [] }: Props) => {
  const [search, setSearch] = useState('')

  // TODO: Also do full text search of note content
  const filteredNotes = notes.filter((note) => {
    const name = note.title.toLowerCase()
    const content = note.content.toLowerCase()
    const term = search.toLowerCase()

    return name.includes(term) || content.includes(term)
  })

  return (
    <div>
      <div className="note-listing-toolbar toolbar">
        <input
          className="note-listing-search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          value={search}
        />
        <button className="toolbar-button" onClick={onCreate}>
          Plus
        </button>
      </div>

      <div>Sort</div>

      <ol className="note-listing-list">
        {filteredNotes.map((note) => (
          <li
            className={cx(
              'note-listing-name',
              note.selected && 'note-listing-name--selected'
            )}
            key={note.id}
            onClick={() => onSelect(note.id)}
          >
            {note.title}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default NoteListing
