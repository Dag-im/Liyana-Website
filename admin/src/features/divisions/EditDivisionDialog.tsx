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
import { Textarea } from '@/components/ui/textarea'
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories'
import { useServiceCategories } from '@/features/service-categories/useServiceCategories'
import type { Division } from '@/types/services.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useUpdateDivision } from './useDivisions'
import { getUploadUrl } from '@/lib/upload-utils'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().min(1, 'Short name is required'),
  location: z.string().optional(),
  serviceCategoryId: z.string().min(1, 'Service category is required'),
  divisionCategoryId: z.string().min(1, 'Division category is required'),
  isActive: z.boolean().default(true),
  logo: z.string().optional(),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  description: z.array(z.string()).min(1, 'At least one description paragraph is required'),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    googleMap: z.string().url().optional().or(z.literal('')),
  }).optional(),
  coreServices: z.array(z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().optional(),
  })).optional(),
  stats: z.array(z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.string().min(1, 'Value is required'),
  })).optional(),
  images: z.array(z.object({
    path: z.string().min(1),
    alt: z.string().optional(),
  })).optional(),
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
    defaultValues: {
      name: division.name,
      shortName: division.shortName,
      location: division.location || '',
      serviceCategoryId: division.serviceCategoryId,
      divisionCategoryId: division.divisionCategoryId,
      isActive: division.isActive,
      logo: division.logo || '',
      overview: division.overview,
      description: division.description,
      contact: {
        phone: division.contact?.phone || '',
        email: division.contact?.email || '',
        address: division.contact?.address || '',
        googleMap: division.contact?.googleMap || '',
      },
      coreServices: division.coreServices.map(s => ({ name: s.name, description: '' })), // Backend and types mismatch slightly, adapting
      stats: division.stats.map(s => ({ label: s.label, value: s.value })),
      images: division.images.map(img => ({ path: img.path, alt: '' })),
    },
  })

  const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
    control: form.control,
    name: "description" as any,
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "coreServices",
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const onSubmit = (values: FormData) => {
    updateMutation.mutate(
      { id: division.id, dto: values },
      {
        onSuccess: () => {
          toast.success('Division updated successfully')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Division: {division?.name}</DialogTitle>
          <DialogDescription>Full control over division details and content.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                          <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
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
                          <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionCategories?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
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
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-[10px] text-muted-foreground">Toggles division visibility in the frontend.</p>
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Content & Description</h3>
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Detailed Description</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendDesc("")}>
                    <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                  </Button>
                </div>
                {descFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`description.${index}` as any}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDesc(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Media</h3>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={getUploadUrl(field.path)} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="aspect-square">
                    <FileUpload
                      onUpload={divisionsApi.uploadDivisionFile}
                      onSuccess={(path) => appendImage({ path, alt: '' })}
                      label="Add Image"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-semibold border-b pb-2">Contact Details</h3>
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
               <FormField
                control={form.control}
                name="contact.googleMap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-semibold">Core Services</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendService({ name: '', description: '' })}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                {serviceFields.map((field, index) => (
                  <div key={field.id} className="relative p-3 border rounded-lg bg-muted/20 space-y-2">
                    <FormField
                      control={form.control}
                      name={`coreServices.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Service Name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full border bg-background" onClick={() => removeService(index)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-semibold">Statistics</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ label: '', value: '' })}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                {statFields.map((field, index) => (
                  <div key={field.id} className="relative p-3 border rounded-lg bg-muted/20 space-y-2">
                    <FormField
                      control={form.control}
                      name={`stats.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Label (e.g. Patients)" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`stats.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Value (e.g. 500+)" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full border bg-background" onClick={() => removeStat(index)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-6 sticky bottom-0 bg-background pb-2 border-t mt-8">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
