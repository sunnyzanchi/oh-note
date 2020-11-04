import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import useScrollLock from '../utils/useScrollLock'

export type NewTag = {
  color?: string
  icon?: string
  name: string
}

type Props = {
  onCancel: () => void
  onSave: ({ color, icon, name }: NewTag) => void
}

const CreateTag = ({ onCancel, onSave }: Props) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState(null)
  useScrollLock()

  return createPortal(
    <div className="create-tag-backdrop">
      <div aria-modal="true" className="create-tag-container">
        <h1>Create New Tag</h1>

        <section className="create-tag-section">
          <label className="create-tag-label">
            <span className="create-tag-name">Name</span>
            <input
              className="create-tag-text-input"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
        </section>

        <section className="create-tag-section">
          <h2>Optional</h2>

          <label className="create-tag-label">
            <span className="create-tag-name">Color</span>
            <input
              className="create-tag-color-input"
              onChange={(e) => setColor(e.target.value)}
              type="color"
              value={color}
            />
          </label>

          <label>
            <span className="create-tag-name">Icon</span>
          </label>
        </section>

        <section className="create-tag-section create-tag-section--buttons">
          <button
            className="create-tag-button create-tag-button--primary"
            onClick={() => onSave({ color, name })}
          >
            Save
          </button>
          <button className="create-tag-button" onClick={onCancel}>
            Cancel
          </button>
        </section>
      </div>
    </div>,
    document.body
  )
}

export default CreateTag
