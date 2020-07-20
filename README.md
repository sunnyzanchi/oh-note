# Oh Note

A WIP note-taking app, taking inspiration from [Notable](https://github.com/notable/notable).
I used to use Notable to take lots of notes for my D&D campaign, and I wanted to add the ability to add custom icons to labels.
Unfortunately, it's no longer open source.
Also, it's built in an [undocumented framework](https://github.com/svelto/svelto/blob/1f083164459004a8b4f76589316a8655d5809153/README.md) created by the creator of Notable.
So I decided to make my own note-taking app.

## Goals

- Notes are created in Markdown, in the Monaco editor for a great UX
- Notes can be displayed in raw Markdown, or as styled text
- Notes can belong to many tags, which are infinitely nestable
- Notes can have attachments and links to other notes
- Auto-linking notes (ie, note 1 is titled "JavaScript", typing "JavaScript" in note 2 should ask if you want to link to note 1)
- Full-text search of all notes
- Notes can be stored persistently locally in IndexedDB (via Dexie)
- Notes can be synced with a Google Drive folder
- Serviceworker for offline functionality

## Running

Monaco requires workers to be built first before running the app.
Run these commands in order

```
npm i
npm run build:worker
npm start
```

The app will be online at localhost:3000.
