import React from 'react'
import cx from 'classnames'

type Props = {
  editing: boolean
  onEditing: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const EditorToolbar = ({ editing, onEditing }: Props) => {
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
    </div>
  )
}

export default EditorToolbar
