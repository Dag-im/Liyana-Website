import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export type ContentArrayEditorProps = {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
}

export default function ContentArrayEditor({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write paragraph...',
}: ContentArrayEditorProps) {
  const canRemove = value.length > 1

  const updateItem = (index: number, nextValue: string) => {
    const next = [...value]
    next[index] = nextValue
    onChange(next)
  }

  const removeItem = (index: number) => {
    if (!canRemove) return
    const next = value.filter((_, i) => i !== index)
    onChange(next.length ? next : [''])
  }

  const addItem = () => {
    onChange([...value, ''])
  }

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {label ? <p className="text-sm font-medium">{label}</p> : null}
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="rounded-md border p-3 space-y-2">
            <Textarea
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => moveItem(index, index - 1)}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => moveItem(index, index + 1)}
                disabled={index === value.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => removeItem(index)}
                disabled={!canRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-2 h-4 w-4" />
        Add Paragraph
      </Button>
    </div>
  )
}
