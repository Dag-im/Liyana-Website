export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'future-of-healthcare-technology',
    title: 'Navigating the Future of Healthcare Technology and Patient Care',
    excerpt:
      'As artificial intelligence and telemedicine converge, we explore the strategic investments required to maintain excellence in patient outcomes over the next decade.',
    content: `
      <p>The healthcare landscape is undergoing a profound transformation. Driven by rapid technological advancement and shifting demographic needs, healthcare providers must adapt to maintain the highest standards of care.</p>
      <h2>The Role of Artificial Intelligence</h2>
      <p>AI is no longer a futuristic concept; it is actively reshaping diagnostics, patient monitoring, and administrative workflows. By implementing predictive analytics, healthcare networks can anticipate patient needs and allocate resources more effectively.</p>
      <blockquote>"Innovation in healthcare is not about replacing the human touch; it is about empowering our medical professionals with the tools to focus on what matters most: the patient."</blockquote>
      <h2>Telemedicine and Accessibility</h2>
      <p>The expansion of telehealth platforms has democratized access to specialists. Moving forward, strategic integration of remote patient monitoring will be paramount in managing chronic conditions and preventing hospital readmissions.</p>
      <p>As we look to 2030, our commitment remains steadfast: delivering exceptional, technology-enabled care without compromising on the compassion that defines our practice.</p>
    `,
    category: 'Innovation',
    author: {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Executive Officer',
    },
    date: 'October 12, 2024',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    featured: true,
  },
  {
    id: '2',
    slug: 'sustainable-infrastructure-expansion',
    title:
      'Building for Tomorrow: Sustainable Infrastructure in Clinical Expansion',
    excerpt:
      'An inside look at our latest green-certified facilities and how environmental sustainability integrates with superior healthcare delivery.',
    content: '<p>Full content goes here...</p>',
    category: 'Sustainability',
    author: {
      name: 'Michael Chen',
      role: 'Chief Operations Officer',
    },
    date: 'September 28, 2024',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    featured: false,
  },
  {
    id: '3',
    slug: 'leadership-in-crisis-management',
    title: 'Strategic Leadership During Global Healthcare Challenges',
    excerpt:
      'Key takeaways from our executive team on maintaining operational resilience and protecting supply chains during times of global uncertainty.',
    content: '<p>Full content goes here...</p>',
    category: 'Leadership',
    author: {
      name: 'James Wilson',
      role: 'Chief Financial Officer',
    },
    date: 'September 15, 2024',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    featured: false,
  },
  {
    id: '4',
    slug: 'patient-centric-quality-metrics',
    title: 'Redefining Quality Metrics: A Patient-Centric Approach',
    excerpt:
      'How we are updating our internal quality control standards to better reflect real-world patient satisfaction and long-term wellness outcomes.',
    content: '<p>Full content goes here...</p>',
    category: 'Quality',
    author: {
      name: 'Emily Rodriguez',
      role: 'VP of Quality Assurance',
    },
    date: 'August 30, 2024',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    featured: false,
  },
  {
    id: '5',
    slug: 'community-health-initiatives-2024',
    title: 'Expanding Our Reach: 2024 Community Health Initiatives',
    excerpt:
      'A comprehensive review of our latest outreach programs designed to provide preventative care access to underserved urban populations.',
    content: '<p>Full content goes here...</p>',
    category: 'Community',
    author: {
      name: 'Lisa Thompson',
      role: 'Director of Outreach',
    },
    date: 'August 15, 2024',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80',
    featured: false,
  },
];

// Helper to generate initials from names
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter((n) => n.length > 0 && n.toUpperCase() !== 'DR.') // Strip titles like 'Dr.'
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};
