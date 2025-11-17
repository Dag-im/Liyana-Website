'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// --- Types
export type Pill = 'root' | 'left' | 'mid' | 'midSub' | 'right' | 'rightLeaf';

/**
 * Node type meanings:
 * - pending   → Projects underway but not yet operational
 * - subsidiary-ldhs → Subsidiaries under LIYANA Digital Healthcare Solutions SC
 * - associate   → Associates with LIYANA Healthcare PLC
 * - subsidiary-lhs   → Subsidiaries under LIYANA Healthcare PLC
 * - root  → LIYANA Healthcare Solutions S.C. (root)
 */
export type OrgNodeType =
  | 'subsidiary-lhs'
  | 'associate'
  | 'pending'
  | 'subsidiary-ldhs'
  | 'root';

export interface OrgNode {
  id: string;
  label: string;
  pillar: Pill;
  order: number;
  type: OrgNodeType;
}

export interface OrgEdge {
  from: string;
  to: string;
}

export interface GraphData {
  nodes: OrgNode[];
  edges: OrgEdge[];
}

// --- Layout helpers
const GRID = { colW: 300, rowH: 80, vGap: 20, hGap: 100 };

function nodePosition(n: OrgNode, pillarIndex: number) {
  const x = pillarIndex * (GRID.colW + GRID.hGap) + 15; // Shift all x positions by 15px to the right
  const y = n.order * (GRID.rowH + GRID.vGap);
  return { x, y };
}

function getColorClass(type: OrgNodeType) {
  switch (type) {
    case 'subsidiary-lhs':
      return 'bg-green-100 text-green-900 border-green-200';
    case 'associate':
      return 'bg-sky-200/70 text-sky-950 border-sky-300';
    case 'pending':
      return 'bg-zinc-300/70 text-zinc-900 border-zinc-400';
    case 'subsidiary-ldhs':
      return 'bg-amber-200/80 text-amber-950 border-amber-300';
    case 'root':
    default:
      return 'bg-white text-zinc-900 border-zinc-200';
  }
}

