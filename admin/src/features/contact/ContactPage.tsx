import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Trash2, Eye, Inbox } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import Pagination from '@/components/shared/Pagination';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/lib/utils';
import type { ContactSubmission } from '@/types/contact.types';
import {
  useContactSubmissions,
  useDeleteContactSubmission,
  useReviewContactSubmission,
} from './useContact';
import { ContactSubmissionDetailDialog } from './ContactSubmissionDetailDialog';

type FilterTab = 'all' | 'unreviewed' | 'reviewed';

export default function ContactPage() {
  const { page, perPage, setPage, resetPage, setPerPage } = usePagination();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const authQuery = useAuth();
  const isAdmin = authQuery.data?.role === 'ADMIN';

  // Stats queries
  const totalQuery = useContactSubmissions({ perPage: 1 });
  const unreviewedQuery = useContactSubmissions({
    isReviewed: false,
    perPage: 1,
  });
  const reviewedQuery = useContactSubmissions({ isReviewed: true, perPage: 1 });

  // Main data query
  const contactsQuery = useContactSubmissions({
    page,
    perPage,
    search: debouncedSearch || undefined,
    isReviewed:
      activeTab === 'reviewed'
        ? true
        : activeTab === 'unreviewed'
          ? false
          : undefined,
  });

  const reviewMutation = useReviewContactSubmission();
  const deleteMutation = useDeleteContactSubmission();

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setDetailDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Sender',
        render: (row: ContactSubmission) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.name}</span>
            <span className="text-xs text-muted-foreground">{row.email}</span>
          </div>
        ),
      },
      {
        accessorKey: 'message',
        header: 'Message',
        render: (row: ContactSubmission) => (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-87.5">
            {row.message}
          </span>
        ),
      },
      {
        accessorKey: 'isReviewed',
        header: 'Status',
        render: (row: ContactSubmission) => (
          <StatusBadge
            type="active"
            isActive={row.isReviewed}
            activeText="Reviewed"
            inactiveText="Unreviewed"
          />
        ),
      },
      {
        accessorKey: 'reviewedAt',
        header: 'Reviewed At',
        render: (row: ContactSubmission) =>
          row.reviewedAt ? formatDate(row.reviewedAt) : '—',
      },
      {
        accessorKey: 'createdAt',
        header: 'Submitted',
        render: (row: ContactSubmission) => formatDate(row.createdAt),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        render: (row: ContactSubmission) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDetail(row.id)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {!row.isReviewed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => reviewMutation.mutate(row.id)}
                disabled={reviewMutation.isPending}
                title="Mark as Reviewed"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
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
    [isAdmin, reviewMutation, deleteMutation]
  );

  const unreviewedCount = unreviewedQuery.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Contact Submissions"
        text="Manage customer inquiries and feedback."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQuery.data?.total ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">
              Unreviewed
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{unreviewedCount}</div>
              {unreviewedCount > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviewedQuery.data?.total ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as FilterTab);
            resetPage();
          }}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unreviewed">Unreviewed</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border bg-white">
        <DataTable
          columns={columns}
          data={contactsQuery.data?.data ?? []}
          isLoading={contactsQuery.isLoading}
          onRetry={() => contactsQuery.refetch()}
        />
        <Pagination
          page={page}
          perPage={perPage}
          total={contactsQuery.data?.total ?? 0}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {/* Dialogs */}
      <ContactSubmissionDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        id={selectedId}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Submission"
        description="Are you sure you want to permanently delete this contact submission? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
