import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { uploadBlogFile, type CreateBlogDto } from '@/api/blogs.api';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { FileUpload } from '@/components/shared/FileUpload';
import RichTextEditor from '@/components/shared/RichTextEditor';
import RichTextViewer from '@/components/shared/RichTextViewer';
import { WizardDialog, type WizardStep } from '@/components/shared/WizardDialog';
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  inline?: boolean;
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
  isLoading: isSubmitLoading,
  onSubmit,
  open = true,
  onOpenChange = () => undefined,
  inline = false,
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
  }, [defaultValues, form, initialContent, open]);

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

  const values = form.getValues();

  return (
    <WizardDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if(!val) setStep(1);
      }}
      inline={inline}
      title={mode === 'create' ? 'Create Blog' : 'Edit Blog'}
      description={mode === 'create' ? 'Use the guided steps to craft a new blog post.' : 'Update the blog post using the guided steps.'}
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
                {mode === 'create' ? 'Create Blog' : 'Save Changes'}
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Blog title" 
                        className="h-12 text-lg focus-visible:ring-primary/20"
                      />
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
                    <FormLabel className="text-base font-semibold">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Short summary for the blog"
                        rows={3}
                        className="resize-none focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      This appears before users open the full article.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <FormLabel className="text-base font-semibold">Category</FormLabel>
                        {isAdmin && (
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-primary"
                            onClick={() => setCategoryDialogOpen(true)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            New
                          </Button>
                        )}
                      </div>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="p-2 sticky top-0 bg-popover z-10">
                            <Input
                              placeholder="Search..."
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Hero Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          onUpload={uploadBlogFile}
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

              {isAdmin && (
                <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Category Management</h4>
                      <p className="text-xs text-muted-foreground">Quickly edit or delete categories</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCategoryManager(!showCategoryManager)}
                    >
                      {showCategoryManager ? 'Hide' : 'Manage All'}
                    </Button>
                  </div>
                  
                  {showCategoryManager && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                       {filteredCategories.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 italic">No categories found.</p>
                      ) : (
                        filteredCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg border bg-background group"
                          >
                            <span className="text-sm truncate font-medium">{category.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setEditCategoryName(category.name);
                                }}
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                              <ConfirmDialog
                                title="Delete Category"
                                description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                                onConfirm={() => deleteCategoryMutation.mutate(category.id)}
                                isLoading={deleteCategoryMutation.isPending}
                                trigger={
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                }
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
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

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 max-w-4xl mx-auto">
              <div className="rounded-2xl border bg-primary/5 p-8 border-primary/10 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">Ready to Publish</h3>
                  <p className="text-sm text-muted-foreground text-balance">
                    Review your blog post details below. Everything looks great!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <ReviewBlock title="Core Identity">
                    <ReviewItem label="Title" value={values.title} />
                    <ReviewItem
                      label="Category"
                      value={
                        categories?.find((c) => c.id === values.categoryId)
                          ?.name ?? 'Unassigned'
                      }
                    />
                  </ReviewBlock>
                  
                  <ReviewBlock title="Excerpt Summary">
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      "{values.excerpt}"
                    </p>
                  </ReviewBlock>
                </div>
                
                <div className="space-y-6">
                  <ReviewBlock title="Visual Theme">
                    {values.image ? (
                      <div className="aspect-video relative rounded-lg overflow-hidden border">
                         <img 
                          src={values.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        /> 
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-muted rounded-lg border border-dashed">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </ReviewBlock>
                  
                  <div className="bg-muted/30 rounded-xl p-4 border border-dashed">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Publishing Tip</h4>
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      Double-check your links and headers. You can always edit this post later if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>

      {/* category Dialogs */}
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
    </WizardDialog>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border bg-background p-6 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">{title}</h4>
      {children}
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 border-b border-muted last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
