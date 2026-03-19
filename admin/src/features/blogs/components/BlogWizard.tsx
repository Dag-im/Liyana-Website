import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { uploadBlogFile, type CreateBlogDto } from '@/api/blogs.api';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { FileUpload } from '@/components/shared/FileUpload';
import RichTextEditor from '@/components/shared/RichTextEditor';
import RichTextViewer from '@/components/shared/RichTextViewer';
import WizardProgress from '@/components/shared/WizardProgress';
import type { WizardStep } from '@/components/shared/WizardProgress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useAuth } from '@/features/auth/useAuth';
import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from '@/features/blogs/useBlogCategories';
import { cn } from '@/lib/utils';
import type { BlogCategory } from '@/types/blogs.types';

const formSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().min(1, 'Image is required'),
  contentHtml: z.string().min(1, 'Content is required'),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreateBlogDto>;
  isLoading: boolean;
  onSubmit: (dto: CreateBlogDto) => void;
};

const STEPS = [
  {
    id: 1,
    title: 'Details',
    description: 'Title, category, and image',
    icon: ImageIcon,
  },
  {
    id: 2,
    title: 'Content',
    description: 'Write and preview',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Review',
    description: 'Final verification',
    icon: CheckSquare,
  },
] as const;

export default function BlogWizard({
  mode,
  defaultValues,
  isLoading,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(1);
  const { data: categories } = useBlogCategories();
  const authQuery = useAuth();
  const isAdmin = authQuery.data?.role === 'ADMIN';
  const createCategoryMutation = useCreateBlogCategory();
  const updateCategoryMutation = useUpdateBlogCategory();
  const deleteCategoryMutation = useDeleteBlogCategory();
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);

  const initialContent = useMemo(
    () => defaultValues?.content ?? '',
    [defaultValues?.content]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      excerpt: defaultValues?.excerpt ?? '',
      categoryId: defaultValues?.categoryId ?? '',
      image: defaultValues?.image ?? '',
      contentHtml: initialContent,
    },
  });

  useEffect(() => {
    form.reset({
      title: defaultValues?.title ?? '',
      excerpt: defaultValues?.excerpt ?? '',
      categoryId: defaultValues?.categoryId ?? '',
      image: defaultValues?.image ?? '',
      contentHtml: initialContent,
    });
  }, [defaultValues, form, initialContent]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const subscription = form.watch((_value, { type }) => {
      if (type !== 'change') return;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDraftSavedAt(new Date());
      }, 450);
    });

    return () => {
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [form]);

  const contentHtml = form.watch('contentHtml');
  const filteredCategories = useMemo(() => {
    if (!categories?.length) return [];
    const query = categorySearch.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      [category.name, category.slug].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [categories, categorySearch]);

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: ['title', 'excerpt', 'categoryId', 'image'],
    2: ['contentHtml'],
  };

  const validateUntil = async (targetStep: number) => {
    if (targetStep <= 1) return true;

    for (let current = 1; current < targetStep; current += 1) {
      const fields = stepFields[current];
      if (!fields?.length) continue;
      const valid = await form.trigger(fields);
      if (!valid) {
        setStep(current);
        return false;
      }
    }

    return true;
  };

  const goNext = async () => {
    const fields = stepFields[step];
    if (fields?.length) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length));
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
      setStep(2);
      return;
    }

    onSubmit({
      title: values.title,
      excerpt: values.excerpt,
      categoryId: values.categoryId,
      image: values.image,
      content: html,
    });
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (step !== 3) return;
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return;
      event.preventDefault();
      void form.handleSubmit(handleSubmit)();
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [form, step]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (step !== 3) return;
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return;
      event.preventDefault();
      void form.handleSubmit(handleSubmit)();
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [form, step]);

  const values = form.getValues();

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">
              Step {step} of {STEPS.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {STEPS.find((item) => item.id === step)?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {draftSavedAt ? (
              <Badge variant="secondary">
                Draft saved {draftSavedAt.toLocaleTimeString()}
              </Badge>
            ) : null}
            <Badge variant="outline">
              {mode === 'create' ? 'New Blog' : 'Editing Blog'}
            </Badge>
          </div>
        </div>
        <WizardProgress
          step={step}
          steps={STEPS as unknown as WizardStep[]}
          onStepClick={(nextStep) => {
            void (async () => {
              const allowed = await validateUntil(nextStep);
              if (allowed) setStep(nextStep);
            })();
          }}
        />
      </div>

      <Form {...form}>
        <form
          className="custom-scrollbar flex-1 overflow-y-auto p-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {step === 1 ? (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Blog title" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Keep this short and descriptive for listing pages.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Short summary for the blog"
                        rows={4}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      This appears before users open the full article.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel>Category</FormLabel>
                      {isAdmin ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCategoryDialogOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          New Category
                        </Button>
                      ) : null}
                    </div>
                    <Input
                      placeholder="Search categories"
                      value={categorySearch}
                      onChange={(event) =>
                        setCategorySearch(event.target.value)
                      }
                    />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category">
                            {categories?.find(
                              (category) => category.id === field.value
                            )?.name ?? 'Select category'}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isAdmin ? (
                      <div className="rounded-lg border border-dashed p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground">
                            Advanced category management
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShowCategoryManager((prev) => !prev)
                            }
                          >
                            {showCategoryManager ? 'Hide' : 'Manage'}
                          </Button>
                        </div>
                        {showCategoryManager ? (
                          <div className="space-y-2">
                            {filteredCategories.length === 0 ? (
                              <p className="text-xs text-muted-foreground">
                                No categories found.
                              </p>
                            ) : (
                              filteredCategories.map((category) => (
                                <div
                                  key={category.id}
                                  className="flex items-center justify-between gap-2 rounded-md border p-2"
                                >
                                  <button
                                    type="button"
                                    className={cn(
                                      'text-left text-sm hover:underline',
                                      field.value === category.id
                                        ? 'font-semibold text-primary'
                                        : ''
                                    )}
                                    onClick={() => field.onChange(category.id)}
                                  >
                                    {category.name}
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-7"
                                      onClick={() => {
                                        setEditingCategory(category);
                                        setEditCategoryName(category.name);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <ConfirmDialog
                                      title="Delete Category"
                                      description="This will permanently delete the blog category."
                                      onConfirm={() =>
                                        deleteCategoryMutation.mutate(
                                          category.id
                                        )
                                      }
                                      isLoading={
                                        deleteCategoryMutation.isPending
                                      }
                                      trigger={
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="text-destructive"
                                          title="Delete"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      }
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Hide low-frequency actions unless needed.
                          </p>
                        )}
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUpload={uploadBlogFile}
                        onSuccess={field.onChange}
                        currentPath={field.value}
                        label="Upload blog image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Dialog
                open={categoryDialogOpen}
                onOpenChange={setCategoryDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Blog Category</DialogTitle>
                    <DialogDescription>
                      Add a new category for blog posts.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Category name"
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      disabled={
                        createCategoryMutation.isPending ||
                        newCategoryName.trim().length < 2
                      }
                      onClick={() => {
                        const name = newCategoryName.trim();
                        createCategoryMutation.mutate(name, {
                          onSuccess: (category) => {
                            setCategoryDialogOpen(false);
                            setNewCategoryName('');
                            form.setValue('categoryId', category.id, {
                              shouldValidate: true,
                            });
                          },
                        });
                      }}
                    >
                      Create Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog
                open={!!editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Blog Category</DialogTitle>
                    <DialogDescription>
                      Update the category name.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={editCategoryName}
                    onChange={(event) =>
                      setEditCategoryName(event.target.value)
                    }
                    placeholder="Category name"
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      disabled={
                        updateCategoryMutation.isPending ||
                        editCategoryName.trim().length < 2
                      }
                      onClick={() => {
                        if (!editingCategory) return;
                        const name = editCategoryName.trim();
                        updateCategoryMutation.mutate(
                          { id: editingCategory.id, name },
                          { onSuccess: () => setEditingCategory(null) }
                        );
                      }}
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : null}

          {step === 2 ? (
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
                    <p className="text-xs text-muted-foreground">
                      Use headers and short paragraphs for easier scanning.
                    </p>
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

          {step === 3 ? (
            <div className="space-y-5">
              <div className="rounded-xl border bg-muted/20 p-4">
                <h3 className="mb-2 text-sm font-semibold">Review before save</h3>
                <p className="text-xs text-muted-foreground">
                  Confirm the values below. You can navigate back to edit.
                </p>
              </div>
              <ReviewBlock title="General">
                <ReviewItem label="Title" value={values.title} />
                <ReviewItem
                  label="Category"
                  value={
                    categories?.find((category) => category.id === values.categoryId)
                      ?.name ?? 'Unassigned'
                  }
                />
                <ReviewItem
                  label="Hero image"
                  value={values.image ? 'Added' : 'Missing'}
                />
              </ReviewBlock>
              <ReviewBlock title="Excerpt">
                <p className="text-sm">{values.excerpt}</p>
              </ReviewBlock>
              <ReviewBlock title="Keyboard Shortcut">
                <p className="text-xs text-muted-foreground">
                  Press{' '}
                  <kbd className="rounded border bg-background px-1.5 py-0.5 text-[11px]">
                    Ctrl/Cmd + Enter
                  </kbd>{' '}
                  to submit from this step.
                </p>
              </ReviewBlock>
            </div>
          ) : null}
        </form>
      </Form>

      <div className="border-t p-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
          >
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
              {mode === 'create' ? 'Create Blog' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 rounded-xl border border-border/80 bg-background p-4">
      <h4 className="text-sm font-semibold">{title}</h4>
      {children}
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
