import { divisionsApi } from '@/api/divisions.api'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories'
import { useServiceCategories } from '@/features/service-categories/useServiceCategories'
import type { Division } from '@/types/services.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useUpdateDivision } from './useDivisions'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().min(1, 'Short name is required'),
  location: z.string().optional(),
  serviceCategoryId: z.string().min(1, 'Service category is required'),
  divisionCategoryId: z.string().min(1, 'Division category is required'),
  isActive: z.boolean().default(true),
  logo: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function EditDivisionDialog({
  division,
  open,
  onOpenChange,
}: {
  division: Division
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateMutation = useUpdateDivision(division.id)
  const { data: serviceCategories } = useServiceCategories({ perPage: 100 })
  const { data: divisionCategories } = useDivisionCategories()

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    values: {
      name: division.name,
      shortName: division.shortName,
      location: division.location || '',
      serviceCategoryId: division.serviceCategoryId,
      divisionCategoryId: division.divisionCategoryId,
      isActive: division.isActive,
      logo: division.logo || '',
    },
  })

  const onSubmit = (values: FormData) => {
    updateMutation.mutate(
      { id: division.id, dto: values },
      {
        onSuccess: () => {
          toast.success('Division updated')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Division</DialogTitle>
          <DialogDescription>Update core details for {division?.name}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
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
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceCategories?.data.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="divisionCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionCategories?.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

             <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                   <Label>Active Status</Label>
                   <p className="text-xs text-muted-foreground">Toggles division visibility in the frontend.</p>
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
             </div>

             <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUpload={divisionsApi.uploadDivisionFile}
                        onSuccess={field.onChange}
                        currentPath={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
