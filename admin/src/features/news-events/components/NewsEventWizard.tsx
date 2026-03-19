import { zodResolver } from '@hookform/resolvers/zod'
import { CheckSquare, FileText, Image as ImageIcon, Info, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  uploadNewsEventFile,
  type CreateNewsEventDto,
} from '@/api/news-events.api'
import RichTextEditor from '@/components/shared/RichTextEditor'
import RichTextViewer from '@/components/shared/RichTextViewer'
import WizardProgress from '@/components/shared/WizardProgress'
import type { WizardStep } from '@/components/shared/WizardProgress'
import { Badge } from '@/components/ui/badge'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { NewsEventType } from '@/types/news-events.types'
import KeyHighlightsEditor from './KeyHighlightsEditor'
import { FileUpload } from '@/components/shared/FileUpload'

const formSchema = z.object({
  type: z.enum(['news', 'event']),
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  keyHighlights: z
    .array(z.string().min(1, 'Highlight cannot be empty'))
    .optional(),
  mainImage: z.string().min(1, 'Image is required'),
  image1: z.string().min(1, 'Image is required'),
  image2: z.string().min(1, 'Image is required'),
  contentHtml: z.string().min(1, 'Content is required'),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  mode: 'create' | 'edit'
  defaultValues?: Partial<CreateNewsEventDto>
  fixedType?: NewsEventType
  isLoading: boolean
  onSubmit: (dto: CreateNewsEventDto) => void
}

const STEPS = [
  {
    id: 1,
    title: 'Details',
    description: 'Core event information',
    icon: Info,
  },
  {
    id: 2,
    title: 'Images',
    description: 'Main and support media',
    icon: ImageIcon,
  },
  {
    id: 3,
    title: 'Content',
    description: 'Write and preview body',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Review',
    description: 'Validate before publish',
    icon: CheckSquare,
  },
] as const

export default function NewsEventWizard({
  mode,
  defaultValues,
  fixedType,
  isLoading,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(1)
  const [showHighlights, setShowHighlights] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null)

  const initialContent = useMemo(() => {
    const content = defaultValues?.content
    if (!content || content.length === 0) return ''
    return content.join('')
  }, [defaultValues?.content])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: fixedType ?? (defaultValues?.type as NewsEventType) ?? 'news',
      title: defaultValues?.title ?? '',
      date: defaultValues?.date ?? '',
      location: defaultValues?.location ?? '',
      summary: defaultValues?.summary ?? '',
      keyHighlights: defaultValues?.keyHighlights ?? [],
      mainImage: defaultValues?.mainImage ?? '',
      image1: defaultValues?.image1 ?? '',
      image2: defaultValues?.image2 ?? '',
      contentHtml: initialContent,
    },
  })

  useEffect(() => {
    form.reset({
      type: fixedType ?? (defaultValues?.type as NewsEventType) ?? 'news',
      title: defaultValues?.title ?? '',
      date: defaultValues?.date ?? '',
      location: defaultValues?.location ?? '',
      summary: defaultValues?.summary ?? '',
      keyHighlights: defaultValues?.keyHighlights ?? [],
      mainImage: defaultValues?.mainImage ?? '',
      image1: defaultValues?.image1 ?? '',
      image2: defaultValues?.image2 ?? '',
      contentHtml: initialContent,
    })
  }, [defaultValues, fixedType, form, initialContent])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    const subscription = form.watch((_value, { type }) => {
      if (type !== 'change') return
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        setDraftSavedAt(new Date())
      }, 450)
    })

    return () => {
      subscription.unsubscribe()
      if (timeout) clearTimeout(timeout)
    }
  }, [form])

  const watchType = form.watch('type')
  const contentHtml = form.watch('contentHtml')

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: ['type', 'title', 'date', 'summary', 'location', 'keyHighlights'],
    2: ['mainImage', 'image1', 'image2'],
    3: ['contentHtml'],
  }

  const validateStep = async (targetStep: number) => {
    if (targetStep <= 1) return true

    for (let current = 1; current < targetStep; current += 1) {
      const fields = stepFields[current]
      if (!fields?.length) continue

      const valid = await form.trigger(fields)
      if (!valid) {
        setStep(current)
        return false
      }
    }

    return true
  }

  const handleSubmit = (values: FormValues) => {
    const html = values.contentHtml ?? ''
    const plainText = html.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      form.setError('contentHtml', {
        type: 'manual',
        message: 'Content is required',
      })
      setStep(3)
      return
    }

    const cleanedHighlights = values.keyHighlights?.filter(
      (item) => item.trim() !== ''
    )
    const payload: CreateNewsEventDto = {
      type: values.type,
      title: values.title,
      date: values.date,
      location:
        values.type === 'event'
          ? values.location?.trim() || undefined
          : undefined,
      summary: values.summary,
      content: [html],
      keyHighlights:
        cleanedHighlights && cleanedHighlights.length > 0
          ? cleanedHighlights
          : undefined,
      mainImage: values.mainImage,
      image1: values.image1,
      image2: values.image2,
    }

    onSubmit(payload)
  }

  const goNext = async () => {
    const fields = stepFields[step]
    if (fields?.length) {
      const isValid = await form.trigger(fields)
      if (!isValid) return
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length))
  }

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1))

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (step !== 4) return
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return
      event.preventDefault()
      void form.handleSubmit(handleSubmit)()
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [form, step])

  const values = form.getValues()

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Step {step} of {STEPS.length}</p>
            <p className="text-xs text-muted-foreground">
              {STEPS.find((item) => item.id === step)?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {draftSavedAt ? (
              <Badge variant="secondary">Draft saved {draftSavedAt.toLocaleTimeString()}</Badge>
            ) : null}
            <Badge variant="outline">{mode === 'create' ? 'New Entry' : 'Editing Entry'}</Badge>
          </div>
        </div>
        <WizardProgress
          step={step}
          steps={STEPS as unknown as WizardStep[]}
          onStepClick={(nextStep) => {
            void (async () => {
              const allowed = await validateStep(nextStep)
              if (allowed) setStep(nextStep)
            })()
          }}
        />
      </div>

      <Form {...form}>
        <form
          className="custom-scrollbar flex-1 overflow-y-auto p-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        disabled={mode === 'edit' || !!fixedType}
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
                      <p className="text-xs text-muted-foreground">Controls whether location is required in public UI.</p>
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
                      <p className="text-xs text-muted-foreground">Set the primary publication or event date.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Keep this concise. It appears in cards and listings.</p>
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
                      <Textarea {...field} placeholder="Summary" rows={4} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">A short teaser shown before users open full content.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-dashed p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Optional highlights</p>
                  <Button
                    onClick={() => setShowHighlights((prev) => !prev)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {showHighlights ? 'Hide' : 'Add Highlights'}
                  </Button>
                </div>
                {showHighlights ? (
                  <FormField
                    control={form.control}
                    name="keyHighlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <KeyHighlightsEditor
                            value={field.value ?? []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Add bullet highlights only when they add value to the announcement.</p>
                )}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload 3 images to ensure consistent layout in cards and detail pages.</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label>Content Editor</Label>
                  <RichTextEditor
                    value={contentHtml}
                    onChange={(html) =>
                      form.setValue('contentHtml', html, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    minHeight={320}
                  />
                  {form.formState.errors.contentHtml?.message ? (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.contentHtml.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Use concise headings and short paragraphs for readability.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Live Preview</Label>
                  <div className="min-h-75 rounded-md border bg-muted/20 p-4">
                    <RichTextViewer content={contentHtml} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <div className="rounded-xl border bg-muted/20 p-4">
                <h3 className="mb-2 text-sm font-semibold">Ready to submit</h3>
                <p className="text-xs text-muted-foreground">
                  Review critical fields below. You can click any previous step to edit before submitting.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ReviewBlock title="General">
                  <ReviewItem label="Type" value={values.type} />
                  <ReviewItem label="Date" value={values.date} />
                  <ReviewItem label="Title" value={values.title} />
                  <ReviewItem label="Location" value={values.location || 'Not set'} />
                </ReviewBlock>

                <ReviewBlock title="Media">
                  <ReviewItem label="Main image" value={values.mainImage ? 'Added' : 'Missing'} />
                  <ReviewItem label="Image 1" value={values.image1 ? 'Added' : 'Missing'} />
                  <ReviewItem label="Image 2" value={values.image2 ? 'Added' : 'Missing'} />
                </ReviewBlock>
              </div>

              <ReviewBlock title="Summary">
                <p className="text-sm text-foreground">{values.summary || 'No summary entered.'}</p>
              </ReviewBlock>

              <ReviewBlock title="Highlights">
                {(values.keyHighlights ?? []).length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {(values.keyHighlights ?? []).map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No highlights added.</p>
                )}
              </ReviewBlock>

              <ReviewBlock title="Keyboard Shortcut">
                <p className="text-xs text-muted-foreground">Press <kbd className="rounded border bg-background px-1.5 py-0.5 text-[11px]">Ctrl/Cmd + Enter</kbd> to submit from this step.</p>
              </ReviewBlock>
            </div>
          ) : null}
        </form>
      </Form>

      <div className="border-t p-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1}>
            Back
          </Button>
          {step < STEPS.length ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {mode === 'create' ? 'Create Entry' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 rounded-xl border border-border/80 bg-background p-4">
      <h4 className="text-sm font-semibold">{title}</h4>
      {children}
    </section>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
