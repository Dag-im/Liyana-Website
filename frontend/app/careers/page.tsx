'use client';

import VacancyList, { Vacancy } from '@/components/client/vacancy/VacancyList';
import { useRouter } from 'next/navigation';

// Mock data for vacancies (since no backend, UI only)
const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'We are looking for a skilled software engineer to join our team and build innovative solutions.',
    whatYouWillDo: ['Develop features', 'Collaborate with teams'],
    qualifications: ["Bachelor's in CS", '3+ years experience'],
  },
  {
    id: '2',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description:
      'Help drive our marketing efforts and grow our brand presence.',
    whatYouWillDo: ['Create campaigns', 'Analyze metrics'],
    qualifications: ["Bachelor's in Marketing", '2+ years experience'],
  },
  {
    id: '3',
    title: 'Intern - Design',
    department: 'Design',
    location: 'Remote',
    type: 'Internship',
    description:
      'Join as a design intern to learn and contribute to real projects.',
    whatYouWillDo: ['Assist in UI/UX', 'Prototype designs'],
    qualifications: ['Pursuing degree in Design'],
  },
];

export default function JobsPage() {
  const router = useRouter();

  const handleSelect = (id: string) => {
    router.push(`/careers/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <VacancyList vacancies={mockVacancies} onSelect={handleSelect} />
    </div>
  );
}
