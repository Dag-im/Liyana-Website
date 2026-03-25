import { LayoutGrid, List, Plus, Search, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTeamMembers, useDeleteTeamMember } from './useTeam'
import { useDivisions } from '../divisions/useDivisions'
import { useDebounce } from '@/hooks/useDebounce'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import ErrorState from '@/components/shared/ErrorState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamGridView } from './TeamGridView'
import { TeamListView } from './TeamListView'
import TeamMemberDetailDialog from './TeamMemberDetailDialog'
import type { TeamMember } from '@/types/team.types'

export default function TeamPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [divisionId, setDivisionId] = useState<string>('all')
  const [isCorporate, setIsCorporate] = useState(false)
  const [includeHidden, setIncludeHidden] = useState(true)
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(search, 400)

  const { data: divisionsData } = useDivisions({ perPage: 100 })
  const divisions = divisionsData?.data || []

  const {
    data: membersData,
    isLoading,
    isError,
    refetch,
  } = useTeamMembers({
    page: 1,
    perPage: 100, // Show many for easy sorting/management
    search: debouncedSearch,
    divisionId: divisionId === 'all' ? undefined : divisionId,
    isCorporate: isCorporate || undefined,
    includeHidden,
  })

  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)

  const deleteMutation = useDeleteTeamMember()

  const clearFilters = () => {
    setSearch('')
    setDivisionId('all')
    setIsCorporate(false)
    setIncludeHidden(true)
  }

  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="container py-6 space-y-8">
      <PageHeader heading="Team & Leadership" text="Manage staff members and organizational roles.">
        <Button asChild>
          <Link state={{ from: '/team' }} to="/team/new">
          <Plus className="mr-2 h-4 w-4" /> Add Member
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select 
              value={divisionId} 
              onValueChange={(val) => setDivisionId(val || 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid className="mr-2 h-4 w-4" /> Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-slate-50/50 p-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isCorporate"
              checked={isCorporate}
              onCheckedChange={setIsCorporate}
            />
            <Label htmlFor="isCorporate" className="text-sm cursor-pointer">
              Show Corporate Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="includeHidden"
              checked={includeHidden}
              onCheckedChange={setIncludeHidden}
            />
            <Label htmlFor="includeHidden" className="text-sm cursor-pointer">
              Include Hidden
            </Label>
          </div>

          {(search || divisionId !== 'all' || isCorporate) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 lg:px-3 text-muted-foreground">
              Clear Filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !membersData || membersData.data.length === 0 ? (
        <EmptyState />
      ) : view === 'grid' ? (
        <TeamGridView
          members={membersData.data}
          onEdit={(member) => navigate(`/team/${member.id}/edit`, { state: { from: '/team' } })}
          onDelete={setDeletingMember}
          onView={setViewingMember}
        />
      ) : (
        <TeamListView
          members={membersData.data}
          isLoading={isLoading}
          onEdit={(member) => navigate(`/team/${member.id}/edit`, { state: { from: '/team' } })}
          onDelete={setDeletingMember}
          onView={setViewingMember}
        />
      )}

      {viewingMember && (
        <TeamMemberDetailDialog
          member={viewingMember}
          open={!!viewingMember}
          onClose={() => setViewingMember(null)}
          onEdit={(m) => {
            setViewingMember(null)
            navigate(`/team/${m.id}/edit`, { state: { from: '/team' } })
          }}
          onDelete={(m) => {
            setViewingMember(null)
            setDeletingMember(m)
          }}
        />
      )}

      <ConfirmDialog
        open={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => {
          if (deletingMember) {
            deleteMutation.mutate(deletingMember.id, {
              onSuccess: () => setDeletingMember(null),
            })
          }
        }}
        title="Delete Team Member"
        description={`Are you sure you want to delete ${deletingMember?.name}? This will permanently remove their image from storage.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
