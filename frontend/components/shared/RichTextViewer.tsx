type RichTextViewerProps = {
  content: string
  className?: string
}

export default function RichTextViewer({
  content,
  className,
}: RichTextViewerProps) {
  return (
    <div
      className={`prose prose-sm max-w-none text-slate-600 ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
