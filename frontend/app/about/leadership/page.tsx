import MeetTheTeam from '@/components/client/about/MeetTheTeam';
import type { TeamMember } from '@/types/team.types';

const members: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    position: 'Chief Executive Officer',
    bio: 'Visionary leader overseeing strategic direction and growth of the healthcare organization.',
    image: 'https://images.unsplash.com/photo-1519085360753-af2c17f7c6f3',
    isCorporate: true,
    divisionId: null,
    division: null,
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Chief Medical Officer',
    bio: 'Leads medical strategy and ensures high standards of patient care across all facilities.',
    image: null,
    isCorporate: true,
    divisionId: null,
    division: null,
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Branch Manager - East Coast',
    bio: 'Manages operations and patient services for our East Coast healthcare facilities.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    isCorporate: false,
    divisionId: 'east-coast-health-services',
    division: {
      id: 'east-coast-health-services',
      name: 'East Coast Health Services',
      isActive: true,
    },
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    position: 'Chief Operating Officer',
    bio: 'Drives operational excellence and efficiency across all healthcare subsidiaries.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    isCorporate: true,
    divisionId: null,
    division: null,
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    position: 'Branch Manager - West Coast',
    bio: 'Oversees operations and community outreach for West Coast healthcare facilities.',
    image: null,
    isCorporate: false,
    divisionId: 'west-coast-medical-group',
    division: {
      id: 'west-coast-medical-group',
      name: 'West Coast Medical Group',
      isActive: true,
    },
    sortOrder: 5,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    name: 'James Wilson',
    position: 'Chief Financial Officer',
    bio: 'Manages financial strategy and ensures fiscal responsibility for the organization.',
    image: 'https://images.unsplash.com/photo-1519085360753-af2c17f7c6f3',
    isCorporate: true,
    divisionId: null,
    division: null,
    sortOrder: 6,
    createdAt: '',
    updatedAt: '',
  },
];

const page = () => {
  return <MeetTheTeam members={members} />;
};

export default page;
