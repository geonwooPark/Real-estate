import React, { useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { ActionWithPayload } from '../reducers/formReducer'

interface EditorProps {
  content: string
  readOnly?: boolean
  placeholder?: string
  dispatch?: (value: ActionWithPayload) => void
}

export default function Editor({
  content,
  readOnly,
  placeholder,
  dispatch,
}: EditorProps) {
  const quillRef = useRef<any>()

  const onChange = (content: string) => {
    if (dispatch) {
      dispatch({ type: 'write-detail', payload: content })
    }
  }

  return (
    <ReactQuill
      ref={quillRef}
      value={content}
      placeholder={placeholder}
      onChange={onChange}
      theme="bubble"
      readOnly={readOnly}
      className="w-full h-full outline-none focus:outline-none"
    />
  )
}
