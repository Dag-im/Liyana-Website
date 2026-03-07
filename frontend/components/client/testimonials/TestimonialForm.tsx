'use client';

import { useState } from 'react';

export function TestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-slate-50 border border-slate-200 rounded-sm text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Thank you for your feedback.
        </h3>
        <p className="text-slate-500 text-sm">
          Your testimonial has been submitted and is pending review by our
          communications team.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-cyan-600 hover:text-cyan-700"
        >
          Submit another testimonial
        </button>
      </div>
    );
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Share Your Experience
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            We value the insights of our partners and clients.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-50 p-8 border border-slate-200 rounded-sm shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Full Name
              </label>
              <input
                required
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-sm text-slate-800"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Job Title
              </label>
              <input
                required
                type="text"
                id="role"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-sm text-slate-800"
                placeholder="e.g. Clinical Director"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-xs font-bold text-slate-600 uppercase tracking-wide"
            >
              Company / Organization
            </label>
            <input
              required
              type="text"
              id="company"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-sm text-slate-800"
              placeholder="e.g. Liyana Healthcare"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-xs font-bold text-slate-600 uppercase tracking-wide"
            >
              Your Testimonial
            </label>
            <textarea
              required
              id="message"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow text-sm text-slate-800 resize-none"
              placeholder="Share the details of your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 text-white font-semibold text-sm tracking-wide rounded-sm bg-gradient-to-r from-[#7f3aaf] to-[#d62839] hover:opacity-90 transition-opacity shadow-md disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </form>
      </div>
    </section>
  );
}
