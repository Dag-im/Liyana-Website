type EmptyStateProps = {
  title?: string
  description?: string
}

export default function EmptyState({ title = 'No data', description = 'Nothing to show yet.' }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
      <p className="text-base font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
