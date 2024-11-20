import React, { useEffect, useRef, useState } from 'react'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import { useDictionary } from '@/contexts/dictionaryContext'

interface Props {
  initialValue: string
  onChange: (data: string) => void
}

const ContentEditor: React.FC<Props> = ({ initialValue, onChange }) => {
  const quillRef = useRef<any>(null)
  const [content, setContent] = React.useState(initialValue)
  const { dictionary } = useDictionary()

  const handleEditorChange = (e: any) => {
    setContent(e)
    onChange(e)
  }

  const modules = {
    toolbar: false
  }

  React.useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData
    const items = clipboardData.items
    
    console.log(items);
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        const reader = new FileReader()

        reader.onload = (loadEvent: any) => {
          const imgUrl = loadEvent?.target.result as string

          if (quillRef.current) {
            const quill = quillRef.current.getEditor()
            const range = quill.getSelection()

            if (range) {
              quill.insertEmbed(range.index, 'image', imgUrl)
            }
          }
        }

        reader.readAsDataURL(file) // Đọc hình ảnh thành URL
      }
    }
  }

  return (
    <div className='mx-2'>
      <ReactQuill
        style={{ width: '100%', border: 'none', backgroundColor: 'lightgray', borderRadius: 10, overflow: 'hidden', color: 'black' }}
        theme='snow'
        modules={modules}
        ref={quillRef}
        value={content}
        onChange={(e: any) => handleEditorChange(e)}
        onPaste={handleImagePaste}
      />
    </div>
  )
}

export default ContentEditor
