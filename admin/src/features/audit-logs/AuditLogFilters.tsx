import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AUDIT_ACTIONS } from '@/lib/constants'
import { formatEnumLabel } from '@/lib/utils'
import type { AuditAction } from '@/types/audit-log.types'

type AuditLogFilterValues = {
  action?: AuditAction
  entityType?: string
  performedBy?: string
  startDate?: string
  endDate?: string
}

type AuditLogFiltersProps = {
  value: AuditLogFilterValues
  onChange: (value: AuditLogFilterValues) => void
}

export default function AuditLogFilters({ value, onChange }: AuditLogFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <Select
        onValueChange={(nextValue) => onChange({ ...value, action: nextValue === 'ALL' ? undefined : (nextValue as AuditAction) })}
        value={value.action ?? 'ALL'}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All actions</SelectItem>
          {AUDIT_ACTIONS.map((action) => (
            <SelectItem key={action} value={action}>
              {formatEnumLabel(action)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="max-w-[180px]"
        onChange={(event) => onChange({ ...value, entityType: event.target.value || undefined })}
        placeholder="Entity type"
        value={value.entityType ?? ''}
      />
      <Input
        className="max-w-[180px]"
        onChange={(event) => onChange({ ...value, performedBy: event.target.value || undefined })}
        placeholder="Performed by"
        value={value.performedBy ?? ''}
      />
      <Input
        className="max-w-[180px]"
        onChange={(event) => onChange({ ...value, startDate: event.target.value || undefined })}
        type="date"
        value={value.startDate ?? ''}
      />
      <Input
        className="max-w-[180px]"
        onChange={(event) => onChange({ ...value, endDate: event.target.value || undefined })}
        type="date"
        value={value.endDate ?? ''}
      />
    </div>
  )
}
