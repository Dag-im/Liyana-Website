import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconPicker } from '@/components/shared/IconPicker';
import type { NetworkEntity } from '@/types/corporate-network.types';
import { useNetworkRelations } from './useNetworkRelations';
import { useUpdateNetworkEntity } from './useNetworkEntities';

type EditNetworkEntityFormValues = {
  name: string;
  summary: string;
  description: string;
  insight: string;
  icon: string;
  relationId: string;
  sortOrder: number;
};

type EditNetworkEntityDialogProps = {
  open: boolean;
  onClose: () => void;
  entity: NetworkEntity | null;
  inline?: boolean;
};

export function EditNetworkEntityDialog({
  open,
  onClose,
  entity,
  inline = false,
}: EditNetworkEntityDialogProps) {
  const { data: relations } = useNetworkRelations();
  const updateMutation = useUpdateNetworkEntity(entity?.id || '');

  const form = useForm<EditNetworkEntityFormValues>({
    defaultValues: {
      name: '',
      summary: '',
      description: '',
      insight: '',
      icon: 'Building2',
      relationId: '',
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (entity) {
      form.reset({
        name: entity.name,
        summary: entity.summary,
        description: entity.description,
        insight: entity.insight,
        icon: entity.icon,
        relationId: entity.relationId,
        sortOrder: entity.sortOrder,
      });
    }
  }, [entity, form]);

  const onSubmit = async (values: EditNetworkEntityFormValues) => {
    if (!entity) return;
    await updateMutation.mutateAsync(values);
    onClose();
  };

  const content = (
    <>
        {inline ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Edit Network Entity</h2>
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>Edit Network Entity</DialogTitle>
          </DialogHeader>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Entity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {relations?.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.label}
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
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Summary</FormLabel>
                    <span className="text-[10px] text-muted-foreground">
                      {field.value.length}/120
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Short summary..."
                      {...field}
                      maxLength={120}
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
                    <Textarea placeholder="Full description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insight</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Key insights..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconPicker
                        value={field.value}
                        onChange={field.onChange}
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
    </>
  );

  if (inline) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );
}
