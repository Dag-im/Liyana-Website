import { serviceCategoriesApi } from '@/api/service-categories.api'
import { IconPicker } from '@/components/shared/IconPicker'
import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { handleMutationError } from '@/lib/error-utils'
import { SERVICE_ICON_OPTIONS, getServiceIcon } from '@/lib/service-icons'
import { useCreateServiceCategory } from './useServiceCategories'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  heroImage: z.string().min(1, 'Hero image is required'),
  icon: z.string().min(1, 'Icon is required'),
  attributes: z.array(z.string()).min(1, 'Add at least one attribute'),
  sortOrder: z.number().int().min(0, 'Sort order must be 0 or greater'),
})

type FormData = z.infer<typeof schema>

export function CreateServiceCategoryDialog({
  open,
  onOpenChange,
  inline = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inline?: boolean
}) {
  const createMutation = useCreateServiceCategory()
  const [newAttribute, setNewAttribute] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      tagline: '',
      heroImage: '',
      icon: 'Hospital',
      attributes: [],
      sortOrder: 0,
    },
  })

  const attributes = form.watch('attributes')

  const addAttribute = () => {
    if (newAttribute.trim()) {
      form.setValue('attributes', [...attributes, newAttribute.trim()])
      setNewAttribute('')
    }
  }

  const removeAttribute = (index: number) => {
    form.setValue('attributes', attributes.filter((_, i) => i !== index))
  }

  const onSubmit = (values: FormData) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Service category created')
        onOpenChange(false)
        form.reset()
      },
      onError: handleMutationError,
    })
  }

  const content = (
    <>
        <DialogHeader>
          <DialogTitle>Create Service Category</DialogTitle>
          <DialogDescription>Add a new top-level service grouping.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Specialty Care" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Short catchy phrase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value || 0))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <IconPicker
                          value={field.value}
                          onChange={field.onChange}
                          options={SERVICE_ICON_OPTIONS}
                          getIcon={getServiceIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <FormLabel>Attributes (Highlights)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      placeholder="Add an attribute"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addAttribute}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {attributes.map((attr, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm group"
                      >
                        {attr}
                        <button
                          type="button"
                          onClick={() => removeAttribute(i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {attributes.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No attributes added yet.</p>
                    )}
                  </div>
                  {form.formState.errors.attributes && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.attributes.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="heroImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={serviceCategoriesApi.uploadServiceCategoryFile}
                          onSuccess={field.onChange}
                          currentPath={field.value}
                          label="Upload Hero Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
    </>
  )

  if (inline) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">{content}</DialogContent>
    </Dialog>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
