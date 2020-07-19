import React from 'react'
import cx from 'classnames'

type Tag = {
  children?: Tag[]
  icon?: string
  name: string
  numNotes?: number
}

type Props = {
  selected: string
  tags: Tag[]
  onClick: (tagName: string) => void
}

const TagListing = ({ selected, tags, onClick }: Props) => {
  return (
    <div>
      <ol className="tag-listing-list">
        {tags.map((tag) => (
          <li
            className={cx(
              'tag-listing-item',
              selected === tag.name && 'tag-listing-item--selected'
            )}
            key={tag.name}
            onClick={() => onClick(tag.name)}
          >
            <p className="tag-listing-name">{tag.name}</p>
            <p className="tag-listing-number">{tag?.numNotes}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default TagListing
