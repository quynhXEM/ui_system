import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

import { Divider } from '@mui/material'

import classnames from 'classnames'

import CustomIconButton from '@core/components/mui/IconButton'

import '@/libs/styles/tiptapEditor.css'

type TextEditorProps = {
  value: string;
  placeholder: string
  onChange?: (text: string) => void
}

const TextEditor = ({ value, placeholder, onChange }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: value,
    shouldRerenderOnTransaction: false,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (typeof onChange === 'function') {
        onChange(editor.getHTML())
      }
    }
  })

  return (
    <div className='border rounded-md'>
      <EditorToolbar editor={editor} />
      <Divider className='mli-6' />
      <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex' />
    </div>
  )
}

export default TextEditor

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 1 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <i className={classnames('tabler-h-1', { 'text-textSecondary': !editor.isActive('heading', { level: 1 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 2 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <i className={classnames('tabler-h-2', { 'text-textSecondary': !editor.isActive('heading', { level: 2 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 3 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <i className={classnames('tabler-h-3', { 'text-textSecondary': !editor.isActive('heading', { level: 3 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('bulletList') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <i className={classnames('tabler-list', { 'text-textSecondary': !editor.isActive('bulletList') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('orderedList') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <i className={classnames('tabler-list-numbers', { 'text-textSecondary': !editor.isActive('orderedList') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('blockquote') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <i className={classnames('tabler-quote', { 'text-textSecondary': !editor.isActive('blockquote') })} />
      </CustomIconButton>
      <CustomIconButton
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <i className='tabler-arrow-back-up' />
      </CustomIconButton>
      <CustomIconButton
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <i className='tabler-arrow-forward-up' />
      </CustomIconButton>
    </div>
  )
}
