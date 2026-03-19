import ContactSection from '@/components/client/contact/ContactSection';

export const revalidate = 86400;

const page = () => {
  return (
    <div>
      <ContactSection />
    </div>
  );
};

export default page;
