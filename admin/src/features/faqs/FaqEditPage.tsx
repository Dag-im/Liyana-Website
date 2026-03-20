import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
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
import { useFaq, useFaqCategories, useUpdateFaq } from './useFaqs'

export default function FaqEditPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const faqQuery = useFaq(id)
  const { data: categories = [] } = useFaqCategories()
  const updateMutation = useUpdateFaq()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [position, setPosition] = useState('')

  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/faqs'

  useEffect(() => {
    if (!faqQuery.data) return
    setQuestion(faqQuery.data.question)
    setAnswer(faqQuery.data.answer)
    setCategoryId(faqQuery.data.categoryId)
    setPosition(String(faqQuery.data.position))
  }, [faqQuery.data])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateMutation.mutate(
      {
        id,
        dto: {
          question,
          answer,
          categoryId,
          position: position ? Number(position) : undefined,
        },
      },
      {
        onSuccess: () => navigate(returnTo),
      }
    )
  }

  if (faqQuery.isLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (faqQuery.isError || !faqQuery.data) {
    return <ErrorState onRetry={() => faqQuery.refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit FAQ" text="Update this FAQ item.">
        <Button asChild variant="outline">
          <Link to={returnTo}>Back</Link>
        </Button>
      </PageHeader>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="edit-faq-question">Question</Label>
              <Textarea
                id="edit-faq-question"
                required
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-faq-answer">Answer</Label>
              <Textarea
                id="edit-faq-answer"
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
              <Label htmlFor="edit-faq-position">Position</Label>
              <Input
                id="edit-faq-position"
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
              <Button type="submit" disabled={updateMutation.isPending || !categoryId}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
