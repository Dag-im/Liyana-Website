import AwardsSection from '@/components/client/about/AwardsSection';
import type { Award } from '@/types/awards.types';

const awards: Award[] = [
  {
    id: '1',
    title: 'Excellence in Healthcare Innovation',
    organization: 'Healthcare Industry Association',
    year: '2024',
    category: 'Innovation',
    description:
      'Recognized for pioneering advancements in healthcare technology and patient care solutions.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    imageAlt: 'Team receiving Excellence in Healthcare Innovation Award 2024',
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Outstanding Patient Care',
    organization: 'Patient Choice Awards',
    year: '2024',
    category: 'Service',
    description:
      'Awarded for exceptional patient satisfaction and outstanding care delivery excellence.',
    image: 'https://images.unsplash.com/photo-1576765607924-3a7bd1c70d84',
    imageAlt: 'Care team receiving Outstanding Patient Care Award 2024',
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    title: 'Environmental Leadership in Healthcare',
    organization: 'Green Healthcare Council',
    year: '2023',
    category: 'Sustainability',
    description:
      'Honored for our commitment to sustainable practices and reducing environmental impact in healthcare.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c7983',
    imageAlt: 'Executive receiving Environmental Leadership Award 2023',
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    title: 'Fastest Growing Healthcare Network',
    organization: 'Healthcare Business Awards',
    year: '2023',
    category: 'Growth',
    description:
      'Recognized for rapid expansion and leadership in the healthcare industry.',
    image: 'https://images.unsplash.com/photo-1742415888265-d5044039d8e6',
    imageAlt:
      'Leadership team receiving Fastest Growing Healthcare Network Award 2023',
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
  },
];

const page = () => {
  return <AwardsSection awards={awards} />;
};

export default page;
