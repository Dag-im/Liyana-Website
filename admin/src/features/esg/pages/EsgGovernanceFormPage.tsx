import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import * as esgApi from '@/api/esg.api'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useCreateEsgGovernanceItem, useEsgGovernance, useUpdateEsgGovernanceItem } from '../useEsg'

export default function EsgGovernanceFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const governanceQuery = useEsgGovernance()
  const createItem = useCreateEsgGovernanceItem()
  const updateItem = useUpdateEsgGovernanceItem()
  const current = governanceQuery.data?.find((item) => item.id === id)
  const returnTo =
    (location.state as { from?: string } | undefined)?.from ?? '/esg-admin/governance'
  const title = current ? 'Edit Governance Item' : 'New Governance Item'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a dedicated form page for governance create and edit flows."
        items={[
          { label: 'ESG', to: '/esg-admin' },
          { label: 'Governance', to: '/esg-admin/governance' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Governance</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EsgGovernanceEditor
            key={current?.id ?? 'new-governance'}
            initialTitle={current?.title ?? ''}
            initialDescription={current?.description ?? ''}
            initialType={current?.type ?? 'policy'}
            initialDocument={current?.document ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createItem.isPending || updateItem.isPending}
            onCancel={() => navigate(returnTo)}
            onSave={(dto) => {
              if (current) {
                updateItem.mutate({ id: current.id, dto }, { onSuccess: () => navigate(returnTo) })
                return
              }
              createItem.mutate(dto, { onSuccess: () => navigate(returnTo) })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function EsgGovernanceEditor({
  initialTitle,
  initialDescription,
  initialType,
  initialDocument,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialDescription: string
  initialType: 'policy' | 'certification' | 'risk'
  initialDocument: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: esgApi.CreateEsgGovernanceItemDto) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
    type: initialType,
    document: initialDocument,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="esg-governance-title-page">Title</Label>
        <Input
          id="esg-governance-title-page"
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value as typeof formData.type }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="risk">Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="esg-governance-sort-page">Sort Order</Label>
          <Input
            id="esg-governance-sort-page"
            type="number"
            value={formData.sortOrder}
            onChange={(event) => setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="esg-governance-description-page">Description</Label>
        <Textarea
          id="esg-governance-description-page"
          rows={5}
          value={formData.description}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Optional Document</Label>
        <FileUpload
          accept=".pdf,application/pdf"
          currentPath={formData.document || undefined}
          label="Upload governance file"
          maxSizeMB={10}
          onSuccess={(path) => setFormData((prev) => ({ ...prev, document: path }))}
          onUpload={esgApi.uploadEsgFile}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          onClick={() =>
            onSave({
              title: formData.title,
              description: formData.description,
              type: formData.type,
              document: formData.document || undefined,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Item'}
        </Button>
      </div>
    </>
  )
}