// --- Components
const Card: React.FC<{
  n: OrgNode;
  active?: boolean;
  onHover?: (id: string | null) => void;
}> = ({ n, active, onHover }) => {
  return (
    <motion.div
      layoutId={n.id}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      onMouseEnter={() => onHover?.(n.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group select-none border rounded-2xl shadow-sm backdrop-blur-sm px-4 py-3 w-[280px] min-h-[60px] flex items-center transition-transform duration-150 hover:scale-[1.03] ${getColorClass(
        n.type
      )}`}
    >
      <div className="text-base font-medium leading-snug">{n.label}</div>
    </motion.div>
  );
};

const Connector: React.FC<{
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number; width: number; height: number };
  active?: boolean;
}> = ({ from, to, active }) => {
  const pathRef = useRef<SVGPathElement>(null);

  const isChildLeft = to.x < from.x;
  const start = {
    x: isChildLeft ? from.x : from.x + from.width,
    y: from.y + from.height / 2,
  };
  const end = {
    x: isChildLeft ? to.x + to.width : to.x,
    y: to.y + to.height / 2,
  };

  const dx = Math.max(50, Math.abs(end.x - start.x) / 2);
  const c1 = { x: start.x + (isChildLeft ? -dx : dx), y: start.y };
  const c2 = { x: end.x + (isChildLeft ? dx : -dx), y: end.y };
  const d = `M ${start.x},${start.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;

  useLayoutEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength() ?? 0;
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    const tl = gsap.timeline();
    tl.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.3,
      ease: 'power2.out',
    });
    return () => {
      tl.kill();
    };
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      className={`fill-none ${
        active ? 'stroke-amber-500' : 'stroke-zinc-400/70'
      }`}
      strokeWidth={2.5}
    />
  );
};

// --- Main Component
export default function LiyanaOrgGraph({ data }: { data: GraphData }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const layouted = useMemo(() => {
    const pillarIndices: Record<Pill, number> = {
      left: 0,
      root: 1,
      mid: 1,
      midSub: 2,
      right: 3,
      rightLeaf: 4,
    };

    const list = [...data.nodes].sort((a, b) =>
      a.pillar === b.pillar
        ? a.order - b.order
        : pillarIndices[a.pillar] - pillarIndices[b.pillar]
    );

    return list.map((n) => ({
      n,
      pos: nodePosition(n, pillarIndices[n.pillar]),
    }));
  }, [data.nodes]); // Only data.nodes is needed now!

  const boardSize = useMemo(() => {
    const xs = layouted.map(({ pos }) => pos.x);
    const ys = layouted.map(({ pos }) => pos.y);
    const width = Math.max(...xs) + GRID.colW + 20; // Extra padding
    const height = Math.max(...ys) + GRID.rowH + 20; // Extra padding
    return { width, height };
  }, [layouted]);

  // Initial position: align top-right (scroll to max left, top=0)
  const updatePosition = () => {
    if (!containerRef.current || !boardRef.current) return;
    // No scaling, original size
    gsap.set(boardRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: '0 0',
    });
    // Align top-left: scroll to the left end, top start
    containerRef.current.scrollLeft = 0;
    containerRef.current.scrollTop = 0;
  };

  useLayoutEffect(updatePosition, [boardSize]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [boardSize]);

  return (
    <div className=" bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 pt-10">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        SUBSIDIARIES & ASSOCIATES
      </SectionHeading>
      <div
        ref={containerRef}
        className="w-full h-[1100px] overflow-auto relative"
      >
        <motion.div
          ref={boardRef}
          className="absolute top-0 left-0 will-change-transform origin-top-left"
          style={{ minWidth: boardSize.width, minHeight: boardSize.height }}
        >
          {/* Connectors */}
          <svg
            className="absolute inset-0"
            width={boardSize.width}
            height={boardSize.height}
          >
            {data.edges.map((e, i) => {
              const from = layouted.find((x) => x.n.id === e.from)!;
              const to = layouted.find((x) => x.n.id === e.to)!;
              const fr = {
                x: from.pos.x,
                y: from.pos.y,
                width: 280,
                height: 60,
              };
              const tr = { x: to.pos.x, y: to.pos.y, width: 280, height: 60 };
              return (
                <Connector
                  key={i}
                  from={fr}
                  to={tr}
                  active={activeId === e.from || activeId === e.to}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {layouted.map(({ n, pos }) => (
            <div
              key={n.id}
              style={{ position: 'absolute', left: pos.x, top: pos.y }}
            >
              <Card n={n} active={activeId === n.id} onHover={setActiveId} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Usage: <LiyanaOrgGraph data={mockGraphData} />

// --- Mock data (replace with API later)
export const mockGraphData: GraphData = {
  nodes: [
    {
      id: 'root',
      label: 'LIYANA Healthcare Solutions S.C.',
      pillar: 'root',
      order: 5,
      type: 'root',
    },
    {
      id: 'boarding',
      label: 'Liyana Boarding School Systems',
      pillar: 'left',
      order: 0,
      type: 'subsidiary-lhs',
    },
    {
      id: 'ophthalmology',
      label: 'Yanet Ophthalmology & Dental Clinic',
      pillar: 'left',
      order: 1,
      type: 'subsidiary-lhs',
    },
    {
      id: 'internalMed',
      label: 'Yanet Internal Medicine Specialized Center',
      pillar: 'left',
      order: 2,
      type: 'subsidiary-lhs',
    },
    {
      id: 'trauma',
      label: 'Yanet Trauma & Surgical Specialized Center',
      pillar: 'left',
      order: 3,
      type: 'subsidiary-lhs',
    },
    {
      id: 'primaryHosp',
      label: 'Yanet Primary Hospital',
      pillar: 'left',
      order: 4,
      type: 'subsidiary-lhs',
    },
    {
      id: 'generalHosp',
      label: 'Yanet General Hospital',
      pillar: 'left',
      order: 5,
      type: 'subsidiary-lhs',
    },
    {
      id: 'college',
      label: 'Yanet-Liyana College Of Health Sciences',
      pillar: 'left',
      order: 6,
      type: 'subsidiary-lhs',
    },
    {
      id: 'yali',
      label: 'Yali Detergents & Cosmetics Manufacturing',
      pillar: 'left',
      order: 7,
      type: 'subsidiary-lhs',
    },
    {
      id: 'research',
      label: 'Liyana Research & Consultancy',
      pillar: 'left',
      order: 8,
      type: 'subsidiary-lhs',
    },
    {
      id: 'advancedDiag',
      label: 'Yanet Advanced Diagnostic & Research Center',
      pillar: 'left',
      order: 9,
      type: 'subsidiary-lhs',
    },
    {
      id: 'lsoxy',
      label: 'LIYANA-Oxy Plc',
      pillar: 'midSub',
      order: 1,
      type: 'associate',
    },
    {
      id: 'onco',
      label: 'ONCO Plc',
      pillar: 'midSub',
      order: 7,
      type: 'associate',
    },
    {
      id: 'digital',
      label: 'LIYANA DIGITAL HEALTHCARE SOLUTIONS SC',
      pillar: 'midSub',
      order: 5,
      type: 'pending',
    },
    {
      id: 'oxyPlant',
      label: 'LIYANA-Oxy Medical & Industrial Gases Manufacturing',
      pillar: 'right',
      order: 0,
      type: 'associate',
    },
    {
      id: 'oncoPath',
      label: 'ONCO Pathology Diagnostic Center',
      pillar: 'right',
      order: 10,
      type: 'associate',
    },
    {
      id: 'liyanaAddis',
      label: 'Liyana-Addis Healthcare SC',
      pillar: 'right',
      order: 1,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'dreamLiyana',
      label: 'DREAM-LIYANA Healthcare PLC',
      pillar: 'right',
      order: 2,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'maal',
      label: 'MAAL Healthcare PLC',
      pillar: 'right',
      order: 8,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'cheliyan',
      label: 'CHELIYAN Healthcare PLC',
      pillar: 'right',
      order: 9,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'gondar',
      label: 'Yanet Multispecialty Center-Gondar',
      pillar: 'rightLeaf',
      order: 0,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'dreamOrtho',
      label: 'DREAM Orthopedic & Trauma Specialty Center',
      pillar: 'rightLeaf',
      order: 1,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'omcc',
      label: 'LIYANA-OMCC Oncology Center',
      pillar: 'rightLeaf',
      order: 2,
      type: 'pending',
    },
    {
      id: 'juba',
      label: 'Juba Kidney Hospital & Diagnostic Services',
      pillar: 'rightLeaf',
      order: 3,
      type: 'pending',
    },
    {
      id: 'gambella',
      label: 'Gambella Advanced Diagnostic Center',
      pillar: 'rightLeaf',
      order: 4,
      type: 'pending',
    },
    {
      id: 'pharmaImport',
      label: 'LIYANA Digital Pharmaceuticals & Medical Supplies Import',
      pillar: 'rightLeaf',
      order: 5,
      type: 'pending',
    },
    {
      id: 'insurance',
      label: 'Health & Life Insurance',
      pillar: 'rightLeaf',
      order: 6,
      type: 'pending',
    },
    {
      id: 'pharmaMfg',
      label: 'Pharmaceuticals Manufacturing (SI-Liyana Manufacturing PLC)',
      pillar: 'rightLeaf',
      order: 7,
      type: 'pending',
    },
    {
      id: 'city',
      label: 'Healthcare City Project',
      pillar: 'rightLeaf',
      order: 8,
      type: 'pending',
    },
    {
      id: 'timeMch',
      label: 'TIME MCH & Surgery Specialty Center',
      pillar: 'rightLeaf',
      order: 9,
      type: 'subsidiary-ldhs',
    },
    {
      id: 'medSurgDiag',
      label: 'Medical, Surgical & Diagnostic Center',
      pillar: 'rightLeaf',
      order: 10,
      type: 'subsidiary-ldhs',
    },
  ],
  edges: [
    ...[
      'boarding',
      'ophthalmology',
      'internalMed',
      'trauma',
      'primaryHosp',
      'generalHosp',
      'college',
      'yali',
      'research',
      'advancedDiag',
      'lsoxy',
      'onco',
      'digital',
    ].map((id) => ({ from: 'root', to: id })),
    { from: 'lsoxy', to: 'oxyPlant' },
    { from: 'onco', to: 'oncoPath' },
    { from: 'digital', to: 'liyanaAddis' },
    { from: 'digital', to: 'dreamLiyana' },
    { from: 'digital', to: 'maal' },
    { from: 'digital', to: 'cheliyan' },
    { from: 'digital', to: 'omcc' },
    { from: 'digital', to: 'juba' },
    { from: 'digital', to: 'gambella' },
    { from: 'digital', to: 'pharmaImport' },
    { from: 'digital', to: 'insurance' },
    { from: 'digital', to: 'pharmaMfg' },
    { from: 'digital', to: 'city' },
    { from: 'liyanaAddis', to: 'gondar' },
    { from: 'dreamLiyana', to: 'dreamOrtho' },
    { from: 'maal', to: 'timeMch' },
    { from: 'cheliyan', to: 'medSurgDiag' },
  ],
};
