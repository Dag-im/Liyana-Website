import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

export default function FaqCreatePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: categories = [] } = useFaqCategories()
  const createMutation = useCreateFaq()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [position, setPosition] = useState('')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/faqs'

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
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Create FAQ" text="Add a new frequently asked question.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
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

            <div className="flex items-center justify-end gap-2">
              <Button asChild type="button" variant="outline">
                <Link to={returnTo}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !categoryId}>
                {createMutation.isPending ? 'Creating...' : 'Create FAQ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
