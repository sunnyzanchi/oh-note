import parseMd from 'parse-md'
import uuid from 'uuid/dist/esm-browser/v4'

type Note = {
  // The text content of the note
  content: string
  // UUID
  id: string
  // Hashmap of any metadata not explicitly used
  metadata: { [key: string]: any }
  // List of tag names the note belongs to
  tags: string[]
  // Title of the note
  title: string
}

/**
 * Previously, this took a list of strings and
 * returned two maps, one for tags and one for notes.
 *
 * After thinking about the app's data storage approach
 * and interaction with Dexie/IndexedDB, this function should
 * only be used as a bridge between importing files and
 * getting them into IndexedDB.
 * As a result, it no longer returns two separate data structures,
 * it solely parses and constructs a note in a way that
 * Dexie can insert it and its tags into IndexedDB.
 *
 * TODO: Replace parse-md. It's gigantic
 * https://bundlephobia.com/result?p=parse-md@2.0.4
 */
const parseNote = (fullText: string): Note => {
  const { content, metadata } = parseMd(fullText)
  const { tags, title, ...rest } = metadata
  // May want to validate the id is a valid uuid
  const id = metadata.id ?? uuid()

  const note = { content, id, metadata: rest, tags, title }

  return note
}

export default parseNote
