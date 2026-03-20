import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Edit, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Pagination from '@/components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import type { Faq } from '@/types/faq.types'
import { useDeleteFaq, useFaqCategories, useFaqs, useReorderFaq } from './useFaqs'

function truncate(text: string, max: number) {
  if (text.length <= max) {
    return text
  }

  return `${text.slice(0, max)}...`
}

export default function FaqsPage() {
  const { page, perPage, setPage, resetPage } = usePagination()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const categoriesQuery = useFaqCategories()
  const faqsQuery = useFaqs({
    page,
    perPage,
    search: debouncedSearch || undefined,
    categoryId: activeCategory === 'all' ? undefined : activeCategory,
  })

  const reorderMutation = useReorderFaq()
  const deleteMutation = useDeleteFaq()

  const columns = useMemo(
    () => [
      {
        header: 'Drag Handle',
        id: 'drag-handle',
        cell: () => <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />,
      },
      {
        header: 'Position',
        accessorKey: 'position',
      },
      {
        header: 'Question',
        id: 'question',
        cell: ({ row }: { row: { original: Faq } }) => truncate(row.original.question, 80),
      },
      {
        header: 'Answer',
        id: 'answer',
        cell: ({ row }: { row: { original: Faq } }) => (
          <span className="text-muted-foreground">{truncate(row.original.answer, 60)}</span>
        ),
      },
      {
        header: 'Category',
        id: 'category',
        cell: ({ row }: { row: { original: Faq } }) => <Badge variant="secondary">{row.original.category.name}</Badge>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: { row: { original: Faq } }) => (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                reorderMutation.mutate({
                  id: row.original.id,
                  position: Math.max(0, row.original.position - 1),
                })
              }
              disabled={row.original.position <= 0 || reorderMutation.isPending}
              title="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                reorderMutation.mutate({
                  id: row.original.id,
                  position: row.original.position + 1,
                })
              }
              disabled={reorderMutation.isPending}
              title="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link
                state={{ from: '/faqs' }}
                to={`/faqs/${row.original.id}/edit`}
              >
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteFaq(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [reorderMutation]
  )

  return (
    <div className="space-y-6">
      <PageHeader heading="FAQs" text="Manage frequently asked questions.">
        <Button variant="outline" asChild>
          <Link to="/faq-categories">Manage Categories</Link>
        </Button>
        <Button asChild>
          <Link state={{ from: '/faqs' }} to="/faqs/new">
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
          </Link>
        </Button>
      </PageHeader>

      <Tabs
        value={activeCategory}
        onValueChange={(value) => {
          setActiveCategory(value)
          resetPage()
        }}
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="all">All</TabsTrigger>
          {(categoriesQuery.data ?? []).map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Input
        placeholder="Search FAQs..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          resetPage()
        }}
      />

      <div className="rounded-md border bg-white">
        <DataTable
          columns={columns}
          data={faqsQuery.data?.data ?? []}
          isLoading={faqsQuery.isLoading}
          isError={faqsQuery.isError}
          onRetry={() => faqsQuery.refetch()}
        />
        <Pagination
          page={page}
          perPage={perPage}
          total={faqsQuery.data?.total ?? 0}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteFaq)}
        onClose={() => setDeleteFaq(null)}
        onConfirm={() => {
          if (!deleteFaq) return
          deleteMutation.mutate(deleteFaq.id, {
            onSuccess: () => setDeleteFaq(null),
          })
        }}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
