import React from 'react'
import cx from 'classnames'
import { get } from 'unchanged'

type Tag = {
  icon?: string
  name: string
  numNotes?: number
}

type Props = {
  selected: string
  tags: Tag[]
  onClick: (tagName: string) => void
}

const sum = (acc: number, item: number) => acc + item

const allTags = (tags: Props['tags']): Tag => ({
  name: 'All Tags',
  numNotes: tags
    .map((get('numNotes') as unknown) as (t: Tag) => number)
    .reduce(sum, 0) as number,
})

const TagListing = ({ selected, tags, onClick }: Props) => {
  tags = [allTags(tags), ...tags]

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
