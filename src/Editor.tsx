import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

type Props = {
  // `sizes` is only used to trigger the monaco
  // editor's layout function
  sizes: number[]
  text: string
}

// @ts-ignore
self.MonacoEnvironment = {
  // @ts-ignore
  getWorkerUrl: function (moduleId, label) {
    console.log(label)
    if (label === 'json') {
      return './json.worker.js'
    }
    if (label === 'css') {
      return './css.worker.js'
    }
    if (label === 'html') {
      return './html.worker.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js'
    }
    return './editor.worker.js'
  },
}

const Editor = ({ text = '' }: Props) => {
  const container = useRef()
  const editor = useRef(null)

  useEffect(() => {
    if (editor.current) return

    editor.current =
      container.current &&
      monaco.editor.create(container.current, {
        language: 'markdown',
        value: text,
        theme: 'hc-black',
      })
  })

  useEffect(() => {
    if (!editor.current) return

    editor.current.layout()
    const lastValue = editor.current.getValue()
    console.log(lastValue)
    editor.current.setValue(text)
  })

  return <div className="editor" ref={container} />
}

export default Editor
