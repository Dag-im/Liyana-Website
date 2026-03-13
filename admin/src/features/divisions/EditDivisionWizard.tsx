import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/shared/FileUpload';
import { FileImage } from '@/components/shared/FileImage';
import { useServiceCategories } from '@/features/service-categories/useServiceCategories';
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories';
import { divisionsApi } from '@/api/divisions.api';
import { useUpdateDivision, useDivision } from './useDivisions';
import { Loader2, Plus, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  logo: z.string().optional(),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  description: z.array(z.string()).min(1, 'At least one paragraph is required'),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    googleMap: z.string().url().optional().or(z.literal('')),
  }).optional(),
  coreServices: z.array(z.object({
    name: z.string().min(1, 'Service name is required'),
  })).optional(),
  stats: z.array(z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.string().min(1, 'Value is required'),
  })).optional(),
  images: z.array(z.object({
    path: z.string().min(1),
  })).optional(),
});

type DivisionFormData = z.infer<typeof divisionSchema>;

interface EditDivisionWizardProps {
  divisionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDivisionWizard({ divisionId, open, onOpenChange }: EditDivisionWizardProps) {
  const [step, setStep] = useState(1);
  const { data: division, isLoading: isFetching } = useDivision(divisionId);
  const updateMutation = useUpdateDivision(divisionId);
  const { data: serviceCategories } = useServiceCategories({ perPage: 100 });
  const { data: divisionCategories } = useDivisionCategories();

  const form = useForm<DivisionFormData>({
    resolver: zodResolver(divisionSchema) as any,
    defaultValues: {
      name: '',
      shortName: '',
      location: '',
      serviceCategoryId: '',
      divisionCategoryId: '',
      isActive: true,
      logo: '',
      overview: '',
      description: [''],
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
    if (division) {
      form.reset({
        name: division.name,
        shortName: division.shortName,
        location: division.location || '',
        serviceCategoryId: division.serviceCategoryId,
        divisionCategoryId: division.divisionCategoryId,
        isActive: division.isActive,
        logo: division.logo || '',
        overview: division.overview,
        description: (division.description && division.description.length > 0) ? division.description : [''],
        contact: {
          phone: division.contact?.phone || '',
          email: division.contact?.email || '',
          address: division.contact?.address || '',
          googleMap: division.contact?.googleMap || '',
        },
        coreServices: division.coreServices?.map(s => ({ name: s.name })) || [],
        stats: division.stats?.map(s => ({ label: s.label, value: s.value })) || [],
        images: division.images?.map(img => ({ path: img.path })) || [],
      });
    }
  }, [division, form, open]);

  const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
    control: form.control,
    name: 'description' as any,
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: 'coreServices',
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control: form.control,
    name: 'stats',
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const handleNext = async () => {
    const fieldsToValidate: any = {
      1: ['name', 'shortName', 'serviceCategoryId', 'divisionCategoryId'],
      2: ['overview', 'description'],
      4: ['contact.email', 'contact.googleMap'],
    };

    const targetFields = fieldsToValidate[step] || [];
    const isValid = await form.trigger(targetFields);
    
    if (isValid) {
      if (step < 4) setStep(step + 1);
      else form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = (values: DivisionFormData) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Division updated successfully!');
        onOpenChange(false);
        setStep(1);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setStep(1);
    }}>
      <DialogContent className="sm:max-w-[700px] gap-0 p-0 overflow-hidden">
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-6 border-b bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <DialogTitle className="text-xl">Edit Division</DialogTitle>
                <DialogDescription>
                  Update division profiles.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-1">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-colors",
                      step >= s.id ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            {isFetching && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[2px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Form {...form}>
              <form className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control= {form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division Name</FormLabel>
                            <FormControl><Input placeholder="Cardiology Center" {...field} /></FormControl>
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
                            <FormControl><Input placeholder="Cardio" {...field} /></FormControl>
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
                              <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {serviceCategories?.data.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
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
                            <FormLabel>Division Group</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select Group" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {divisionCategories?.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
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
                          <FormLabel>Primary Location</FormLabel>
                          <FormControl><Input placeholder="Block A, Ground Floor" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <p className="text-xs text-muted-foreground">Make this division visible to the public</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <FormField
                      control={form.control}
                      name="overview"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division Overview</FormLabel>
                          <FormControl><Textarea placeholder="Brief summary of the division..." className="min-h-[100px]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel>Detailed Description Paragraphs</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendDesc("")}>
                          <Plus className="h-4 w-4 mr-2" /> Add Paragraph
                        </Button>
                      </div>
                      {descFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 group">
                          <FormField
                            control={form.control}
                            name={`description.${index}` as any}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Textarea placeholder="More details..." {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => index > 0 && removeDesc(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division Logo</FormLabel>
                          <FormControl>
                            <FileUpload
                              onUpload={divisionsApi.uploadDivisionFile}
                              onSuccess={field.onChange}
                              currentPath={field.value}
                              label="Upload Logo"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <FormLabel>Gallery Images</FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imageFields.map((field, index) => (
                          <div key={field.id} className="relative aspect-square rounded-xl overflow-hidden border group bg-muted">
                            <FileImage path={field.path} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeImage(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="aspect-square">
                          <FileUpload
                            onUpload={divisionsApi.uploadDivisionFile}
                            onSuccess={(path) => appendImage({ path })}
                            label="Add Gallery"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl><Input placeholder="+251..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl><Input placeholder="division@liyana.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <FormLabel>Core Services</FormLabel>
                              <Button type="button" variant="outline" size="sm" onClick={() => appendService({ name: '' })}>
                                <Plus className="h-3 w-3" />
                              </Button>
                           </div>
                           <div className="space-y-2">
                              {serviceFields.map((f, i) => (
                                <div key={f.id} className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name={`coreServices.${i}.name`}
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormControl><Input placeholder="Service name..." {...field} /></FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeService(i)}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <FormLabel>Statistics</FormLabel>
                              <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ label: '', value: '' })}>
                                <Plus className="h-3 w-3" />
                              </Button>
                           </div>
                           <div className="space-y-2">
                              {statFields.map((f, i) => (
                                <div key={f.id} className="flex gap-2">
                                   <div className="grid grid-cols-2 gap-1 flex-1">
                                      <FormField
                                        control={form.control}
                                        name={`stats.${i}.label`}
                                        render={({ field }) => <FormControl><Input placeholder="Label" {...field} /></FormControl>}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`stats.${i}.value`}
                                        render={({ field }) => <FormControl><Input placeholder="Value" {...field} /></FormControl>}
                                      />
                                   </div>
                                   <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(i)}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                              ))}
                           </div>
                        </div>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="button" onClick={handleNext} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : step === 4 ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  {step === 4 ? 'Save All Changes' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
