'use client';

import VacancyForm from '@/components/client/vacancy/VacancyForm';
import { useParams, useRouter } from 'next/navigation';

export default function VacancyApplyPage() {
  const router = useRouter();
  const params = useParams();
  const vacancyId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <button
        onClick={() => router.push(`/careers/${vacancyId}`)}
        className="ml-6 mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
      >
        Back to Details
      </button>
      <VacancyForm />
    </div>
  );
}
