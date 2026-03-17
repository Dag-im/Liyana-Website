export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string; // Direct link or YouTube URL
  thumbnail?: string; // Preview image
}

export interface Folder {
  id: string;
  name: string;
  tag: string;
  mediaCount: number;
  lastUpdated: string;
  coverImage: string;
  description: string;
  media: MediaItem[];
}

export const mediaFolders: Folder[] = [
  {
    id: 'f1-q3-earnings-2024',
    name: 'Q3 2024 Earnings Call & Presentation',
    tag: 'Financials',
    mediaCount: 6,
    lastUpdated: 'October 24, 2024',
    coverImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    description:
      'Official slide decks, charts, and executive video summaries from the Q3 2024 earnings announcement.',
    media: [
      {
        id: 'm1-1',
        title: 'CEO Keynote Summary',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'm1-2',
        title: 'Revenue Growth Chart',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      },
      {
        id: 'm1-3',
        title: 'Market Share Analysis',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      },
      {
        id: 'm1-4',
        title: 'CFO Financial Breakdown',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'm1-5',
        title: 'Global Expansion Map',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80',
      },
      {
        id: 'm1-6',
        title: 'Q&A Session Highlights',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      },
    ],
  },
  {
    id: 'f2-new-hq-tour',
    name: 'Global Headquarters Expansion',
    tag: 'Facilities',
    mediaCount: 8,
    lastUpdated: 'September 12, 2024',
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    description:
      'Architectural photography and virtual walkthroughs of our newly opened sustainable headquarters.',
    media: [
      {
        id: 'm2-1',
        title: 'Exterior Facade at Dusk',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      },
      {
        id: 'm2-2',
        title: 'Main Atrium Lobby',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      },
      {
        id: 'm2-3',
        title: 'Executive Boardroom',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505318182747-063a5639b7a4?w=1200&q=80',
      },
      {
        id: 'm2-4',
        title: 'Sustainable Green Roof',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
      },
      {
        id: 'm2-5',
        title: 'Innovation Lab Walkthrough',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'm2-6',
        title: 'Employee Wellness Center',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80',
      },
      {
        id: 'm2-7',
        title: 'Open Concept Workspaces',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      },
      {
        id: 'm2-8',
        title: 'Ribbon Cutting Ceremony',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
  {
    id: 'f3-executive-portraits',
    name: 'Executive Leadership Portraits',
    tag: 'Press Kit',
    mediaCount: 5,
    lastUpdated: 'August 05, 2024',
    coverImage:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80',
    description:
      'High-resolution official portraits of the executive leadership team for press and media use.',
    media: [
      {
        id: 'm3-1',
        title: 'Sarah Johnson - CEO',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
      },
      {
        id: 'm3-2',
        title: 'Michael Chen - COO',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80',
      },
      {
        id: 'm3-3',
        title: 'James Wilson - CFO',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519085360753-af2c17f7c6f3?w=1200&q=80',
      },
      {
        id: 'm3-4',
        title: 'Emily Rodriguez - VP Quality',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80',
      },
      {
        id: 'm3-5',
        title: 'Executive Team Group Photo',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
      },
    ],
  },
  {
    id: 'f4-sustainability-2024',
    name: '2024 Sustainability Initiatives',
    tag: 'ESG',
    mediaCount: 4,
    lastUpdated: 'July 20, 2024',
    coverImage:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    description:
      'Documentation of our ongoing environmental, social, and governance (ESG) projects.',
    media: [
      {
        id: 'm4-1',
        title: 'Solar Array Implementation',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
      },
      {
        id: 'm4-2',
        title: 'Zero-Waste Facility Rollout',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'm4-3',
        title: 'Community Water Project',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
      },
      {
        id: 'm4-4',
        title: 'Annual ESG Report Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
];
