import { divisionsApi } from '@/api/divisions.api';
import { FileUpload } from '@/components/shared/FileUpload';
import RichTextEditor from '@/components/shared/RichTextEditor';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WizardDialog, type WizardStep } from '@/components/shared/WizardDialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories';
import { useServiceCategories } from '@/features/service-categories/useServiceCategories';
import { useTempUploadSession } from '@/lib/temp-upload-session';
import { getUploadUrl } from '@/lib/upload-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, type FieldPath } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useDivision, useUpdateDivision } from './useDivisions';

const STEPS = [
  { id: 1, title: 'Basics', description: 'Core identity' },
  { id: 2, title: 'Content', description: 'Division overview' },
  { id: 3, title: 'Media', description: 'Logo and Gallery' },
  { id: 4, title: 'Contact & Extra', description: 'Phone, Services' },
];

const divisionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  shortName: z.string().min(2, 'Short name must be at least 2 characters'),
  location: z.string().optional(),
  serviceCategoryId: z.string().min(1, 'Service category is required'),
  divisionCategoryId: z.string().min(1, 'Division category is required'),
  isActive: z.boolean().default(true),
  requiresMedicalTeam: z.boolean().default(false),
  logo: z.string().optional(),
  groupPhoto: z.string().optional(),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  description: z.string().min(1, 'Description is required'),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      address: z.string().optional(),
      googleMap: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
  coreServices: z
    .array(
      z.object({
        name: z.string().min(1, 'Service name is required'),
      })
    )
    .optional(),
  stats: z
    .array(
      z.object({
        label: z.string().min(1, 'Label is required'),
        value: z.string().min(1, 'Value is required'),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        path: z.string().min(1),
      })
    )
    .optional(),
});

type DivisionFormData = z.input<typeof divisionSchema>;

interface EditDivisionWizardProps {
  divisionId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  inline?: boolean;
}

