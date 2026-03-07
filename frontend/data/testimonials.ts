export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  isApproved: boolean;
  isFavorite: boolean;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Chief Executive Officer',
    company: 'HealthPlus Global',
    message:
      'This platform has fundamentally optimized our patient engagement strategy. The seamless integration and professional deployment exceeded our organizational expectations.',
    isApproved: true,
    isFavorite: true, // Will show in Slider & Grid
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Managing Director',
    company: 'MedConnect Solutions',
    message:
      'A highly robust and intuitive ecosystem. The reliability of their service architecture has provided us with measurable improvements in our daily operational workflows.',
    isApproved: true,
    isFavorite: false, // Will show in Grid only
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'Director of Patient Advocacy',
    company: 'CareFirst Network',
    message:
      'An exceptionally well-designed interface paired with highly responsive support. It has driven a tangible shift in how we manage complex healthcare journeys.',
    isApproved: true,
    isFavorite: true, // Will show in Slider & Grid
  },
  {
    id: '4',
    name: 'Dr. James Lee',
    role: 'Chief Medical Officer',
    company: 'FamilyCare Partners',
    message:
      'I consistently recommend this infrastructure to our clinical partners. It securely streamlines multi-channel communication and elevates the standard of patient care.',
    isApproved: true,
    isFavorite: false, // Will show in Grid only
  },
  {
    id: '5',
    name: 'Pending User',
    role: 'Analyst',
    company: 'Unknown Corp',
    message:
      'This testimonial has just been submitted and should not be visible anywhere yet.',
    isApproved: false, // Will not show anywhere
    isFavorite: false,
  },
];
