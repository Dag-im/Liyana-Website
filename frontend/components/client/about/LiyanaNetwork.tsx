'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { getNetworkIcon } from '@/lib/icons';
import {
  CheckCircle2,
  ChevronRight,
  Info,
  Search,
  Target,
} from 'lucide-react';
import type {
  NetworkEntity,
  NetworkMeta,
  NetworkRelation,
} from '@/types/network.types';
import { useMemo, useState } from 'react';

const StatusLabel = ({ relation }: { relation: NetworkRelation }) => (
  <span
    className={`text-[9px] font-bold px-2 py-0.5 border rounded-none uppercase tracking-wider whitespace-nowrap ${
      relation.label === 'Controlled'
        ? 'bg-[#e6f7fc] border-[#99def5] text-[#01649c]'
        : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}
  >
    {relation.label}
  </span>
);

export default function LiyanaCorporateNetwork({
  data,
  meta,
}: {
  data: NetworkEntity[];
  meta?: NetworkMeta;
}) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['lhs-owned', 'lhs-partners'])
  );

  // Filter logic: Flatten the tree for search results so "only" specific entities appear
  const displayData = useMemo(() => {
    if (!search) return data;

    const query = search.toLowerCase();
    const results: NetworkEntity[] = [];

    const findMatches = (nodes: NetworkEntity[]) => {
      nodes.forEach((node) => {
        if (node.name.toLowerCase().includes(query)) {
          // Clone to prevent showing original children during search
          results.push({ ...node, children: [] });
        }
        if (node.children) findMatches(node.children);
      });
    };

    findMatches(data);
    return results;
  }, [data, search]);

  const toggle = (id: string) => {
    const next = new Set(expanded);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setExpanded(next);
  };

  const renderNode = (e: NetworkEntity, depth = 0) => {
    const isSearchMode = search.length > 0;
    const isExpanded = expanded.has(e.id) || isSearchMode;
    const isMatch = isSearchMode; // In search mode, everything rendered is a match
    const Icon = getNetworkIcon(e.icon);

    return (
      <div
        key={e.id}
        className={`${depth > 0 && !isSearchMode ? 'ml-6' : 'mb-3'}`}
      >
        <div
          onClick={() => toggle(e.id)}
          className={`group relative border transition-all duration-200 cursor-pointer rounded-none ${
            isExpanded
              ? 'border-[#0880b9] shadow-md ring-1 ring-[#0880b9]/5'
              : 'border-slate-200 hover:border-slate-300'
          } ${isMatch ? 'bg-[#e6f7fc]/30' : 'bg-white'}`}
        >
          {/* Main Card Header - Height increased via p-5 and min-h-[80px] */}
          <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 min-h-[80px]">
            <div className="flex items-center gap-4 min-w-0">
              {!isSearchMode && (
                <ChevronRight
                  className={`transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90 text-[#0880b9]' : 'text-slate-400'}`}
                  size={16}
                />
              )}
              <div
                className={`p-3 rounded-none shrink-0 ${isExpanded ? 'bg-[#cceffa]' : 'bg-slate-50'}`}
              >
                <Icon
                  size={20}
                  className={isExpanded ? 'text-[#01649c]' : 'text-slate-500'}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-3 overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase truncate">
                    {e.name}
                  </h3>
                  <StatusLabel relation={e.relation} />
                </div>
                {!isExpanded && (
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                    {e.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="px-10 pb-6 space-y-4 border-t border-slate-50 pt-5 animate-in fade-in slide-in-from-top-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Info size={12} /> Overview
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  {e.description}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#0880b9] uppercase tracking-widest">
                  <Target size={12} /> Strategic Value
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0880b9] mt-0.5 shrink-0" />
                  <p className="text-[14px] text-slate-700 leading-relaxed font-semibold italic">
                    {e.insight}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            className={`absolute bottom-0 left-0 h-1 bg-[#0880b9] transition-all duration-300 ${isExpanded ? 'w-full' : 'w-0'}`}
          />
        </div>
        {!isSearchMode &&
          isExpanded &&
          e.children?.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white selection:bg-[#cceffa] selection:text-[#014f7a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-[#33bde9] to-[#0880b9] mb-6 text-center"
          >
            Liyana Corporate Network
          </SectionHeading>

          <p className="max-w-2xl text-center text-slate-600 text-sm font-medium mb-12">
            A comprehensive mapping of our vertically integrated healthcare
            ecosystem, spanning clinical operations, education, and industrial
            manufacturing.
          </p>

          <div className="relative w-full max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by entity name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 py-4 pl-12 pr-6 text-base font-semibold focus:outline-none focus:ring-0 focus:border-[#0880b9] transition-all rounded-none"
            />
          </div>
        </div>

        {!search && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setExpanded(new Set())}
              className="text-[10px] font-bold text-slate-400 hover:text-[#0880b9] uppercase tracking-widest transition-colors"
            >
              [ Collapse All Hierarchies ]
            </button>
          </div>
        )}

        <div
          className={`grid grid-cols-1 ${search ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-x-12 gap-y-6 items-start`}
        >
          {displayData.map((e) => (
            <div key={e.id} className="w-full">
              {renderNode(e)}
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-100">
          <div className="rounded-none">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Architecture
            </span>
            <span className="text-xs font-bold text-slate-800">
              Vertically Integrated
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Units
            </span>
            <span className="text-xs font-bold text-slate-800">
              {meta?.totalEntities ?? 0} Registered{' '}
              {(meta?.totalEntities ?? 0) === 1 ? 'Entity' : 'Entities'}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Network Version
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#0880b9]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-tighter">
                {meta?.version ?? `Core.v.${new Date().getFullYear()}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
