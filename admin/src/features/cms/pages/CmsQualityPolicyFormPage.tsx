import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQualityPolicy, useUpsertQualityPolicy } from '../useCms'

export default function CmsQualityPolicyFormPage() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const qualityPolicyQuery = useQualityPolicy()
  const upsertQualityPolicy = useUpsertQualityPolicy()
  const decodedLang = lang ? decodeURIComponent(lang) : undefined
  const current = qualityPolicyQuery.data?.find((item) => item.lang === decodedLang)
  const returnTo =
    (location.state as { from?: string } | undefined)?.from ?? '/cms/quality-policy'
  const title = current ? 'Edit Language Policy' : 'New Language Policy'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated page to manage quality policy languages and goals."
        items={[
          { label: 'CMS', to: '/cms' },
          { label: 'Quality Policy', to: '/cms/quality-policy' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Quality Policy</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <QualityPolicyEditor
            key={current?.lang ?? 'new-quality-policy'}
            initialLang={current?.lang ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            initialGoals={current?.goals ?? ['']}
            isExisting={!!current}
            isSaving={upsertQualityPolicy.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={({ nextLang, sortOrder, goals }) =>
              upsertQualityPolicy.mutate(
                {
                  lang: nextLang,
                  dto: { sortOrder, goals },
                },
                {
                  onSuccess: () => navigate(returnTo),
                }
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

function QualityPolicyEditor({
  initialLang,
  initialSortOrder,
  initialGoals,
  isExisting,
  isSaving,
  onSave,
  onCancel,
}: {
  initialLang: string
  initialSortOrder: number
  initialGoals: string[]
  isExisting: boolean
  isSaving: boolean
  onSave: (dto: { nextLang: string; sortOrder: number; goals: string[] }) => void
  onCancel: () => void
}) {
  const [lang, setLang] = useState(initialLang)
  const [sortOrder, setSortOrder] = useState(String(initialSortOrder))
  const [goals, setGoals] = useState(initialGoals.length ? initialGoals : [''])

  const updateGoal = (index: number, value: string) => {
    setGoals((prev) => prev.map((goal, goalIndex) => (goalIndex === index ? value : goal)))
  }

  const removeGoal = (index: number) => {
    setGoals((prev) => (prev.length <= 1 ? prev : prev.filter((_, goalIndex) => goalIndex !== index)))
  }

  const moveGoal = (index: number, direction: 'up' | 'down') => {
    setGoals((prev) => {
      const next = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= next.length) return prev
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Language</Label>
        {isExisting ? (
          <Badge variant="secondary">{initialLang}</Badge>
        ) : (
          <Input value={lang} onChange={(event) => setLang(event.target.value)} placeholder="e.g. English" />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cms-quality-sort-page">Sort Order</Label>
        <Input
          id="cms-quality-sort-page"
          type="number"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Goals</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => setGoals((prev) => [...prev, ''])}>
            <Plus className="mr-1 h-4 w-4" />
            Add Goal
          </Button>
        </div>
        {goals.map((goal, index) => (
          <div key={`goal-${index}`} className="space-y-2 rounded-xl border p-3">
            <Textarea
              value={goal}
              onChange={(event) => updateGoal(index, event.target.value)}
              placeholder={`Goal ${index + 1}`}
            />
            <div className="flex items-center gap-1">
              <Button type="button" size="icon" variant="ghost" onClick={() => moveGoal(index, 'up')} disabled={index === 0}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => moveGoal(index, 'down')}
                disabled={index === goals.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => removeGoal(index)}
                disabled={goals.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          onClick={() => {
            const cleanedGoals = goals.map((goal) => goal.trim()).filter(Boolean)
            if (!cleanedGoals.length) {
              toast.error('At least one goal is required')
              return
            }
            if (!lang.trim() && !isExisting) {
              toast.error('Language is required')
              return
            }
            onSave({
              nextLang: isExisting ? initialLang : lang.trim(),
              sortOrder: Number(sortOrder) || 0,
              goals: cleanedGoals,
            })
          }}
        >
          {isSaving ? 'Saving...' : 'Save Policy'}
        </Button>
      </div>
    </>
  )
}
