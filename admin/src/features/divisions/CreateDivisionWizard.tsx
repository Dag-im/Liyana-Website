import { divisionsApi } from '@/api/divisions.api';
import { FileUpload } from '@/components/shared/FileUpload';
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
import { handleMutationError } from '@/lib/error-utils';
import { getUploadUrl } from '@/lib/upload-utils';
import {
  BarChart,
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { useCreateDivision } from './useDivisions';

type DivisionImage = {
  path: string;
  alt: string;
};

type CoreService = {
  name: string;
  description: string;
};

type DivisionStat = {
  label: string;
  value: string;
};

type DivisionFormState = {
  name: string;
  shortName: string;
  slug: string;
  location: string;
  overview: string;
  description: string[];
  logo: string;
  isActive: boolean;
  serviceCategoryId: string;
  divisionCategoryId: string;
  contact: {
    phone: string;
    email: string;
    googleMap: string;
  };
  images: DivisionImage[];
  coreServices: CoreService[];
  stats: DivisionStat[];
};

const STEPS = [
  {
    id: 1,
    title: 'Overview',
    description: 'Identity and category',
    icon: Info,
  },
  {
    id: 2,
    title: 'Content',
    description: 'Overview and details',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Media',
    description: 'Logo and gallery',
    icon: ImageIcon,
  },
  {
    id: 4,
    title: 'Services & Stats',
    description: 'Optional structured data',
    icon: BarChart,
  },
  {
    id: 5,
    title: 'Review',
    description: 'Confirm before create',
    icon: CheckSquare,
  },
] as const;

const INITIAL_FORM_STATE: DivisionFormState = {
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
};

export function CreateDivisionWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DivisionFormState>(INITIAL_FORM_STATE);
  const [showContactFields, setShowContactFields] = useState(false);
  const [showStatsSection, setShowStatsSection] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);

  const createMutation = useCreateDivision();
  const { data: serviceCategories } = useServiceCategories({ perPage: 100 });
  const { data: divisionCategories } = useDivisionCategories();

  const serviceCategoryTitle = useMemo(
    () =>
      serviceCategories?.data.find((item) => item.id === formData.serviceCategoryId)
        ?.title ?? 'Not selected',
    [formData.serviceCategoryId, serviceCategories?.data]
  );

  const divisionCategoryLabel = useMemo(
    () =>
      divisionCategories?.find((item) => item.id === formData.divisionCategoryId)
        ?.label ?? 'Not selected',
    [divisionCategories, formData.divisionCategoryId]
  );

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => setDraftSavedAt(new Date()), 300);
    return () => clearTimeout(timeout);
  }, [formData, open]);

  const resetWizard = () => {
    setStep(1);
    setFormData(INITIAL_FORM_STATE);
    setShowContactFields(false);
    setShowStatsSection(false);
    setDraftSavedAt(null);
  };

  const updateStep = async (targetStep: number) => {
    const valid = validateStep(step);
    if (!valid && targetStep > step) return;
    setStep(targetStep);
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Division name is required.');
        return false;
      }
      if (!formData.shortName.trim()) {
        toast.error('Short name is required.');
        return false;
      }
      if (!formData.serviceCategoryId) {
        toast.error('Select a service category.');
        return false;
      }
      if (!formData.divisionCategoryId) {
        toast.error('Select a division category.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.overview.trim().length < 12) {
        toast.error('Overview should be at least 12 characters.');
        return false;
      }
      const hasDescription = formData.description.some((item) => item.trim().length > 0);
      if (!hasDescription) {
        toast.error('Add at least one detailed description paragraph.');
        return false;
      }
    }

    return true;
  };

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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetWizard();
      }}
    >
      <DialogContent className="flex max-h-[92vh] w-[98vw] max-w-6xl flex-col overflow-hidden p-0">
        <DialogHeader className="space-y-4 border-b p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <DialogTitle>Create New Division</DialogTitle>
              <DialogDescription>
                Guided setup with review and validation.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {draftSavedAt ? (
                <Badge variant="secondary">
                  Draft saved {draftSavedAt.toLocaleTimeString()}
                </Badge>
              ) : null}
              <Badge variant="outline">Step {step} / {STEPS.length}</Badge>
            </div>
          </div>
          <WizardProgress
            step={step}
            steps={STEPS as unknown as WizardStep[]}
            onStepClick={(nextStep) => {
              void updateStep(nextStep);
            }}
          />
        </DialogHeader>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Division Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name: value,
                        slug: value.toLowerCase().trim().replace(/\s+/g, '-'),
                      }));
                    }}
                    placeholder="e.g. Cardiology Unit"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in internal listings and details pages.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Short Name / Abbreviation</Label>
                  <Input
                    value={formData.shortName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortName: event.target.value,
                      }))
                    }
                    placeholder="e.g. CARD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Category</Label>
                  <Select
                    value={formData.serviceCategoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        serviceCategoryId: value ?? '',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service Category">
                        {serviceCategoryTitle}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories?.data.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Division Category</Label>
                  <Select
                    value={formData.divisionCategoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        divisionCategoryId: value ?? '',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Division Category">
                        {divisionCategoryLabel}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {divisionCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
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
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, location: event.target.value }))
                  }
                  placeholder="e.g. Floor 3, Block B"
                />
              </div>

              <div className="rounded-lg border border-dashed p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Optional contact info</p>
                  <Button
                    onClick={() => setShowContactFields((prev) => !prev)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {showContactFields ? 'Hide' : 'Add Contact'}
                  </Button>
                </div>
                {showContactFields ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={formData.contact.phone}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phone: event.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={formData.contact.email}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: event.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Google Maps URL</Label>
                      <Input
                        value={formData.contact.googleMap}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              googleMap: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Keep this hidden until the team is ready to publish contact
                    details.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Overview (Brief)</Label>
                <Textarea
                  value={formData.overview}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, overview: event.target.value }))
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
                      setFormData((prev) => ({
                        ...prev,
                        description: [...prev.description, ''],
                      }))
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add Paragraph
                  </Button>
                </div>
                {formData.description.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(event) => {
                        const next = [...formData.description];
                        next[index] = event.target.value;
                        setFormData((prev) => ({ ...prev, description: next }));
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const next = formData.description.filter(
                          (_, itemIndex) => itemIndex !== index
                        );
                        setFormData((prev) => ({
                          ...prev,
                          description: next.length ? next : [''],
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <FileUpload
                  onUpload={divisionsApi.uploadDivisionFile}
                  onSuccess={(path) =>
                    setFormData((prev) => ({ ...prev, logo: path }))
                  }
                  currentPath={formData.logo}
                />
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Gallery Images</Label>
                  <p className="text-xs text-muted-foreground">
                    Optional but recommended for richer listings.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={`${image.path}-${index}`}
                      className="relative aspect-video overflow-hidden rounded-lg border"
                    >
                      <img
                        src={getUploadUrl(image.path)}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, itemIndex) => itemIndex !== index),
                          }));
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="aspect-video">
                    <FileUpload
                      onUpload={divisionsApi.uploadDivisionFile}
                      onSuccess={(path) => {
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, { path, alt: '' }],
                        }));
                      }}
                      multiple
                      showPreview={false}
                      label="Add Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Core Services</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coreServices: [
                          ...prev.coreServices,
                          { name: '', description: '' },
                        ],
                      }))
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add Service
                  </Button>
                </div>
                {formData.coreServices.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No services yet. Add at least one if you want richer detail pages.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.coreServices.map((service, index) => (
                      <div
                        key={`${service.name}-${index}`}
                        className="grid grid-cols-1 gap-2 rounded-lg border p-3 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <Input
                          placeholder="Service Name"
                          value={service.name}
                          onChange={(event) => {
                            const next = [...formData.coreServices];
                            next[index] = {
                              ...next[index],
                              name: event.target.value,
                            };
                            setFormData((prev) => ({ ...prev, coreServices: next }));
                          }}
                        />
                        <Input
                          placeholder="Brief Description"
                          value={service.description}
                          onChange={(event) => {
                            const next = [...formData.coreServices];
                            next[index] = {
                              ...next[index],
                              description: event.target.value,
                            };
                            setFormData((prev) => ({ ...prev, coreServices: next }));
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              coreServices: prev.coreServices.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-dashed p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Optional stats</p>
                  <Button
                    onClick={() => setShowStatsSection((prev) => !prev)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {showStatsSection ? 'Hide' : 'Add Stats'}
                  </Button>
                </div>
                {showStatsSection ? (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          stats: [...prev.stats, { label: '', value: '' }],
                        }))
                      }
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Stat
                    </Button>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {formData.stats.map((stat, index) => (
                        <div
                          key={`${stat.label}-${index}`}
                          className="relative flex flex-col gap-2 rounded-lg border p-3"
                        >
                          <Input
                            placeholder="Label (e.g. Happy Patients)"
                            value={stat.label}
                            onChange={(event) => {
                              const next = [...formData.stats];
                              next[index] = { ...next[index], label: event.target.value };
                              setFormData((prev) => ({ ...prev, stats: next }));
                            }}
                          />
                          <Input
                            placeholder="Value (e.g. 5000+)"
                            value={stat.value}
                            onChange={(event) => {
                              const next = [...formData.stats];
                              next[index] = { ...next[index], value: event.target.value };
                              setFormData((prev) => ({ ...prev, stats: next }));
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                stats: prev.stats.filter(
                                  (_, itemIndex) => itemIndex !== index
                                ),
                              }));
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Keep metrics hidden until the data is finalized.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-5">
              <div className="rounded-xl border bg-muted/20 p-4">
                <h3 className="mb-2 text-sm font-semibold">Review and confirm</h3>
                <p className="text-xs text-muted-foreground">
                  Check key values before creating this division.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ReviewBlock title="Basics">
                  <ReviewItem label="Name" value={formData.name || 'Not set'} />
                  <ReviewItem label="Short Name" value={formData.shortName || 'Not set'} />
                  <ReviewItem label="Slug" value={formData.slug || 'Not set'} />
                  <ReviewItem label="Location" value={formData.location || 'Not set'} />
                  <ReviewItem label="Service Category" value={serviceCategoryTitle} />
                  <ReviewItem label="Division Category" value={divisionCategoryLabel} />
                </ReviewBlock>

                <ReviewBlock title="Media & Content">
                  <ReviewItem label="Logo" value={formData.logo ? 'Added' : 'Missing'} />
                  <ReviewItem
                    label="Gallery Images"
                    value={String(formData.images.length)}
                  />
                  <ReviewItem
                    label="Description Paragraphs"
                    value={String(formData.description.filter((item) => item.trim()).length)}
                  />
                  <ReviewItem
                    label="Core Services"
                    value={String(formData.coreServices.length)}
                  />
                  <ReviewItem label="Stats" value={String(formData.stats.length)} />
                </ReviewBlock>
              </div>
              <ReviewBlock title="Overview">
                <p className="text-sm text-foreground">
                  {formData.overview || 'No overview provided.'}
                </p>
              </ReviewBlock>
            </div>
          ) : null}
        </div>

        <DialogFooter className="border-t bg-muted/20 p-6">
          <div className="flex w-full items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            {step < STEPS.length ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={onSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
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
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
