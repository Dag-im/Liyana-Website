import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Plus, Trash2, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { divisionsApi } from '@/api/divisions.api'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DataTable from '@/components/shared/DataTable'
import EmptyState from '@/components/shared/EmptyState'
import { FileImage } from '@/components/shared/FileImage'
import { FileUpload } from '@/components/shared/FileUpload'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/useAuth'
import {
  useCreateDoctor,
  useDeleteDoctor,
  useMyDivision,
  useUpdateDoctor,
} from '@/features/my-division/useMyDivision'
import { useDivisionDoctors } from '@/features/divisions/useDivisions'
import { usePagination } from '@/hooks/usePagination'
import { showErrorToast } from '@/lib/error-utils'
import type { Doctor } from '@/types/services.types'

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  availability: z.string().min(1, 'Availability is required'),
  image: z.string().optional(),
})

type DoctorFormData = z.infer<typeof doctorSchema>

export default function MedicalTeamPage() {
  const { data: user } = useAuth()
  const divisionId = user?.divisionId ?? ''

  const { data: division, isLoading: divisionLoading } = useMyDivision()
  const { data: doctors, isLoading: doctorsLoading, refetch } = useDivisionDoctors(divisionId)
  const createDoctor = useCreateDoctor(divisionId)
  const updateDoctor = useUpdateDoctor(divisionId)
  const deleteDoctor = useDeleteDoctor(divisionId)
  const { page, perPage, setPage, setPerPage } = usePagination()

  const [open, setOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      specialty: '',
      availability: 'Available during business hours',
      image: '',
    },
  })

  const pagedDoctors = useMemo(() => {
    const all = doctors ?? []
    const start = (page - 1) * perPage
    return all.slice(start, start + perPage)
  }, [doctors, page, perPage])

  if (divisionLoading || doctorsLoading) return <LoadingSpinner fullPage />

  if (!division?.requiresMedicalTeam) {
    return (
      <EmptyState
        title="Medical team not enabled"
        description="Contact your administrator to enable medical team management for this division."
      />
    )
  }

  const openCreate = () => {
    setEditingDoctor(null)
    form.reset({
      name: '',
      specialty: '',
      availability: 'Available during business hours',
      image: '',
    })
    setOpen(true)
  }

  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    form.reset({
      name: doctor.name,
      specialty: doctor.specialty,
      availability: doctor.availability,
      image: doctor.image ?? '',
    })
    setOpen(true)
  }

  const onSubmit = (values: DoctorFormData) => {
    const payload = {
      ...values,
      image: values.image || null,
    }

    if (editingDoctor) {
      updateDoctor.mutate(
        { id: editingDoctor.id, dto: payload },
        {
          onSuccess: () => {
            toast.success('Doctor updated')
            setOpen(false)
          },
          onError: (error) => showErrorToast(error, 'Failed to update doctor'),
        },
      )
      return
    }

    createDoctor.mutate(payload, {
      onSuccess: () => {
        toast.success('Doctor created')
        setOpen(false)
      },
      onError: (error) => showErrorToast(error, 'Failed to create doctor'),
    })
  }

  const onDelete = () => {
    if (!deletingId) return
    deleteDoctor.mutate(deletingId, {
      onSuccess: () => {
        toast.success('Doctor deleted')
        setDeletingId(null)
      },
      onError: (error) => showErrorToast(error, 'Failed to delete doctor'),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Medical Team"
        text="Manage doctors for your division."
      >
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </PageHeader>

      <DataTable
        data={pagedDoctors}
        isLoading={doctorsLoading}
        isError={false}
        onRetry={() => refetch()}
        pagination={{
          page,
          perPage,
          total: doctors?.length ?? 0,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
        columns={[
          {
            header: 'Image',
            id: 'image',
            cell: ({ row }: { row: { original: Doctor } }) => (
              <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                {row.original.image ? (
                  <FileImage
                    path={row.original.image}
                    alt={row.original.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <UserRound className="h-4 w-4" />
                  </div>
                )}
              </div>
            ),
          },
          {
            header: 'Name',
            accessorKey: 'name',
          },
          {
            header: 'Specialty',
            accessorKey: 'specialty',
          },
          {
            header: 'Availability',
            accessorKey: 'availability',
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: Doctor } }) => (
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(row.original)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeletingId(row.original.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
            <DialogDescription>
              {editingDoctor
                ? 'Update doctor profile details.'
                : 'Create a new doctor profile for this division.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUpload={(file) => divisionsApi.uploadDoctorFile(divisionId, file)}
                        onSuccess={field.onChange}
                        currentPath={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createDoctor.isPending || updateDoctor.isPending}
                >
                  {editingDoctor ? 'Save Changes' : 'Create Doctor'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={onDelete}
        title="Delete Doctor"
        description="Are you sure you want to remove this doctor from your division?"
        confirmLabel="Delete"
        isLoading={deleteDoctor.isPending}
      />
    </div>
  )
}
