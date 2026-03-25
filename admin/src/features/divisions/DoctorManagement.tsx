import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Plus, Pencil, Trash2, Users, Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import IconButton from '@/components/system/IconButton';
import { useCreateDoctor, useUpdateDoctor, useDeleteDoctor, useDivisionDoctors } from './useDivisions';
import { FileUpload } from '@/components/shared/FileUpload';
import { FileImage } from '@/components/shared/FileImage';
import { divisionsApi } from '@/api/divisions.api';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import type { Doctor } from '@/types/services.types';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  image: z.string().optional(),
  availability: z.string().min(1, 'Availability is required'),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export function DoctorManagement({ divisionId }: { divisionId: string }) {
  const { data: doctors, isLoading } = useDivisionDoctors(divisionId);
  const createMutation = useCreateDoctor(divisionId);
  const updateMutation = useUpdateDoctor(divisionId);
  const deleteMutation = useDeleteDoctor(divisionId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema) as any,
    defaultValues: {
      name: '',
      specialty: '',
      image: '',
      availability: 'Available during business hours',
    },
  });

  const handleCreate = () => {
    setEditingDoctor(null);
    form.reset({
      name: '',
      specialty: '',
      image: '',
      availability: 'Available during business hours',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.reset({
      name: doctor.name,
      specialty: doctor.specialty,
      image: doctor.image || '',
      availability: doctor.availability,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: DoctorFormData) => {
    if (editingDoctor) {
      updateMutation.mutate(
        { id: editingDoctor.id, dto: values },
        {
          onSuccess: () => {
            toast.success('Doctor updated successfully');
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate({ ...values, image: values.image || null }, {
        onSuccess: () => {
          toast.success('Doctor added successfully');
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Doctor removed successfully');
        setDeletingDoctorId(null);
      },
    });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medical Team</h3>
          <p className="text-sm text-muted-foreground">Manage doctors and specialists for this division.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors?.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden group">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0 border-2 border-primary/10">
                  {doctor.image ? (
                    <FileImage path={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                  ) : (
                    <Users className="h-6 w-6 m-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{doctor.name}</h4>
                  <p className="text-xs text-primary font-medium truncate">{doctor.specialty}</p>
                </div>
                <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    tooltip="Edit Doctor"
                    ariaLabel={`Edit doctor ${doctor.name}`}
                    onClick={() => handleEdit(doctor)}
                    icon={<Pencil />}
                  />
                  <IconButton
                    tooltip="Delete Doctor"
                    ariaLabel={`Delete doctor ${doctor.name}`}
                    onClick={() => setDeletingDoctorId(doctor.id)}
                    icon={<Trash2 />}
                    destructive
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="mt-2 p-2 bg-muted/30 rounded text-[11px] text-muted-foreground">
                 <span className="font-medium">Availability:</span> {doctor.availability}
               </div>
            </CardContent>
          </Card>
        ))}
        {doctors?.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/5">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-sm text-muted-foreground">No doctors assigned to this division yet.</p>
            <Button variant="link" onClick={handleCreate}>Add your first doctor</Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            <DialogDescription>
              {editingDoctor ? 'Update doctor professional profile.' : 'Create a new professional profile for the team.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUpload={(file) => divisionsApi.uploadDoctorFile(divisionId, file)}
                        onSuccess={field.onChange}
                        currentPath={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="Cardiology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri, 9AM-5PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <IconButton
                  tooltip="Cancel"
                  ariaLabel="Cancel"
                  onClick={() => setIsDialogOpen(false)}
                  icon={<X />}
                />
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingDoctorId}
        onClose={() => setDeletingDoctorId(null)}
        title="Delete Doctor"
        description="Are you sure you want to remove this doctor from the division? This action cannot be undone."
        onConfirm={() => deletingDoctorId && handleDelete(deletingDoctorId)}
      />
    </div>
  );
}
