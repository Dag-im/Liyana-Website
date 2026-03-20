import { zodResolver } from '@hookform/resolvers/zod'
import { CheckSquare, FileText, Image as ImageIcon, Info, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  uploadNewsEventFile,
  type CreateNewsEventDto,
} from '@/api/news-events.api'
import RichTextEditor from '@/components/shared/RichTextEditor'
import RichTextViewer from '@/components/shared/RichTextViewer'
import { WizardDialog, type WizardStep } from '@/components/shared/WizardDialog';
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
  open?: boolean
  onOpenChange?: (open: boolean) => void
  inline?: boolean
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
  isLoading: isSubmitLoading,
  onSubmit,
  open = true,
  onOpenChange = () => undefined,
  inline = false,
}: Props) {
  const [step, setStep] = useState(1)
  const [showHighlights, setShowHighlights] = useState(false)

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
  }, [defaultValues, fixedType, form, initialContent, open])

  const watchType = form.watch('type')
  const contentHtml = form.watch('contentHtml')

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: ['type', 'title', 'date', 'summary', 'location', 'keyHighlights'],
    2: ['mainImage', 'image1', 'image2'],
    3: ['contentHtml'],
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

  const values = form.getValues()

  return (
    <WizardDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) setStep(1)
      }}
      inline={inline}
      title={watchType === 'event' ? (mode === 'create' ? 'Create Event' : 'Edit Event') : (mode === 'create' ? 'Create News' : 'Edit News')}
      description={watchType === 'event' ? 'Add or update an event entry using the guided steps.' : 'Add or update a news entry using the guided steps.'}
      steps={STEPS as unknown as WizardStep[]}
      currentStep={step}
      onStepClick={(s) => setStep(s)}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {step < STEPS.length ? (
              <Button type="button" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-primary"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isSubmitLoading}
              >
                {isSubmitLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {mode === 'create' ? 'Create Entry' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Type</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        disabled={mode === 'edit' || !!fixedType}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
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
                      <FormLabel className="text-base font-semibold">Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-11 focus-visible:ring-primary/20" />
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
                    <FormLabel className="text-base font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Entry title" 
                        className="h-12 text-lg focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Keep this concise. It appears in cards and listings.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === 'event' && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Event location" 
                          className="h-11 focus-visible:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Short summary for the entry" 
                        rows={3} 
                        className="resize-none focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">A short teaser shown before users open full content.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Key Highlights</h4>
                    <p className="text-xs text-muted-foreground">Optional bullet points for quick scanning</p>
                  </div>
                  <Button
                    onClick={() => setShowHighlights(!showHighlights)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {showHighlights ? 'Hide' : 'Add Highlights'}
                  </Button>
                </div>
                {showHighlights && (
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
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <p className="text-sm text-primary-foreground/80">
                  Upload 3 images to ensure a rich visual experience. The <strong>Main Image</strong> is used for banners.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Main Image (Banner)</FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={uploadNewsEventFile}
                          onSuccess={field.onChange}
                          currentPath={field.value}
                          label="Upload Main Image"
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
                      <FormLabel className="text-base font-semibold">Supporting Image 1</FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={uploadNewsEventFile}
                          onSuccess={field.onChange}
                          currentPath={field.value}
                          label="Upload Image"
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
                      <FormLabel className="text-base font-semibold">Supporting Image 2</FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={uploadNewsEventFile}
                          onSuccess={field.onChange}
                          currentPath={field.value}
                          label="Upload Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[60vh]">
                <div className="flex flex-col space-y-3">
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Content Editor
                  </FormLabel>
                  <div className="flex-1 overflow-hidden rounded-xl border">
                    <RichTextEditor
                      value={contentHtml}
                      onChange={(html) =>
                        form.setValue('contentHtml', html, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                  <FormMessage />
                </div>

                <div className="flex flex-col space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Live Preview
                  </Label>
                  <div className="flex-1 overflow-y-auto rounded-xl border bg-muted/10 p-6 prose prose-sm dark:prose-invert max-w-none">
                    <RichTextViewer content={contentHtml} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 max-w-4xl mx-auto">
              <div className="rounded-2xl border bg-primary/5 p-8 border-primary/10 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">Final Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your {watchType} entry details before publishing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReviewBlock title="Core Information">
                  <ReviewItem label="Type" value={values.type} />
                  <ReviewItem label="Date" value={values.date} />
                  <ReviewItem label="Title" value={values.title} />
                  {values.type === 'event' && (
                    <ReviewItem label="Location" value={values.location || 'Not set'} />
                  )}
                </ReviewBlock>

                <ReviewBlock title="Media Assets">
                  <ReviewItem label="Banner Image" value={values.mainImage ? 'Ready' : 'Missing'} />
                  <ReviewItem label="Supporting 1" value={values.image1 ? 'Ready' : 'Missing'} />
                  <ReviewItem label="Supporting 2" value={values.image2 ? 'Ready' : 'Missing'} />
                </ReviewBlock>
              </div>

              <ReviewBlock title="Summary Teaser">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  "{values.summary || 'No summary entered.'}"
                </p>
              </ReviewBlock>

              {values.keyHighlights && values.keyHighlights.length > 0 && (
                <ReviewBlock title="Key Highlights">
                  <ul className="list-disc space-y-2 pl-5">
                    {values.keyHighlights.map((item, index) => (
                      <li key={`${item}-${index}`} className="text-sm text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </ReviewBlock>
              )}
              
              <div className="bg-muted/30 rounded-xl p-4 border border-dashed flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publishing Tip</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Ensure the images are high quality and the content is free of typos.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">Ctrl</kbd>
                  <span className="text-[10px]">+</span>
                  <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">Enter</kbd>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </WizardDialog>
  )
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border bg-background p-6 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">{title}</h4>
      {children}
    </section>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 border-b border-muted last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground capitalize">{value}</span>
    </div>
  )
}
