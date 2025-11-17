// data/blogs.ts
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  image: string;
  category: string;
};

// ---------- BASE URL ----------
const IMAGE_URL =
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=900';

export const BLOGS: BlogPost[] = [
  {
    id: '1',
    slug: 'renewable-energy-in-healthcare',
    title: 'Exploring Future Renewable Energy in Healthcare Facilities',
    excerpt:
      'Discover how hospitals are adopting renewable energy solutions to power critical care while reducing carbon footprint.',
    content: [
      'Full detailed content about renewable energy in healthcare...',
      '',
    ],
    date: 'December 11, 2023',
    image: `${IMAGE_URL}&auto=format&fit=crop`,
    category: 'Innovation',
  },
  {
    id: '2',
    slug: 'preventive-care-tips',
    title: 'Preventive Care Tips for a Healthier Lifestyle',
    excerpt:
      'Simple yet effective steps everyone can take to prevent chronic diseases and improve overall wellbeing.',
    content: ['Full detailed content about preventive care...'],
    date: 'November 20, 2023',
    image: `${IMAGE_URL}&auto=format&fit=crop`,
    category: 'Wellness',
  },
  {
    id: '3',
    slug: 'ai-in-healthcare',
    title: 'The Role of AI in Modern Diagnostics',
    excerpt:
      'Artificial Intelligence is transforming how doctors diagnose illnesses faster and with greater accuracy.',
    content: ['Full detailed content about AI in healthcare...'],
    date: 'December 11, 2023',
    image: `${IMAGE_URL}&auto=format&fit=crop`,
    category: 'Technology',
  },
  {
    id: '4',
    slug: 'mental-health-awareness',
    title: 'Mental Health Awareness: Breaking the Stigma',
    excerpt:
      'Understanding mental health is crucial. Learn how to support yourself and others in your community.',
    content: ['Full detailed content about mental health...'],
    date: 'October 5, 2023',
    image: `${IMAGE_URL}&auto=format&fit=crop`,
    category: 'Mental Health',
  },
  {
    id: '5',
    slug: 'nutrition-and-disease-prevention',
    title: 'Nutrition and Disease Prevention: What You Need to Know',
    excerpt:
      'A balanced diet plays a key role in preventing diseases. Discover essential nutrition tips for better health.',
    content: ['Full detailed content about nutrition...'],
    date: 'September 15, 2023',
    image: `${IMAGE_URL}&auto=format&fit=crop`,
    category: 'Nutrition',
  },
];
