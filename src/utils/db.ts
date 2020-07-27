import Dexie from 'dexie'
import { useState, useEffect } from 'react'
import { OrderedMap } from 'immutable'
import { remove } from 'unchanged'

// In order to use `db.notes` or `db.tags` and have correct intellisense,
// we have to make a class that extends Dexie and give TS the info it needs.
// More info is available in Dexie's docs:
// https://dexie.org/docs/Typescript

type Note = {
  id: string
  content: string
  metadata: { [key: string]: any }
  tags: string[]
  title: string
}

// An object with just a note's id and title
// This allows us to only load less data when displaying
// the note list, and load the content of a note only
// when we want to edit it.
type NoteIdentifier = {
  id: Note['id']
  title: Note['title']
}

type Tag = {
  name: string
  notes: Note['id'][]
}

type TagMap = OrderedMap<Tag['name'], Tag['notes']>

class OhDatabase extends Dexie {
  notes: Dexie.Table<Note, Note['id']>
  tags: Dexie.Table<Tag, Tag['name']>

  constructor() {
    super('oh-db')

    // These are only the fields that are indexed
    // A table is allowed to store more columns than shown here
    this.version(1).stores({
      notes: '&id, content, title',
      tags: '&name',
    })

    this.notes = this.table('notes')
    this.tags = this.table('tags')
  }

  async getNoteTitles(noteIds: Note['id'][]): Promise<NoteIdentifier[]> {
    // TODO: Replace `.toArray` with something to only
    // get the required columns.
    // I looked around the documentation for a way to do this and
    // didn't see anything, but it's possible this could be a performance
    // issue for a user with lots of notes.
    const notes = await db.notes.where('id').anyOf(noteIds).toArray()
    return notes.map((note) => ({ id: note.id, title: note.title }))
  }

  async getTagMap(): Promise<TagMap> {
    const tagMap = new Map<Tag['name'], Tag['notes']>()

    await this.tags
      .toCollection()
      .each((tag) => tagMap.set(tag.name, tag.notes))

    return OrderedMap(tagMap)
  }
}

const db = new OhDatabase()

// Convert a TagMap to a list of Tags
const tagMapToList = (tagMap: TagMap): Tag[] =>
  [...tagMap.entries()].map(([name, notes]) => ({ name, notes }))

// This hooks exposes functions that React components can call
// to update the database and the redux state in a predictable way.
// This also makes using the db more strict,
// as you can only call tailor-made functions, not the entire Dexie API.
//
// On the subject of keeping IndexedDB state synced with Redux/React state:
// I initially thought about using Dexie's middleware API
// https://dexie.org/docs/DBCore/DBCore
// though I decided against it --
// Having a hook with dedicated functions allows us to
// dispatch specific actions.
// Using the middleware approach would have involved
// overriding the mutate method and calling dispatch there,
// but it would have been more difficult if not impossible
// to dispatch specific actions.
export const useDb = () => {
  const [noteListState, setNoteListState] = useState<Note[]>([])
  // TODO: When a new tag is selected,
  // make sure the selected note is in that tag.
  // If it's not, show the top note from that new tag.
  const [selectedTag, setSelectedTag] = useState<Tag['name']>(null)
  const [tagMapState, setTagMapState] = useState<TagMap>(OrderedMap())

  // Populate the tag list when the app starts
  useEffect(() => {
    console.log('setting tagMap')
    fns.getTagMap().then(setTagMapState)
  }, [])

  // Load the note list associated with a tag when
  // a new tag is selected
  useEffect(() => {
    if (selectedTag == null) return

    const noteIds = tagMapState.get(selectedTag)
    if (noteIds == null || noteIds?.length === 0) return

    db.notes.bulkGet(noteIds).then(setNoteListState)
  }, [selectedTag])

  const fns = {
    importNotes: async (notes: Note[]) => {
      // 1) tagMap starts empty
      const tagMap = new Map<string, string[]>()
      notes.forEach((note) =>
        note.tags.forEach((tag) => {
          const existing = tagMap.get(tag)

          if (!existing) {
            tagMap.set(tag, [note.id])
          } else {
            tagMap.set(tag, [...existing, note.id])
          }
        })
      )
      // 2) After the .forEach, the tagMap contains
      // tags from the parsed notes
      const parsedTags = [...tagMap.keys()]
      const savedTags = await db.tags.bulkGet(parsedTags)
      savedTags.forEach((tag) => {
        // If a tag does not already exist,
        // Dexie returns db in its place in the array
        if (tag == undefined) return

        const newNoteIds = tagMap.get(tag.name)
        tagMap.set(tag.name, [...tag.notes, ...newNoteIds])
      })
      // 3) After the .bulkGet, the tagMap is a complete
      // union of the tags from the parsed notes and
      // the existing saved tags (parsedTags ∪ savedTags)

      const tags = [...tagMap.entries()].map(([key, value]) => ({
        name: key,
        notes: value,
      }))

      // Tags are bulkPut because we rebuilt the list of notes
      // for any existing tag, so we just want to overwrite the old list
      await Promise.all([
        db.tags.bulkPut(tags),
        db.notes.bulkAdd(
          (notes.map((n) => remove('tags', n)) as unknown) as Note[]
        ),
      ])
    },

    getNoteTitles: (noteIds: Note['id'][]) => db.getNoteTitles(noteIds),
    getTagMap: () => db.getTagMap(),
    noteList: noteListState,
    selectTag: setSelectedTag,
    selectedTag: selectedTag,
    tagList: tagMapToList(tagMapState),
    tagMap: tagMapState,
  }

  return fns
}