export function EditDivisionWizard({
  divisionId,
  open,
  onOpenChange,
  inline = false,
}: EditDivisionWizardProps) {
  const [step, setStep] = useState(1);
  const { data: division, isLoading: isFetching } = useDivision(divisionId);
  const updateMutation = useUpdateDivision(divisionId);
  const { data: serviceCategories } = useServiceCategories({ perPage: 100 });
  const { data: divisionCategories } = useDivisionCategories();
  const tempUploads = useTempUploadSession();

  const form = useForm<DivisionFormData>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: '',
      shortName: '',
      location: '',
      serviceCategoryId: '',
      divisionCategoryId: '',
      isActive: true,
      requiresMedicalTeam: false,
      logo: '',
      groupPhoto: '',
      overview: '',
      description: '',
      contact: {
        phone: '',
        email: '',
        address: '',
        googleMap: '',
      },
      coreServices: [],
      stats: [],
      images: [],
    },
  });

  useEffect(() => {
    if (division && open) {
      form.reset({
        name: division.name,
        shortName: division.shortName,
        location: division.location || '',
        serviceCategoryId: division.serviceCategoryId,
        divisionCategoryId: division.divisionCategoryId,
        isActive: division.isActive,
        requiresMedicalTeam: division.requiresMedicalTeam ?? false,
        logo: division.logo || '',
        groupPhoto: division.groupPhoto || '',
        overview: division.overview,
        description: division.description ?? '',
        contact: {
          phone: division.contact?.phone || '',
          email: division.contact?.email || '',
          address: division.contact?.address || '',
          googleMap: division.contact?.googleMap || '',
        },
        coreServices:
          division.coreServices?.map((s) => ({ name: s.name })) || [],
        stats:
          division.stats?.map((s) => ({ label: s.label, value: s.value })) ||
          [],
        images: division.images?.map((img) => ({ path: img.path })) || [],
      });
    }
  }, [division, form, open]);

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: 'coreServices',
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control: form.control,
    name: 'stats',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const handleNext = async () => {
    const fieldsToValidate: Record<number, FieldPath<DivisionFormData>[]> = {
      1: ['name', 'shortName', 'serviceCategoryId', 'divisionCategoryId'],
      2: ['overview', 'description'],
      4: ['contact.email', 'contact.googleMap'],
    };

    const targetFields = fieldsToValidate[step] || [];
    const isValid = await form.trigger(targetFields);

    if (isValid) {
      if (step < STEPS.length) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = (values: DivisionFormData) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        tempUploads.clear();
        toast.success('Division updated successfully!');
        onOpenChange?.(false);
        setStep(1);
      },
    });
  };

  return (
    <WizardDialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          void tempUploads.releaseAll({ silent: true });
        }
        onOpenChange?.(val);
        if (!val) setStep(1);
      }}
      inline={inline}
      title="Edit Division"
      description={`Updating ${division?.name || 'Division'}`}
      steps={STEPS as unknown as WizardStep[]}
      currentStep={step}
      onStepClick={(s) => setStep(s)}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            disabled={step === 1}
            onClick={handleBack}
            variant="outline"
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              disabled={updateMutation.isPending}
              onClick={() => onOpenChange?.(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            {step < STEPS.length ? (
              <Button onClick={handleNext}>Next Step</Button>
            ) : (
              <Button disabled={updateMutation.isPending || isFetching} onClick={form.handleSubmit(onSubmit)}>
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Form {...form}>
          <form className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Division Name" />
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
                          <Input {...field} placeholder="e.g. CARD" />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceCategories?.data.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.title}
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
                    name="divisionCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisionCategories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.label}
                              </SelectItem>
                            ))}
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
                        <Input {...field} placeholder="Building, Floor, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Status
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Make this division visible to the public
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requires Medical Team</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Enable to allow doctor management for this division
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="requiresMedicalTeam"
                    render={({ field }) => (
                      <Switch
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                <FormField
                  control={form.control}
                  name="overview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief overview of the division"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Write a detailed description of this division..."
                          minHeight={300}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Logo</FormLabel>
                      <FormControl>
                        <FileUpload
                          currentPath={field.value}
                          onSuccess={field.onChange}
                          onUploadedAsset={tempUploads.registerUpload}
                          onUpload={divisionsApi.uploadDivisionFile}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Group Photo</FormLabel>
                      <FormControl>
                        <FileUpload
                          currentPath={field.value}
                          onSuccess={field.onChange}
                          onUploadedAsset={tempUploads.registerUpload}
                          onUpload={divisionsApi.uploadDivisionFile}
                          label="Upload Group Photo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-4 border-t">
                  <FormLabel className="text-lg font-semibold">Gallery Images</FormLabel>
                  <div className="grid grid-cols-4 gap-4">
                    {imageFields.map((field, index) => (
                      <div
                        className="relative aspect-video rounded-lg border overflow-hidden group"
                        key={field.id}
                      >
                        <img
                          alt={`Gallery ${index}`}
                          className="h-full w-full object-cover"
                          src={getUploadUrl(field.path)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button
                            onClick={() => {
                              void tempUploads.releaseUploadByPath(field.path, {
                                silent: true,
                              });
                              removeImage(index);
                            }}
                            size="icon"
                            type="button"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="aspect-video">
                      <FileUpload
                        label="Add Image"
                        onSuccess={(path) => appendImage({ path })}
                        onUploadedAsset={tempUploads.registerUpload}
                        onUpload={divisionsApi.uploadDivisionFile}
                        currentPath={imageFields[imageFields.length - 1]?.path}
                        showPreview
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-semibold">Core Services</FormLabel>
                    <Button
                      onClick={() => appendService({ name: '' })}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceFields.map((field, index) => (
                      <div
                        className="relative p-4 rounded-xl border bg-card space-y-3 group"
                        key={field.id}
                      >
                        <FormField
                          control={form.control}
                          name={`coreServices.${index}.name`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...inputField}
                                  placeholder="Service Name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeService(index)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-semibold">Division Statistics</FormLabel>
                    <Button
                      onClick={() => appendStat({ label: '', value: '' })}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stat
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {statFields.map((field, index) => (
                      <div
                        className="relative p-4 rounded-xl border bg-card space-y-3 group"
                        key={field.id}
                      >
                        <FormField
                          control={form.control}
                          name={`stats.${index}.value`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...inputField}
                                  placeholder="Value (e.g. 100+)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`stats.${index}.label`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...inputField}
                                  placeholder="Label (e.g. Patients)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeStat(index)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <FormLabel className="text-lg font-semibold">Contact Details</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+251..." />
                          </FormControl>
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
                          <FormControl>
                            <Input {...field} placeholder="division@liyana.com" />
                          </FormControl>
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
                        <FormLabel>Google Map URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://maps.google.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </WizardDialog>
  );
}
