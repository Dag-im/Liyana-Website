import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { QualityPolicy } from '@/types/cms.types'
import { useUpsertQualityPolicy } from './useCms'

type UpsertQualityPolicyDialogProps = {
  open: boolean
  onClose: () => void
  existing?: QualityPolicy
}

const defaultState = {
  lang: '',
  sortOrder: '0',
  goals: [''],
}

export default function UpsertQualityPolicyDialog({
  open,
  onClose,
  existing,
}: UpsertQualityPolicyDialogProps) {
  const upsertMutation = useUpsertQualityPolicy()

  const [lang, setLang] = useState(defaultState.lang)
  const [sortOrder, setSortOrder] = useState(defaultState.sortOrder)
  const [goals, setGoals] = useState<string[]>(defaultState.goals)

  useEffect(() => {
    if (open) {
      if (existing) {
        setLang(existing.lang)
        setSortOrder(String(existing.sortOrder))
        setGoals(existing.goals.length ? existing.goals : [''])
      } else {
        setLang(defaultState.lang)
        setSortOrder(defaultState.sortOrder)
        setGoals(defaultState.goals)
      }
    }
  }, [open, existing])

  const updateGoal = (index: number, value: string) => {
    setGoals((prev) => prev.map((goal, goalIndex) => (goalIndex === index ? value : goal)))
  }

  const removeGoal = (index: number) => {
    setGoals((prev) => {
      if (prev.length <= 1) {
        return prev
      }

      return prev.filter((_, goalIndex) => goalIndex !== index)
    })
  }

  const moveGoal = (index: number, direction: 'up' | 'down') => {
    setGoals((prev) => {
      const next = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1

      if (targetIndex < 0 || targetIndex >= next.length) {
        return prev
      }

      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()

    const cleanedGoals = goals.map((goal) => goal.trim()).filter(Boolean)

    if (!cleanedGoals.length) {
      toast.error('At least one goal is required')
      return
    }

    if (!lang.trim()) {
      toast.error('Language is required')
      return
    }

    upsertMutation.mutate(
      {
        lang: lang.trim(),
        dto: {
          goals: cleanedGoals,
          sortOrder: Number(sortOrder) || 0,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Language Policy' : 'Add Language Policy'}</DialogTitle>
          <DialogDescription>Define the quality policy goals for a language.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label>Language</Label>
            {existing ? (
              <Badge variant="secondary">{existing.lang}</Badge>
            ) : (
              <Input value={lang} onChange={(event) => setLang(event.target.value)} placeholder="e.g. English" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality-sort-order">Sort Order</Label>
            <Input
              id="quality-sort-order"
              type="number"
              min={0}
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
              <div key={`goal-${index}`} className="space-y-2 rounded-md border p-3">
                <Textarea
                  value={goal}
                  onChange={(event) => updateGoal(index, event.target.value)}
                  placeholder={`Goal ${index + 1}`}
                />
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveGoal(index, 'up')}
                    disabled={index === 0}
                  >
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? 'Saving...' : 'Save Policy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
