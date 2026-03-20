'use client';

import BackendImage from '@/components/shared/BackendImage';
import { SectionHeading } from '@/components/shared/sectionHeading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TeamMember } from '@/types/team.types';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';

interface MeetTheTeamProps {
  members?: TeamMember[];
}

type TeamMemberWithSubsidiary = TeamMember & {
  subsidiary: string;
};

export default function MeetTheTeam({ members = [] }: MeetTheTeamProps) {
  const [selectedMember, setSelectedMember] =
    useState<TeamMemberWithSubsidiary | null>(null);
  const [activeSubsidiary, setActiveSubsidiary] = useState<string>('Corporate');
  const gridRef = useRef<HTMLDivElement>(null);

  const subsidiaries = Array.from(
    new Set(
      members.map((member) =>
        member.isCorporate
          ? 'Corporate'
          : (member.division?.name ?? 'Corporate')
      )
    )
  ).sort((a, b) => {
    if (a === 'Corporate') return -1;
    if (b === 'Corporate') return 1;
    return a.localeCompare(b);
  });

  const filteredTeam: TeamMemberWithSubsidiary[] = members
    .filter((member) => {
      const subsidiary = member.isCorporate
        ? 'Corporate'
        : (member.division?.name ?? 'Corporate');
      return subsidiary === activeSubsidiary;
    })
    .map((member) => ({
      ...member,
      subsidiary: member.isCorporate
        ? 'Corporate'
        : (member.division?.name ?? 'Corporate'),
    }));

  // Animate grid items when filter changes
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.team-card',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [activeSubsidiary]);

  return (
    <section className="relative pt-10 pb-24 px-6 bg-white border-t border-slate-200 selection:bg-cyan-100 selection:text-cyan-900">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Meet Our Leadership
          </SectionHeading>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover the dedicated executives and branch managers leading our
            strategic initiatives.
          </p>
        </div>

        {/* Corporate Tabs Filter */}
        <div className="flex justify-center mb-16 border-b border-slate-200 pb-6">
          <Select
            value={activeSubsidiary}
            onValueChange={(value) => setActiveSubsidiary(value)}
          >
            <SelectTrigger className="w-64 border-slate-200 focus:ring-cyan-600">
              <SelectValue placeholder="Filter by subsidiary" />
            </SelectTrigger>
            <SelectContent>
              {subsidiaries.map((subsidiary) => (
                <SelectItem key={subsidiary} value={subsidiary}>
                  {subsidiary}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="team-card group flex flex-col bg-white border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => setSelectedMember(member)}
            >
              {/* Image Container */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                {member.image ? (
                  <BackendImage
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                    <span className="text-5xl font-bold tracking-widest">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm rounded-sm">
                  {member.subsidiary}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-4">
                  {member.position}
                </p>
                <div className="h-[1px] w-12 bg-slate-200 mb-4" />
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-100 border-r border-slate-100">
              {selectedMember.image ? (
                <BackendImage
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl font-bold tracking-widest">
                  {selectedMember.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative flex flex-col">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                {selectedMember.subsidiary}
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {selectedMember.name}
              </h2>
              <p className="text-cyan-700 font-bold uppercase tracking-wider text-sm mb-6">
                {selectedMember.position}
              </p>

              <div className="h-[2px] w-12 bg-cyan-600 mb-6" />

              <p className="text-slate-600 leading-relaxed flex-grow">
                {selectedMember.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
