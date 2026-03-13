import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Code,
  Pilcrow,
  Unlink,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  readOnly?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 300,
  readOnly,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? 'Write your content here...' }),
      CharacterCount,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor: editorInstance }) => onChange(editorInstance.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [editor, value])

  const characterCount = useMemo(() => editor?.storage.characterCount.characters() ?? 0, [editor])
  const canRemoveLink = editor?.isActive('link')

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 rounded-md border bg-background p-2">
        <div className="flex flex-wrap items-center gap-2">
          <Toggle pressed={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-4 w-4" />
          </Toggle>
          <Separator className="h-6" orientation="vertical" />
          <Toggle
            pressed={editor?.isActive('heading', { level: 1 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor?.isActive('heading', { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor?.isActive('heading', { level: 3 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('paragraph')} onClick={() => editor?.chain().focus().setParagraph().run()}>
            <Pilcrow className="h-4 w-4" />
          </Toggle>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Toggle pressed={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive({ textAlign: 'justify' })} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>
            <AlignJustify className="h-4 w-4" />
          </Toggle>
          <Separator className="h-6" orientation="vertical" />
          <Toggle pressed={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Separator className="h-6" orientation="vertical" />
          <Toggle pressed={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </Toggle>
          <Toggle pressed={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
            <Code className="h-4 w-4" />
          </Toggle>
          <Separator className="h-6" orientation="vertical" />
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8">
                <LinkIcon className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <Input
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="https://example.com"
                />
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    if (!linkUrl.trim()) return
                    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
                    setLinkUrl('')
                  }}
                >
                  Confirm Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={!canRemoveLink}
            onClick={() => editor?.chain().focus().unsetLink().run()}
          >
            <Unlink className="mr-2 h-4 w-4" />
            Remove Link
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo2 className="mr-2 h-4 w-4" />
            Redo
          </Button>
          <Separator className="h-6" orientation="vertical" />
          <span className="text-xs text-muted-foreground">{characterCount} characters</span>
        </div>
      </div>

      <div
        className={cn(
          'rounded-md border bg-background p-3 overflow-y-auto focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          'prose prose-sm max-w-none'
        )}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
