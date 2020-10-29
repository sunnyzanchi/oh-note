import { IncomingTag, Tag } from '../components/TagListing'

function childMapToArray(m: Map<Tag['name'], Tag>): Array<Tag> {
  if (m.size === 0) return []

  return Array.from(m).map(([k, v]) => {
    const result = {
      ...v,
      // We overwrite `name here specifically,
      // since `v.name` is an array, like ['Places']
      children: childMapToArray(v.children),
      name: k,
    }

    return result
  })
}

const splitName = (tag: Tag) => ({
  ...tag,
  name: tag.name.split('/'),
})

// Take the tags from props and turn them into
// a hierarchical data structure that makes it easier to
// show nested notes
export const makeHierarchical = (tags: IncomingTag[]): Tag[] => {
  const hierarchicalTags = new Map()
  const splitTags = tags.map(splitName)

  for (const tag of splitTags) {
    const splitName = tag.name

    // Move along to each next section of the split name
    // while also moving deeper into the tree
    let i = 0
    let cursor = hierarchicalTags

    while (splitName[i] != null && cursor.has(splitName[i])) {
      cursor = cursor.get(splitName[i]).children
      i += 1
    }

    cursor.set(splitName[i], { ...tag, children: new Map() })
  }

  // Transform all `children` Maps to `children` Arrays
  return childMapToArray(hierarchicalTags)
}
