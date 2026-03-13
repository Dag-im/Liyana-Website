import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FileUpload } from '@/components/shared/FileUpload'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { uploadNewsEventFile, type CreateNewsEventDto } from '@/api/news-events.api'
import type { NewsEventType } from '@/types/news-events.types'
import ContentArrayEditor from './ContentArrayEditor'
import KeyHighlightsEditor from './KeyHighlightsEditor'

const formSchema = z.object({
  type: z.enum(['news', 'event']),
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  mainImage: z.string().min(1, 'Image is required'),
  image1: z.string().min(1, 'Image is required'),
  image2: z.string().min(1, 'Image is required'),
  content: z
    .array(z.string().min(1, 'Paragraph cannot be empty'))
    .min(1, 'At least one paragraph is required'),
  keyHighlights: z.array(z.string().min(1, 'Highlight cannot be empty')).optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  defaultValues?: Partial<CreateNewsEventDto>
  onSubmit: (dto: CreateNewsEventDto) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export default function NewsEventForm({ defaultValues, onSubmit, isLoading, mode }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (defaultValues?.type as NewsEventType) ?? 'news',
      title: defaultValues?.title ?? '',
      date: defaultValues?.date ?? '',
      location: defaultValues?.location ?? '',
      summary: defaultValues?.summary ?? '',
      mainImage: defaultValues?.mainImage ?? '',
      image1: defaultValues?.image1 ?? '',
      image2: defaultValues?.image2 ?? '',
      content: defaultValues?.content?.length ? defaultValues.content : [''],
      keyHighlights: defaultValues?.keyHighlights ?? [],
    },
  })

  useEffect(() => {
    form.reset({
      type: (defaultValues?.type as NewsEventType) ?? 'news',
      title: defaultValues?.title ?? '',
      date: defaultValues?.date ?? '',
      location: defaultValues?.location ?? '',
      summary: defaultValues?.summary ?? '',
      mainImage: defaultValues?.mainImage ?? '',
      image1: defaultValues?.image1 ?? '',
      image2: defaultValues?.image2 ?? '',
      content: defaultValues?.content?.length ? defaultValues.content : [''],
      keyHighlights: defaultValues?.keyHighlights ?? [],
    })
  }, [defaultValues, form])

  const watchType = form.watch('type')

  const handleSubmit = (values: FormValues) => {
    const cleanedHighlights = values.keyHighlights?.filter((item) => item.trim() !== '')
    const payload: CreateNewsEventDto = {
      type: values.type,
      title: values.title,
      date: values.date,
      location: values.type === 'event' ? values.location?.trim() || undefined : undefined,
      summary: values.summary,
      content: values.content,
      keyHighlights: cleanedHighlights && cleanedHighlights.length > 0 ? cleanedHighlights : undefined,
      mainImage: values.mainImage,
      image1: values.image1,
      image2: values.image2,
    }

    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
                disabled={mode === 'edit'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === 'event' ? (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Summary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image</FormLabel>
              <FormControl>
                <FileUpload
                  onUpload={uploadNewsEventFile}
                  onSuccess={field.onChange}
                  currentPath={field.value}
                  label="Upload main image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image 1</FormLabel>
              <FormControl>
                <FileUpload
                  onUpload={uploadNewsEventFile}
                  onSuccess={field.onChange}
                  currentPath={field.value}
                  label="Upload image 1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image 2</FormLabel>
              <FormControl>
                <FileUpload
                  onUpload={uploadNewsEventFile}
                  onSuccess={field.onChange}
                  currentPath={field.value}
                  label="Upload image 2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ContentArrayEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyHighlights"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <KeyHighlightsEditor value={field.value ?? []} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {mode === 'create' ? 'Create Entry' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
