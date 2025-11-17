'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { useForm } from 'react-hook-form';

interface VacancyFormValues {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  address: string;

  // Education & Career
  highestDegree: string;
  university: string;
  graduationYear: string;
  experienceYears: number;
  currentEmployer?: string;
  currentPosition?: string;
  skills: string;
  expectedSalary?: string;
  availability: string;

  // Additional Information
  cv: FileList;
  coverLetter?: FileList;
  notes?: string;
}

export default function VacancyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VacancyFormValues>();

  const onSubmit = (data: VacancyFormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <div>
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 mb-6"
      >
        Application Form
      </SectionHeading>
      <div className="py-10 px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto space-y-12 bg-white rounded-3xl shadow-2xl border border-gray-200 px-10 py-14"
        >
          {/* PERSONAL INFORMATION */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-cyan-800">
              Personal Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <input
                  placeholder="Full Name"
                  {...register('fullName', {
                    required: 'Full name is required',
                  })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
                {errors.fullName && (
                  <p className="mt-2 text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  placeholder="Email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div>
                <input
                  placeholder="Phone Number"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div>
                <input
                  placeholder="Address"
                  {...register('address')}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
            </div>
          </section>

          {/* EDUCATION & CAREER */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-cyan-800">
              Education & Career
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <input
                placeholder="Highest Degree"
                {...register('highestDegree', {
                  required: 'Degree is required',
                })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                placeholder="University / Institution"
                {...register('university')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                placeholder="Graduation Year"
                {...register('graduationYear')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                type="number"
                placeholder="Years of Experience"
                {...register('experienceYears', {
                  required: 'Experience is required',
                })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                placeholder="Current Employer (optional)"
                {...register('currentEmployer')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                placeholder="Current Position (optional)"
                {...register('currentPosition')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <textarea
              placeholder="Key Skills (comma separated)"
              {...register('skills', { required: 'Skills are required' })}
              className="mt-6 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <input
                placeholder="Expected Salary (optional)"
                {...register('expectedSalary')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                placeholder="Availability (e.g. 2 weeks notice)"
                {...register('availability', {
                  required: 'Availability is required',
                })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </section>

          {/* ADDITIONAL INFORMATION */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-cyan-800">
              Additional Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV (PDF/DOC)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv', { required: 'CV is required' })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Cover Letter (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('coverLetter')}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <textarea
                placeholder="Additional Notes / Motivation (optional)"
                {...register('notes')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </section>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-10 py-4 rounded-2xl bg-linear-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:bg-primary/90 transition transform hover:-translate-y-0.5"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
