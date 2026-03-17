import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import type { NetworkRelation } from '@/types/corporate-network.types';
import {
  useCreateNetworkRelation,
  useUpdateNetworkRelation,
} from './useNetworkRelations';

type NetworkRelationFormValues = {
  name: string;
  label: string;
  description: string;
  sortOrder: number;
};

type NetworkRelationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relation?: NetworkRelation | null;
};

export function NetworkRelationDialog({
  open,
  onOpenChange,
  relation,
}: NetworkRelationDialogProps) {
  const isEditing = !!relation;
  const createMutation = useCreateNetworkRelation();
  const updateMutation = useUpdateNetworkRelation(relation?.id || '');

  const form = useForm<NetworkRelationFormValues>({
    defaultValues: {
      name: '',
      label: '',
      description: '',
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (relation) {
      form.reset({
        name: relation.name,
        label: relation.label,
        description: relation.description || '',
        sortOrder: relation.sortOrder,
      });
    } else {
      form.reset({
        name: '',
        label: '',
        description: '',
        sortOrder: 0,
      });
    }
  }, [relation, form]);

  const onSubmit = async (values: NetworkRelationFormValues) => {
    if (isEditing) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Relation Type' : 'Add Relation Type'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (System ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Strategic Partner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Strategic Partner" {...field} />
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
                    <Textarea
                      placeholder="Optional description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? 'Save Changes' : 'Create Relation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
