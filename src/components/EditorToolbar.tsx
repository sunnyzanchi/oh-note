import React from 'react'
import cx from 'classnames'

import FileUpload from './FileUpload'
import parseNote from '../utils/parseNote'
import { useDb } from '../utils/db'

type Props = {
  editing: boolean
  onEditing: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const EditorToolbar = ({ editing, onEditing }: Props) => {
  const dbFns = useDb()

  const onUpload = async (files: FileList) => {
    const texts = await Promise.all(
      Array.prototype.map.call(files, (file: File) => file.text())
    )
    const parsed = texts.map(parseNote)
    dbFns.importNotes(parsed)
  }

  return (
    <div className="editor-toolbar toolbar">
      <button
        className={cx('toolbar-button', editing && 'toolbar-button--active')}
        onClick={onEditing}
      >
        Writing Mode
      </button>
      <button className="toolbar-button">Tags</button>
      <button className="toolbar-button">Attachment</button>
      <button className="toolbar-button">Star</button>
      <button className="toolbar-button">Trash</button>
      <FileUpload className="toolbar-button" onUpload={onUpload}>
        Import Notes
      </FileUpload>
    </div>
  )
}

export default EditorToolbar
