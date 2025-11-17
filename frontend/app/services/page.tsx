import LiyanaShowcase from '@/components/client/services/ServiceGrid';
import { SERVICES_DATA } from '@/data/services';

const page = () => {
  return (
    <div>
      <LiyanaShowcase services={SERVICES_DATA} />
    </div>
  );
};

export default page;
