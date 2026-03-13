import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  uploadNewsEventFile,
  type CreateNewsEventDto,
} from '@/api/news-events.api';
import { FileUpload } from '@/components/shared/FileUpload';
import RichTextEditor from '@/components/shared/RichTextEditor';
import RichTextViewer from '@/components/shared/RichTextViewer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { NewsEventType } from '@/types/news-events.types';
import KeyHighlightsEditor from './KeyHighlightsEditor';

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
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreateNewsEventDto>;
  fixedType?: NewsEventType;
  isLoading: boolean;
  onSubmit: (dto: CreateNewsEventDto) => void;
};

const STEPS = [
  { id: 1, title: 'Details', icon: Info },
  { id: 2, title: 'Images', icon: ImageIcon },
  { id: 3, title: 'Content', icon: FileText },
];

export default function NewsEventWizard({
  mode,
  defaultValues,
  fixedType,
  isLoading,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(1);

  const initialContent = useMemo(() => {
    const content = defaultValues?.content;
    if (!content || content.length === 0) return '';
    return content.join('');
  }, [defaultValues?.content]);

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
  });

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
    });
  }, [defaultValues, fixedType, form, initialContent]);

  const watchType = form.watch('type');
  const contentHtml = form.watch('contentHtml');

  const goNext = async () => {
    const fields: (keyof FormValues)[] =
      step === 1
        ? ['type', 'title', 'date', 'summary', 'location', 'keyHighlights']
        : step === 2
          ? ['mainImage', 'image1', 'image2']
          : ['contentHtml'];

    const isValid = await form.trigger(fields);
    if (isValid) setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (values: FormValues) => {
    const html = values.contentHtml ?? '';
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      form.setError('contentHtml', {
        type: 'manual',
        message: 'Content is required',
      });
      return;
    }
    const cleanedHighlights = values.keyHighlights?.filter(
      (item) => item.trim() !== ''
    );
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
    };

    onSubmit(payload);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mt-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs border-2 transition-colors',
                  step === s.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step > s.id
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-background border-muted text-muted-foreground'
                )}
              >
                {step > s.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wider',
                  step === s.id ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {s.title}
              </span>
            </div>
          ))}
          <div className="absolute top-27 left-[12.5%] right-[12.5%] h-0.5 bg-muted z-0" />
          <div
            className="absolute top-27 left-[12.5%] h-0.5 bg-primary transition-all duration-300 z-0"
            style={{ width: `${(step - 1) * (100 / (STEPS.length - 1))}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form
          className="flex-1 overflow-y-auto p-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label>Live Preview</Label>
                  <div className="min-h-75 rounded-md border bg-muted/20 p-4">
                    <RichTextViewer content={contentHtml} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>

      <div className="border-t p-6 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={step === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {step < STEPS.length ? (
            <Button type="button" onClick={goNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
            >
              {mode === 'create' ? 'Create Entry' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
