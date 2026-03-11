import { divisionsApi } from '@/api/divisions.api';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useDivisionCategories } from '@/features/division-categories/useDivisionCategories';
import { useServiceCategories } from '@/features/service-categories/useServiceCategories';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getUploadUrl } from '@/lib/upload-utils';
import { handleMutationError } from '@/lib/error-utils';
import { useCreateDivision } from './useDivisions';

const STEPS = [
  { id: 1, title: 'Overview', icon: Info },
  { id: 2, title: 'Content', icon: FileText },
  { id: 3, title: 'Media', icon: ImageIcon },
  { id: 4, title: 'Stats', icon: BarChart },
  { id: 5, title: 'Doctors', icon: Users },
];

export function CreateDivisionWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const createMutation = useCreateDivision();
  const { data: serviceCategories } = useServiceCategories({ perPage: 100 });
  const { data: divisionCategories } = useDivisionCategories();
  const [uploadKey, setUploadKey] = useState(0);

  const [formData, setFormData] = useState<any>({
    name: '',
    shortName: '',
    slug: '',
    location: '',
    overview: '',
    description: [''],
    logo: '',
    isActive: true,
    serviceCategoryId: '',
    divisionCategoryId: '',
    contact: {
      phone: '',
      email: '',
      googleMap: '',
    },
    images: [],
    coreServices: [],
    stats: [],
    doctors: [],
  });

  // Helper to update deeply nested fields
  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData((prev: any) => {
      const next = { ...prev };
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleNext = () => step < 5 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const onSubmit = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Division created successfully');
        onOpenChange(false);
        resetWizard();
      },
      onError: handleMutationError,
    });
  };

  const resetWizard = () => {
    setStep(1);
    // Actually should reset formData too but keeping it simple for now
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Create New Division</DialogTitle>
          <DialogDescription>
            Complete the 5 steps to establish a new medical division.
          </DialogDescription>

          <div className="flex items-center justify-between mt-6">
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
            <div className="absolute top-27 left-[10%] right-[10%] h-0.5 bg-muted z-0" />
            <div
              className="absolute top-27 left-[10%] h-0.5 bg-primary transition-all duration-300 z-0"
              style={{ width: `${(step - 1) * 20}%` }}
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Division Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        name: val,
                        slug: val.toLowerCase().replace(/\s+/g, '-'),
                      });
                    }}
                    placeholder="e.g. Cardiology Unit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Name / Abbreviation</Label>
                  <Input
                    value={formData.shortName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, shortName: e.target.value })
                    }
                    placeholder="e.g. CARD"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Category</Label>
                  <Select
                    value={formData.serviceCategoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, serviceCategoryId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories?.data.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Division Category</Label>
                  <Select
                    value={formData.divisionCategoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, divisionCategoryId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Division Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisionCategories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Floor 3, Block B"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateNested('contact.phone', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={formData.contact.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateNested('contact.email', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Google Maps URL</Label>
                  <Input
                    value={formData.contact.googleMap}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateNested('contact.googleMap', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <Label>Overview (Brief)</Label>
                <Textarea
                  value={formData.overview}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, overview: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Detailed Description Paragraphs</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        description: [...formData.description, ''],
                      })
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                  </Button>
                </div>
                {formData.description.map((p: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      value={p}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const next = [...formData.description];
                        next[i] = e.target.value;
                        setFormData({ ...formData, description: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const next = formData.description.filter(
                          (_: any, idx: number) => idx !== i
                        );
                        setFormData({ ...formData, description: next });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Core Services</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        coreServices: [
                          ...formData.coreServices,
                          { name: '', description: '' },
                        ],
                      })
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Service
                  </Button>
                </div>
                {formData.coreServices.map((s: any, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-2 p-3 border rounded-lg relative"
                  >
                    <Input
                      placeholder="Service Name"
                      value={s.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const next = [...formData.coreServices];
                        next[i].name = e.target.value;
                        setFormData({ ...formData, coreServices: next });
                      }}
                    />
                    <Input
                      placeholder="Brief Description"
                      value={s.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const next = [...formData.coreServices];
                        next[i].description = e.target.value;
                        setFormData({ ...formData, coreServices: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border"
                      onClick={() => {
                        const next = formData.coreServices.filter(
                          (_: any, idx: number) => idx !== i
                        );
                        setFormData({ ...formData, coreServices: next });
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <Label>Logo</Label>
                <FileUpload
                  onUpload={divisionsApi.uploadDivisionFile}
                  onSuccess={(path) => setFormData({ ...formData, logo: path })}
                  currentPath={formData.logo}
                />
              </div>
              <div className="space-y-2 border-t pt-4">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((img: any, i: number) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden border relative"
                    >
                      <img
                        src={getUploadUrl(img.path)}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => {
                          const next = formData.images.filter(
                            (_: any, idx: number) => idx !== i
                          );
                          setFormData({ ...formData, images: next });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="aspect-video">
                    <FileUpload
                      key={uploadKey}
                      onUpload={divisionsApi.uploadDivisionFile}
                      onSuccess={(path) => {
                        setFormData({
                          ...formData,
                          images: [...formData.images, { path, alt: '' }],
                        });
                        setUploadKey((prev) => prev + 1);
                      }}
                      label="Add Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <Label>Division Statistics</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      stats: [...formData.stats, { label: '', value: '' }],
                    })
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Stat
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.stats.map((s: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg relative flex flex-col gap-2"
                  >
                    <Input
                      placeholder="Label (e.g. Happy Patients)"
                      value={s.label}
                      onChange={(e) => {
                        const next = [...formData.stats];
                        next[i].label = e.target.value;
                        setFormData({ ...formData, stats: next });
                      }}
                    />
                    <Input
                      placeholder="Value (e.g. 5000+)"
                      value={s.value}
                      onChange={(e) => {
                        const next = [...formData.stats];
                        next[i].value = e.target.value;
                        setFormData({ ...formData, stats: next });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => {
                        const next = formData.stats.filter(
                          (_: any, idx: number) => idx !== i
                        );
                        setFormData({ ...formData, stats: next });
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                {formData.stats.length === 0 && (
                  <p className="col-span-2 text-center text-sm text-muted-foreground py-10 bg-muted/20 border-dashed border rounded-xl">
                    No stats added yet. Add metrics like "10+ Specialized
                    Doctors".
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <Label>Medical Team (Doctors)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      doctors: [
                        ...formData.doctors,
                        {
                          name: '',
                          specialty: '',
                          image: '',
                          availability: 'Available during business hours',
                        },
                      ],
                    })
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Doctor
                </Button>
              </div>
              <div className="space-y-4">
                {formData.doctors.map((doc: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 border rounded-xl grid grid-cols-3 gap-4 relative bg-muted/5"
                  >
                    <div className="col-span-1">
                      <FileUpload
                        onUpload={divisionsApi.uploadDivisionFile}
                        onSuccess={(path) => {
                          const next = [...formData.doctors];
                          next[i].image = path;
                          setFormData({ ...formData, doctors: next });
                        }}
                        currentPath={doc.image}
                        label="Doctor Photo"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Input
                        placeholder="Doctor Name"
                        value={doc.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const next = [...formData.doctors];
                          next[i].name = e.target.value;
                          setFormData({ ...formData, doctors: next });
                        }}
                      />
                      <Input
                        placeholder="Specialty"
                        value={doc.specialty}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const next = [...formData.doctors];
                          next[i].specialty = e.target.value;
                          setFormData({ ...formData, doctors: next });
                        }}
                      />
                      <Input
                        placeholder="Availability (e.g. Mon-Fri, 9AM-5PM)"
                        value={doc.availability}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const next = [...formData.doctors];
                          next[i].availability = e.target.value;
                          setFormData({ ...formData, doctors: next });
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border"
                      onClick={() => {
                        const next = formData.doctors.filter(
                          (_: any, idx: number) => idx !== i
                        );
                        setFormData({ ...formData, doctors: next });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-muted/30">
          <div className="flex w-full justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {step < 5 ? (
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Division
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
