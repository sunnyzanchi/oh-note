import React from 'react'
import cx from 'classnames'
import { get } from 'unchanged'

import { makeHierarchical } from '../utils/makeHierarchical'

export type IncomingTag = {
  icon?: string
  // Name is slash separated, ie
  // Places/New York/Manhattan
  name: string
  numNotes?: number
}

export type Tag = {
  children: Tag[]
  icon?: string
  // Name is not slash separated,
  // any child tags are in the `children` array
  name: string
  numNotes?: number
}

type Props = {
  selected: string
  tags: IncomingTag[]
  onClick: (tagName: string) => void
  onCreate: () => void
}

const FULL_WIDTH_PLUS = '\uff0b'
// Left padding for top level list items
const MIN_PADDING = 12

const sum = (acc: number, item: number) => acc + item

const allTags = (tags: Props['tags']): IncomingTag => ({
  name: 'All Tags',
  numNotes: tags
    .map((get('numNotes') as unknown) as (t: IncomingTag) => number)
    .reduce(sum, 0) as number,
})

const TagLine = ({
  indent = 0,
  prefix = [],
  onClick,
  selected,
  tag,
}: Props) => (
  <React.Fragment>
    <li
      className={cx(
        'tag-listing-item',
        selected === [...prefix, tag.name].join('/') &&
          'tag-listing-item--selected'
      )}
      key={tag.name}
      onClick={() => onClick([...prefix, tag.name].join('/'))}
      style={{ paddingLeft: `${indent * 20 + MIN_PADDING}px` }}
    >
      <p className="tag-listing-name">{tag.name}</p>
      <p className="tag-listing-number">{tag?.numNotes}</p>
    </li>
    {tag.children.map((t) => (
      <TagLine
        key={t.name}
        indent={indent + 1}
        prefix={[...prefix, tag.name]}
        onClick={onClick}
        selected={selected}
        tag={t}
      />
    ))}
  </React.Fragment>
)

const TagListing = ({ selected, tags, onClick, onCreate }: Props) => {
  // Recursively turn the list of tags from a list like:
  // [
  //   'Places/New York',
  //   'Food/Fruit'
  // ]
  //
  // into a tree:
  // [
  //   { name: 'Places', children: [{ name: 'New York' }] } ,
  //   { name: 'Food', children: [{ name: 'Fruit' }] }
  // ]
  const hierarchied = makeHierarchical([allTags(tags), ...tags])

  return (
    <div>
      <ol className="tag-listing-list">
        {hierarchied.map((tag) => (
          <TagLine
            key={tag.name}
            onClick={onClick}
            selected={selected}
            tag={tag}
          />
        ))}
      </ol>
      <button className="tag-listing-new-tag-button" onClick={onCreate}>
        New Tag {FULL_WIDTH_PLUS}
      </button>
    </div>
  )
}

export default TagListing
