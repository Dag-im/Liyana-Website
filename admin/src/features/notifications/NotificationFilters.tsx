import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type NotificationFilter = 'all' | 'unread' | 'read'

type NotificationFiltersProps = {
  value: NotificationFilter
  onChange: (value: NotificationFilter) => void
}

export default function NotificationFilters({ value, onChange }: NotificationFiltersProps) {
  return (
    <Tabs onValueChange={(nextValue) => onChange(nextValue as NotificationFilter)} value={value}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="read">Read</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
