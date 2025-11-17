export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-2 py-16">{children}</div>
    </div>
  );
}
