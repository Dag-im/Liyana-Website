import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateFaq, useFaqCategories } from './useFaqs'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialFormState = {
  question: '',
  answer: '',
  categoryId: '',
  position: '',
}

export default function CreateFaqDialog({ open, onOpenChange }: Props) {
  const { data: categories = [] } = useFaqCategories()
  const createMutation = useCreateFaq()

  const [question, setQuestion] = useState(initialFormState.question)
  const [answer, setAnswer] = useState(initialFormState.answer)
  const [categoryId, setCategoryId] = useState(initialFormState.categoryId)
  const [position, setPosition] = useState(initialFormState.position)

  const resetForm = () => {
    setQuestion(initialFormState.question)
    setAnswer(initialFormState.answer)
    setCategoryId(initialFormState.categoryId)
    setPosition(initialFormState.position)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createMutation.mutate(
      {
        question,
        answer,
        categoryId,
        position: position ? Number(position) : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          resetForm()
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create FAQ</DialogTitle>
          <DialogDescription>Add a new frequently asked question.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="faq-question">Question</Label>
            <Textarea
              id="faq-question"
              required
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea
              id="faq-answer"
              required
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-position">Position (optional)</Label>
            <Input
              id="faq-position"
              type="number"
              min={0}
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !categoryId}>
              {createMutation.isPending ? 'Creating...' : 'Create FAQ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
