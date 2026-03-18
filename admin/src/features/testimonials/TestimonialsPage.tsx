import { useMemo, useState } from 'react'
import { CheckCircle2, MessageSquare, Star, Clock, Trash2, Eye, XCircle } from 'lucide-react'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/features/auth/useAuth'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { formatDate } from '@/lib/utils'
import type { Testimonial } from '@/types/testimonial.types'
import {
  useApproveTestimonial,
  useDeleteTestimonial,
  useFavoriteTestimonial,
  useTestimonials,
  useUnapproveTestimonial,
  useUnfavoriteTestimonial,
} from './useTestimonials'
import { TestimonialDetailDialog } from './TestimonialDetailDialog'

type FilterTab = 'all' | 'pending' | 'approved' | 'favorites'

export default function TestimonialsPage() {
  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [unapproveId, setUnapproveId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const authQuery = useAuth()
  const isAdmin = authQuery.data?.role === 'ADMIN'

  // Stats queries
  const totalQuery = useTestimonials({ perPage: 1 })
  const approvedQuery = useTestimonials({ isApproved: true, perPage: 1 })
  const favoritesQuery = useTestimonials({ isFavorite: true, perPage: 1 })
  const pendingQuery = useTestimonials({ isApproved: false, perPage: 1 })

  // Main data query
  const testimonialsQuery = useTestimonials({
    page,
    perPage,
    search: debouncedSearch || undefined,
    isApproved: activeTab === 'approved' ? true : activeTab === 'pending' ? false : undefined,
    isFavorite: activeTab === 'favorites' ? true : undefined,
  })

  const approveMutation = useApproveTestimonial()
  const unapproveMutation = useUnapproveTestimonial()
  const favoriteMutation = useFavoriteTestimonial()
  const unfavoriteMutation = useUnfavoriteTestimonial()
  const deleteMutation = useDeleteTestimonial()

  const handleOpenDetail = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setDetailDialogOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  const handleUnapprove = () => {
    if (unapproveId) {
      unapproveMutation.mutate(unapproveId, {
        onSuccess: () => setUnapproveId(null),
      })
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        render: (row: Testimonial) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.name}</span>
            <span className="text-xs text-muted-foreground">{row.role}</span>
          </div>
        ),
      },
      { accessorKey: 'company', header: 'Company' },
      {
        accessorKey: 'message',
        header: 'Message',
        render: (row: Testimonial) => (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
            {row.message}
          </span>
        ),
      },
      {
        accessorKey: 'isApproved',
        header: 'Approved',
        render: (row: Testimonial) => (
          <StatusBadge
            type="active"
            isActive={row.isApproved}
            activeText="Approved"
            inactiveText="Pending"
          />
        ),
      },
      {
        accessorKey: 'isFavorite',
        header: 'Favorite',
        render: (row: Testimonial) => (
          <Star
            className={`h-5 w-5 ${
              row.isFavorite ? 'fill-cyan-500 text-cyan-500' : 'text-muted-foreground/30'
            }`}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Submitted',
        render: (row: Testimonial) => formatDate(row.createdAt),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        render: (row: Testimonial) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDetail(row)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {!row.isApproved ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => approveMutation.mutate(row.id)}
                disabled={approveMutation.isPending}
                title="Approve"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUnapproveId(row.id)}
                disabled={unapproveMutation.isPending}
                title="Unapprove"
              >
                <XCircle className="h-4 w-4 text-destructive" />
              </Button>
            )}

            {row.isFavorite ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => unfavoriteMutation.mutate(row.id)}
                disabled={unfavoriteMutation.isPending}
                title="Remove from favorites"
              >
                <Star className="h-4 w-4 fill-cyan-500 text-cyan-500" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => favoriteMutation.mutate(row.id)}
                disabled={!row.isApproved || favoriteMutation.isPending}
                className={!row.isApproved ? 'opacity-30' : ''}
                title={!row.isApproved ? 'Approve first' : 'Add to favorites'}
              >
                <Star className="h-4 w-4" />
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(row.id)}
                disabled={deleteMutation.isPending}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [isAdmin, approveMutation, unapproveMutation, favoriteMutation, unfavoriteMutation, deleteMutation]
  )

  return (
    <div className="space-y-6">
      <PageHeader heading="Testimonials" text="Manage customer testimonials and reviews." />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submitted</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuery.data?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedQuery.data?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorited</CardTitle>
            <Star className="h-4 w-4 text-cyan-500 fill-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoritesQuery.data?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuery.data?.total ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as FilterTab)
            resetPage()
          }}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search name, company, role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              resetPage()
            }}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-white">
        <DataTable
          columns={columns}
          data={testimonialsQuery.data?.data ?? []}
          isLoading={testimonialsQuery.isLoading}
          onRetry={() => testimonialsQuery.refetch()}
        />
        <Pagination
          page={page}
          perPage={perPage}
          total={testimonialsQuery.data?.total ?? 0}
          onPageChange={setPage}
        />
      </div>

      {/* Dialogs */}
      <TestimonialDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        testimonial={selectedTestimonial}
      />

      <ConfirmDialog
        open={!!unapproveId}
        onClose={() => setUnapproveId(null)}
        onConfirm={handleUnapprove}
        title="Unapprove Testimonial"
        description="Are you sure you want to unapprove this testimonial? This will also remove it from favorites and hide it from the public site."
        confirmLabel="Unapprove"
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        description="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}
