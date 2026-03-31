import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ActionIconGroup from '@/components/shared/ActionIconGroup'
import BreadcrumbHeader from '@/components/shared/BreadcrumbHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import PublishToggle from '@/components/shared/PublishToggle'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteIrDocument, useIrDocuments, usePublishIrDocument, useUnpublishIrDocument } from '../useIr'

type CategoryFilter = 'all' | 'report' | 'presentation' | 'filing' | 'other'

export default function IrDocumentsPage() {
  const location = useLocation()
  const documentsQuery = useIrDocuments()
  const publishDocument = usePublishIrDocument()
  const unpublishDocument = useUnpublishIrDocument()
  const deleteDocument = useDeleteIrDocument()
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const documents = useMemo(() => {
    const items = documentsQuery.data ?? []
    if (category === 'all') return items
    return items.filter((item) => item.category === category)
  }, [category, documentsQuery.data])

  return (
    <div className="space-y-6">
      <BreadcrumbHeader
        heading="IR Documents"
        text="Investor documents now use list and form pages instead of modal editing."
        items={[
          { label: 'Investor Relations', to: '/ir-admin' },
          { label: 'Documents' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="filing">Filing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link state={{ from: location.pathname }} to="/ir-admin/documents/new">
                <Plus className="mr-2 h-4 w-4" />
                New Document
              </Link>
            </Button>
          </div>
        }
      />

      {documents.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <CardTitle className="text-lg">{document.title}</CardTitle>
                <CardDescription>
                  {document.year} • {document.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
                  {document.filePath}
                </div>
                <PublishToggle
                  isPending={publishDocument.isPending || unpublishDocument.isPending}
                  isPublished={document.isPublished}
                  label="Document Status"
                  onPublish={() => publishDocument.mutate(document.id)}
                  onUnpublish={() => unpublishDocument.mutate(document.id)}
                />
                <div className="flex justify-end">
                  <ActionIconGroup
                    actions={[
                      {
                        label: 'Edit Document',
                        icon: Pencil,
                        to: `/ir-admin/documents/${document.id}/edit`,
                      },
                      {
                        label: 'Delete Document',
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteId(document.id),
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No documents found"
          description="Upload the first investor document or adjust the category filter."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteDocument.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Document"
        description="Delete this investor document permanently?"
        confirmLabel="Delete"
      />
    </div>
  )
}
