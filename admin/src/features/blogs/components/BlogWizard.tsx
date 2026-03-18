import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Plus,
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
  { id: 1, title: 'Details', icon: ImageIcon },
  { id: 2, title: 'Content', icon: FileText },
];

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

  const goNext = async () => {
    const fields: (keyof FormValues)[] =
      step === 1
        ? ['title', 'excerpt', 'categoryId', 'image']
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

    onSubmit({
      title: values.title,
      excerpt: values.excerpt,
      categoryId: values.categoryId,
      image: values.image,
      content: html,
    });
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
          <div className="absolute top-27 left-[25%] right-[25%] h-0.5 bg-muted z-0" />
          <div
            className="absolute top-27 left-[25%] h-0.5 bg-primary transition-all duration-300 z-0"
            style={{ width: `${(step - 1) * 100}%` }}
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Blog title" />
                    </FormControl>
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
                      />
                    </FormControl>
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
                      <div className="rounded-md border p-2 space-y-2">
                        {filteredCategories.length === 0 ? (
                          <p className="text-xs text-muted-foreground">
                            No categories found.
                          </p>
                        ) : (
                          filteredCategories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center justify-between gap-2"
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
                                    deleteCategoryMutation.mutate(category.id)
                                  }
                                  isLoading={deleteCategoryMutation.isPending}
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
          )}

          {step === 2 && (
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
              {mode === 'create' ? 'Create Blog' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
