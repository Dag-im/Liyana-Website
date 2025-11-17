'use client';

import VacancyDetail from '@/components/client/vacancy/VacancyDetail';
import { Vacancy } from '@/components/client/vacancy/VacancyList';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// Mock data
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

export default function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params); // unwrap the promise using use()

  const vacancy = mockVacancies.find((v) => v.id === id);

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Vacancy not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <button
        onClick={() => router.push('/careers')}
        className="ml-6 mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
      >
        Back to List
      </button>

      <VacancyDetail
        vacancy={vacancy}
        onApply={() => router.push(`/careers/${id}/apply`)}
      />
    </div>
  );
}
