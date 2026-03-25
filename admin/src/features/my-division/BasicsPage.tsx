import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMyDivision, useUpdateMyDivision } from '@/features/my-division/useMyDivision'
import { showErrorToast } from '@/lib/error-utils'

export default function BasicsPage() {
  const { data: division, isLoading } = useMyDivision()
  const updateMutation = useUpdateMyDivision()

  const [form, setForm] = useState({
    name: '',
    shortName: '',
    location: '',
    overview: '',
  })

  useEffect(() => {
    if (!division) return
    setForm({
      name: division.name,
      shortName: division.shortName,
      location: division.location ?? '',
      overview: division.overview,
    })
  }, [division])

  if (isLoading) return <LoadingSpinner fullPage />

  const onSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => {
        toast.success('Division basics updated')
      },
      onError: (error) => showErrorToast(error, 'Failed to update division basics'),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Division Basics"
        text="Update the core identity fields for your division."
      />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Division Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name</Label>
              <Input
                id="shortName"
                value={form.shortName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, shortName: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, location: event.target.value }))
              }
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              id="overview"
              value={form.overview}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, overview: event.target.value }))
              }
              rows={6}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onSave} disabled={updateMutation.isPending}>
              Save Basics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
