import { Folder } from '@/components/client/media/types';

export const mediaFolders: Folder[] = [
  {
    id: 'corporate-events',
    name: 'Corporate Events',
    tag: 'Events',
    mediaCount: 24,
    lastUpdated: '2 days ago',
    coverImage: 'https://picsum.photos/800/600?random=11',
    media: [
      {
        id: 'e1',
        title: 'Keynote 2025',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=21',
      },
      {
        id: 'e3',
        title: 'Gala Night',
        type: 'image',
        url: 'https://picsum.photos/1200/800?random=22',
      },
      // … add as many as you like
    ],
  },
  {
    id: 'team-highlights',
    name: 'Team Highlights',
    tag: 'Team',
    mediaCount: 18,
    lastUpdated: '5 days ago',
    coverImage: 'https://picsum.photos/800/600?random=12',
    media: [
      {
        id: 't1',
        title: 'Team Photo 2025',
        type: 'image',
        url: 'https://picsum.photos/1200/800?random=31',
      },
      {
        id: 't2',
        title: 'Quarterly Recap',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=32',
      },
    ],
  },
  {
    id: 'facility-tours',
    name: 'Facility Tours',
    tag: 'Facilities',
    mediaCount: 12,
    lastUpdated: '1 week ago',
    coverImage: 'https://picsum.photos/800/600?random=13',
    media: [
      {
        id: 'f1',
        title: 'Factory Walk-through',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=41',
      },
      {
        id: 'f2',
        title: 'Office Layout',
        type: 'image',
        url: 'https://picsum.photos/1200/800?random=42',
      },
    ],
  },
];
