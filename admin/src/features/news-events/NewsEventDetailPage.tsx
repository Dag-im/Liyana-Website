import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { FileImage } from '@/components/shared/FileImage'
import RichTextViewer from '@/components/shared/RichTextViewer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/useAuth'
import { formatDate } from '@/lib/utils'
import {
  useDeleteNewsEvent,
  useNewsEvent,
  usePublishNewsEvent,
  useUnpublishNewsEvent,
} from './useNewsEvents'
import NewsEventStatusBadge from './components/NewsEventStatusBadge'

export default function NewsEventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const authQuery = useAuth()
  const userRole = authQuery.data?.role
  const isEditor = userRole === 'ADMIN' || userRole === 'COMMUNICATION'
  const isAdmin = userRole === 'ADMIN'

  const newsEventQuery = useNewsEvent(id ?? '')
  const publishMutation = usePublishNewsEvent()
  const unpublishMutation = useUnpublishNewsEvent()
  const deleteMutation = useDeleteNewsEvent()

  if (newsEventQuery.isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (newsEventQuery.isError || !newsEventQuery.data) {
    return <ErrorState onRetry={() => newsEventQuery.refetch()} />
  }

  const entry = newsEventQuery.data

  const backPath = entry.type === 'event' ? '/events' : '/news'

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={backPath}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <PageHeader heading={entry.title} />
            <div className="mt-2">
              <NewsEventStatusBadge status={entry.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditor ? (
            <Button size="sm" variant="outline" asChild>
              <Link to={`${backPath}/${entry.id}/edit`} state={{ from: `${backPath}/${entry.id}` }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          ) : null}
          {isEditor ? (
            entry.status === 'PUBLISHED' ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => unpublishMutation.mutate(entry.id)}
                disabled={unpublishMutation.isPending}
              >
                Unpublish
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => publishMutation.mutate(entry.id)}
                disabled={publishMutation.isPending}
              >
                Publish
              </Button>
            )
          ) : null}
          {isAdmin ? (
            <ConfirmDialog
              title="Delete Entry"
              description="This will permanently delete the entry and all associated images."
              onConfirm={() =>
                deleteMutation.mutate(entry.id, {
                  onSuccess: () => {
                    navigate(backPath)
                  },
                })
              }
              isLoading={deleteMutation.isPending}
              trigger={
                <Button size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
            />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{entry.type === 'event' ? 'Event' : 'News'}</Badge>
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(entry.date)}</span>
          </div>
          {entry.type === 'event' ? (
            <div>
              <span className="text-muted-foreground">Location:</span> {entry.location || '—'}
            </div>
          ) : null}
          <div>
            <span className="text-muted-foreground">Created by:</span> {entry.createdByName}
          </div>
          <div>
            <span className="text-muted-foreground">Published at:</span>{' '}
            {entry.publishedAt ? formatDate(entry.publishedAt) : '—'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Main Image', path: entry.mainImage },
              { label: 'Image 1', path: entry.image1 },
              { label: 'Image 2', path: entry.image2 },
            ].map((img) => (
              <div key={img.label} className="space-y-2">
                <div className="w-full h-48 rounded-md border overflow-hidden bg-muted">
                  <FileImage
                    path={img.path}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">{img.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{entry.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.content.map((segment, index) => {
            const looksLikeHtml = /<[^>]+>/.test(segment)
            const normalized = looksLikeHtml ? segment : `<p>${segment}</p>`
            return <RichTextViewer key={index} content={normalized} />
          })}
        </CardContent>
      </Card>

      {entry.keyHighlights && entry.keyHighlights.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {entry.keyHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
