import parseMd from 'parse-md'
import uuid from 'uuid/dist/esm-browser/v4'
import type { Note } from '../components/NoteListing'

type NoteId = string
export type TagMap = Map<string, NoteId[]>
export type NoteMap = Map<NoteId, Note>

/**
 * Create the app's internal data structure for tags and notes
 * from an array of strings.
 *
 * The strings should be markdown, with the triple dash style
 * of metadata delimiting and YAML for the data.
 *
 * TODO: Replace parse-md. It's gigantic
 * https://bundlephobia.com/result?p=parse-md@2.0.4
 */
const loadFromStrings = (strings: string[]): [TagMap, NoteMap] => {
  const tagMap = new Map()
  const noteMap = new Map()

  for (const string of strings) {
    const { content, metadata } = parseMd(string)

    const { created, modified, tags, title, ...rest } = metadata
    const note = { created, content, modified, metadata: rest, title }
    const id = metadata.id ?? uuid()

    // Add the note id to each tag it belongs to
    // Each tag holds a list of note ids which belong to them
    for (const tag of tags) {
      if (tagMap.has(tag)) {
        const ids = tagMap.get(tag)
        tagMap.set(tag, ids.concat(id))
      } else {
        tagMap.set(tag, [id])
      }
    }

    // Add the note to the map of notes
    // Notes are stored as key/value being note id/note object
    noteMap.set(id, note)
  }

  return [tagMap, noteMap]
}

export default loadFromStrings
