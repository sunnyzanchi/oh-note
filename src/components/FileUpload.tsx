import React, { useRef } from 'react'

type Props = {
  className?: string
  children?: React.ReactNode
  onUpload: (files: FileList) => void
}

const FileUpload = ({ className, children, onUpload }: Props) => {
  const input = useRef<HTMLInputElement>()

  const open = () => {
    if (input.current == null) return

    input.current.click()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onUpload(e.target.files)

  return (
    <div>
      <input
        multiple
        onChange={onChange}
        ref={input}
        style={{ display: 'none' }}
        type="file"
      />
      <button className={className} onClick={open}>
        {children}
      </button>
    </div>
  )
}

export default FileUpload
