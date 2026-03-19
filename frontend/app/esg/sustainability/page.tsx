import Sustainability from '@/components/client/other/sustainability';

export const revalidate = 3600;

const page = () => {
  return (
    <div>
      <Sustainability />
    </div>
  );
};

export default page;
