import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/lib/constants';
import { cn, formatEnumLabel } from '@/lib/utils';
import type { AuditAction, AuditEntityType } from '@/types/audit-log.types';

type AuditLogFilterValues = {
  action?: AuditAction;
  entityType?: AuditEntityType | string;
  performedBy?: string;
  startDate?: string;
  endDate?: string;
};

type AuditLogFiltersProps = {
  value: AuditLogFilterValues;
  onChange: (value: AuditLogFilterValues) => void;
};

export default function AuditLogFilters({
  value,
  onChange,
}: AuditLogFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <AuditLogCombobox
        className="w-70"
        emptyLabel="No matching actions"
        label="Action"
        onSelect={(nextValue) =>
          onChange({
            ...value,
            action:
              nextValue === 'ALL' ? undefined : (nextValue as AuditAction),
          })
        }
        options={[
          { label: 'All actions', value: 'ALL' },
          ...AUDIT_ACTIONS.map((action) => ({
            label: formatEnumLabel(action),
            value: action,
          })),
        ]}
        placeholder="All actions"
        value={value.action ?? 'ALL'}
      />

      <AuditLogCombobox
        className="w-55"
        emptyLabel="No matching entity types"
        label="Entity Type"
        onSelect={(nextValue) =>
          onChange({
            ...value,
            entityType:
              nextValue === 'ALL' ? undefined : (nextValue as AuditEntityType),
          })
        }
        options={[
          { label: 'All entity types', value: 'ALL' },
          ...AUDIT_ENTITY_TYPES.map((entityType) => ({
            label: formatEnumLabel(entityType),
            value: entityType,
          })),
        ]}
        placeholder="All entity types"
        value={value.entityType ?? 'ALL'}
      />

      <Input
        className="max-w-45"
        onChange={(event) =>
          onChange({ ...value, performedBy: event.target.value || undefined })
        }
        placeholder="Performed by"
        value={value.performedBy ?? ''}
      />
      <Input
        className="max-w-45"
        onChange={(event) =>
          onChange({ ...value, startDate: event.target.value || undefined })
        }
        type="date"
        value={value.startDate ?? ''}
      />
      <Input
        className="max-w-45"
        onChange={(event) =>
          onChange({ ...value, endDate: event.target.value || undefined })
        }
        type="date"
        value={value.endDate ?? ''}
      />
    </div>
  );
}

type AuditLogComboboxOption = {
  label: string;
  value: string;
};

function AuditLogCombobox({
  value,
  options,
  onSelect,
  placeholder,
  label,
  emptyLabel,
  className,
}: {
  value: string;
  options: AuditLogComboboxOption[];
  onSelect: (value: string) => void;
  placeholder: string;
  label: string;
  emptyLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    );
  }, [options, query]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={<Button type="button" variant="outline" />}
        className={cn('justify-between', className)}
      >
        <span className="truncate text-left">
          {selected?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-0">
        <div className="border-b border-border/70 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}`}
              value={query}
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length ? (
            filtered.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  onClick={() => {
                    onSelect(option.value);
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-sm text-slate-500">{emptyLabel}</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
