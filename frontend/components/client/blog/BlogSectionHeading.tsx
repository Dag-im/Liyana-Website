import { SectionHeading } from '@/components/shared/sectionHeading';

export default function BlogSectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionHeading
      variant="large"
      align="center"
      weight="bold"
      className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-12"
    >
      {children}
    </SectionHeading>
  );
}
