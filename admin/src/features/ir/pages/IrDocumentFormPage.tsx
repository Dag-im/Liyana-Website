import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import * as irApi from '@/api/ir.api'
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
import { useCreateIrDocument, useIrDocuments, useUpdateIrDocument } from '../useIr'

export default function IrDocumentFormPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const documentsQuery = useIrDocuments()
  const createDocument = useCreateIrDocument()
  const updateDocument = useUpdateIrDocument()
  const current = documentsQuery.data?.find((item) => item.id === id)
  const returnTo = (location.state as { from?: string } | undefined)?.from ?? '/ir-admin/documents'
  const title = current ? 'Edit Document' : 'New Document'

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading={title}
        text="Use a standalone page for investor document uploads and edits."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Documents', to: '/ir-admin/documents' },
          { label: title },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to={returnTo}>Back to Documents</Link>
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <IrDocumentEditor
            key={current?.id ?? 'new-document'}
            initialTitle={current?.title ?? ''}
            initialYear={current?.year ?? ''}
            initialCategory={current?.category ?? 'report'}
            initialFilePath={current?.filePath ?? ''}
            initialSortOrder={current?.sortOrder ?? 0}
            isSaving={createDocument.isPending || updateDocument.isPending}
            onSave={(dto) => {
              if (current) {
                updateDocument.mutate(
                  { id: current.id, dto },
                  { onSuccess: () => navigate(returnTo) }
                )
                return
              }

              createDocument.mutate(dto, {
                onSuccess: () => navigate(returnTo),
              })
            }}
            onCancel={() => navigate(returnTo)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function IrDocumentEditor({
  initialTitle,
  initialYear,
  initialCategory,
  initialFilePath,
  initialSortOrder,
  isSaving,
  onSave,
  onCancel,
}: {
  initialTitle: string
  initialYear: string
  initialCategory: 'report' | 'presentation' | 'filing' | 'other'
  initialFilePath: string
  initialSortOrder: number
  isSaving: boolean
  onSave: (dto: {
    title: string
    year: string
    category: 'report' | 'presentation' | 'filing' | 'other'
    filePath: string
    sortOrder: number
  }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    year: initialYear,
    category: initialCategory,
    filePath: initialFilePath,
    sortOrder: String(initialSortOrder),
  })

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="ir-document-title-page">Title</Label>
        <Input
          id="ir-document-title-page"
          value={formData.title}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, title: event.target.value }))
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ir-document-year-page">Year</Label>
          <Input
            id="ir-document-year-page"
            value={formData.year}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, year: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                category: value as typeof formData.category,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
              <SelectItem value="filing">Filing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ir-document-sort-page">Sort Order</Label>
          <Input
            id="ir-document-sort-page"
            type="number"
            value={formData.sortOrder}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, sortOrder: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>PDF File</Label>
        <FileUpload
          accept=".pdf,application/pdf"
          currentPath={formData.filePath || undefined}
          label="Upload document PDF"
          maxSizeMB={12}
          onSuccess={(path) => setFormData((prev) => ({ ...prev, filePath: path }))}
          onUpload={irApi.uploadIrFile}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!formData.filePath || isSaving}
          onClick={() =>
            onSave({
              title: formData.title,
              year: formData.year,
              category: formData.category,
              filePath: formData.filePath,
              sortOrder: Number(formData.sortOrder) || 0,
            })
          }
        >
          {isSaving ? 'Saving...' : 'Save Document'}
        </Button>
      </div>
    </>
  )
}
