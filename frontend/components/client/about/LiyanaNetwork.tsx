'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ─── Type Definitions ───
type NodeTypeName =
  | 'root'
  | 'subsidiary-lhs'
  | 'associate'
  | 'subsidiary-ldhs'
  | 'pending';

interface NodeStyle {
  border: string;
  badge: string;
  text: string;
}

interface NodeData {
  id: string;
  label: string;
  type: string;
  description?: string;
  href?: string;
}

interface EdgeData {
  from: string;
  to: string;
}

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

interface LayoutNode extends NodeData {
  x: number;
  y: number;
}

interface LayoutEdge extends EdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  srcType: string;
  toLeft: boolean;
}

// ─── Constants & Theme ───
const CW = 400; // Card Width
const CH = 150; // Card Height
const COL_GAP = 300;
const ROW_GAP = 30;
// Increased padding to prevent left-curving arrows from being clipped
const PAD = 200;

const NS: Record<string, NodeStyle> = {
  root: { border: '#0ea5e9', badge: 'Root Entity', text: '#0f172a' },
  'subsidiary-lhs': {
    border: '#10b981',
    badge: 'Subsidiary (LHS)',
    text: '#0f172a',
  },
  associate: { border: '#6366f1', badge: 'Associate', text: '#0f172a' },
  'subsidiary-ldhs': {
    border: '#f59e0b',
    badge: 'Subsidiary (LDHS)',
    text: '#0f172a',
  },
  pending: { border: '#94a3b8', badge: 'Project / Pending', text: '#64748b' },
};

const EC: Record<string, string> = {
  root: '#0ea5e9',
  'subsidiary-lhs': '#10b981',
  associate: '#6366f1',
  'subsidiary-ldhs': '#f59e0b',
  pending: '#cbd5e1',
};

// ─── Layout Logic ───
function computeLayout(data: GraphData) {
  const { nodes, edges } = data;
  const CM = new Map<string, string[]>();
  const PM = new Map<string, string[]>();
  nodes.forEach((n) => {
    CM.set(n.id, []);
    PM.set(n.id, []);
  });
  edges.forEach((e) => {
    CM.get(e.from)?.push(e.to);
    PM.get(e.to)?.push(e.from);
  });

  const root = nodes.find((n) => !PM.get(n.id)?.length) ?? nodes[0];
  const rootCh = CM.get(root.id) ?? [];

  // Split left/right based on type
  const leftSet = new Set(
    rootCh.filter(
      (id) => nodes.find((n) => n.id === id)?.type === 'subsidiary-lhs'
    )
  );
  const rightSet = new Set(rootCh.filter((id) => !leftSet.has(id)));

  function bfs(starts: string[], dir: number) {
    const lm = new Map<string, number>();
    starts.forEach((id) => lm.set(id, dir));
    const q = [...starts];
    while (q.length) {
      const id = q.shift()!;
      const col = lm.get(id)!;
      CM.get(id)?.forEach((cid) => {
        if (!lm.has(cid) && cid !== root.id) {
          lm.set(cid, col + dir);
          q.push(cid);
        }
      });
    }
    return lm;
  }

  const LL = bfs([...leftSet], -1);
  const RL = bfs([...rightSet], 1);
  const colMap = new Map<string, number>([[root.id, 0]]);
  LL.forEach((c, id) => colMap.set(id, c));
  RL.forEach((c, id) => colMap.set(id, c));

  const groups = new Map<number, string[]>();
  nodes.forEach((n) => {
    const c = colMap.get(n.id) ?? 0;
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c)!.push(n.id);
  });

  const cols = [...groups.keys()].sort((a, b) => a - b);
  const pos = new Map<string, { y: number }>();

  // Initial vertical stacking
  cols.forEach((col) => {
    groups
      .get(col)!
      .forEach((id, i) => pos.set(id, { y: PAD + i * (CH + ROW_GAP) }));
  });

  // Center alignment logic
  cols.forEach((col) => {
    if (col === 0) return;
    const grp = groups.get(col)!;
    const parentYs = grp.flatMap((id) =>
      (PM.get(id) ?? []).map((pid) => pos.get(pid)?.y).filter((y) => y != null)
    );
    if (parentYs.length) {
      const avgParentY =
        (Math.min(...(parentYs as number[])) +
          Math.max(...(parentYs as number[]))) /
        2;
      const groupHeight = grp.length * (CH + ROW_GAP) - ROW_GAP;
      const startY = avgParentY - groupHeight / 2 + CH / 2;
      const currentsy = pos.get(grp[0])?.y ?? 0;
      const shift = startY - currentsy;
      grp.forEach((id) => {
        const p = pos.get(id);
        if (p) pos.set(id, { y: p.y + shift });
      });
    }
  });

  const minCol = Math.min(...cols);
  const colToX = (col: number) => PAD + (col - minCol) * (CW + COL_GAP);

  const lnodes: LayoutNode[] = nodes.map((n) => ({
    ...n,
    x: colToX(colMap.get(n.id) ?? 0),
    y: pos.get(n.id)?.y ?? PAD,
  }));
  const minY = Math.min(...lnodes.map((n) => n.y));
  lnodes.forEach((n) => {
    n.y = n.y - minY + PAD;
  });

  const NM = new Map(nodes.map((n) => [n.id, n]));

  const ledges: LayoutEdge[] = edges
    .map((e) => {
      const fn = lnodes.find((n) => n.id === e.from);
      const tn = lnodes.find((n) => n.id === e.to);
      if (!fn || !tn) return null;

      const toLeft = tn.x < fn.x;
      return {
        ...e,
        x1: toLeft ? fn.x : fn.x + CW,
        y1: fn.y + CH / 2,
        x2: toLeft ? tn.x + CW : tn.x,
        y2: tn.y + CH / 2,
        srcType: NM.get(e.from)?.type ?? 'root',
        toLeft,
      };
    })
    .filter((e): e is LayoutEdge => !!e);

  const xs = lnodes.map((n) => n.x);
  const ys = lnodes.map((n) => n.y);
  return {
    nodes: lnodes,
    edges: ledges,
    width: Math.max(...xs) + CW + PAD,
    height: Math.max(...ys) + CH + PAD,
  };
}

// ─── Zoom/Pan Hook ───
function useZoomPan(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [tr, setTr] = useState({ x: 0, y: 0, s: 1 });
  const minScaleRef = useRef(0.1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const clampScale = (s: number) =>
    Math.min(2, Math.max(minScaleRef.current, s));

  const zoomAt = useCallback((delta: number, cx: number, cy: number) => {
    setTr((t) => {
      const ns = clampScale(t.s * (1 + delta));
      if (Math.abs(ns - t.s) < 0.0001) return t;
      const r = ns / t.s;
      return { s: ns, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) };
    });
  }, []);

  const fit = useCallback(
    (contentW: number, contentH: number) => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const s = Math.min(width / (contentW + 100), height / (contentH + 100));
      minScaleRef.current = s;
      setTr({
        s,
        x: (width - contentW * s) / 2,
        y: (height - contentH * s) / 2,
      });
    },
    [containerRef]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (tr.s <= minScaleRef.current + 0.001) return;
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    },
    [containerRef, tr.s]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setTr((t) => ({
        ...t,
        x: t.x + e.clientX - lastPos.current.x,
        y: t.y + e.clientY - lastPos.current.y,
      }));
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      dragging.current = false;
      if (containerRef.current)
        containerRef.current.style.cursor =
          tr.s > minScaleRef.current + 0.001 ? 'grab' : 'default';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [containerRef, tr.s]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(-e.deltaY * 0.001, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [containerRef, zoomAt]);

  return { tr, setTr, fit, onMouseDown, zoomAt, minScale: minScaleRef.current };
}

// ─── Sub-Components ───

function Drawer({ node, onClose }: { node: NodeData; onClose: () => void }) {
  const s = NS[node.type] || NS.root;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          pointerEvents: 'auto',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 400,
          background: '#ffffff',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
          pointerEvents: 'auto',
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `8px solid ${s.border}`,
          animation: 'slideIn 0.25s ease-out',
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <button
          onClick={onClose}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: 'pointer',
            color: '#94a3b8',
            lineHeight: 1,
          }}
        >
          &times;
        </button>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: s.border,
            marginBottom: 12,
            marginTop: 10,
          }}
        >
          {NS[node.type]?.badge}
        </span>
        <h3
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 20px 0',
            lineHeight: 1.2,
          }}
        >
          {node.label}
        </h3>
        <div
          style={{
            width: '100%',
            height: 1,
            background: '#e2e8f0',
            marginBottom: 20,
          }}
        />
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#334155' }}>
          {node.description ||
            'No additional details available for this entity.'}
        </p>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 30,
        left: 30,
        zIndex: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        padding: '16px 20px',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        Legend
      </span>
      {Object.entries(NS).map(([key, style]) => (
        <div
          key={key}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: style.border,
            }}
          ></div>
          <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
            {style.badge}
          </span>
        </div>
      ))}
    </div>
  );
}

function Markers() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {Object.keys(NS).map((t) => (
          <marker
            key={`m-${t}`}
            id={`arrow-${t}`}
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L0,8 L12,4 z" fill={EC[t]} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

// ─── Default Data ───
const DATA = {
  nodes: [
    {
      id: 'root',
      label: 'LIYANA Healthcare Solutions S.C.',
      type: 'root',
      description:
        'The root holding company for all LIYANA entities across Ethiopia and beyond.',
    },
    {
      id: 'boarding',
      label: 'Liyana Boarding School Systems',
      type: 'subsidiary-lhs',
      description: 'Boarding school infrastructure managed under LHS.',
    },
    {
      id: 'ophthalmology',
      label: 'Yanet Ophthalmology & Dental Clinic',
      type: 'subsidiary-lhs',
    },
    {
      id: 'internalMed',
      label: 'Yanet Internal Medicine Specialized Center',
      type: 'subsidiary-lhs',
    },
    {
      id: 'trauma',
      label: 'Yanet Trauma & Surgical Specialized Center',
      type: 'subsidiary-lhs',
    },
    {
      id: 'primaryHosp',
      label: 'Yanet Primary Hospital',
      type: 'subsidiary-lhs',
    },
    {
      id: 'generalHosp',
      label: 'Yanet General Hospital',
      type: 'subsidiary-lhs',
    },
    {
      id: 'college',
      label: 'Yanet-Liyana College Of Health Sciences',
      type: 'subsidiary-lhs',
    },
    {
      id: 'yali',
      label: 'Yali Detergents & Cosmetics Manufacturing',
      type: 'subsidiary-lhs',
    },
    {
      id: 'research',
      label: 'Liyana Research & Consultancy',
      type: 'subsidiary-lhs',
    },
    {
      id: 'advancedDiag',
      label: 'Yanet Advanced Diagnostic & Research Center',
      type: 'subsidiary-lhs',
    },
    {
      id: 'lsoxy',
      label: 'LIYANA-Oxy Plc',
      type: 'associate',
      description: 'Associate focused on oxygen and industrial gases supply.',
    },
    {
      id: 'onco',
      label: 'ONCO Plc',
      type: 'associate',
      description: 'Oncology associate entity.',
    },
    {
      id: 'digital',
      label: 'LIYANA Digital Healthcare Solutions SC',
      type: 'pending',
      description: 'Digital healthcare arm — projects currently underway.',
    },
    {
      id: 'oxyPlant',
      label: 'LIYANA-Oxy Medical & Industrial Gases Manufacturing',
      type: 'associate',
    },
    {
      id: 'oncoPath',
      label: 'ONCO Pathology Diagnostic Center',
      type: 'associate',
    },
    {
      id: 'liyanaAddis',
      label: 'Liyana-Addis Healthcare SC',
      type: 'subsidiary-ldhs',
    },
    {
      id: 'dreamLiyana',
      label: 'DREAM-LIYANA Healthcare PLC',
      type: 'subsidiary-ldhs',
    },
    { id: 'maal', label: 'MAAL Healthcare PLC', type: 'subsidiary-ldhs' },
    {
      id: 'cheliyan',
      label: 'CHELIYAN Healthcare PLC',
      type: 'subsidiary-ldhs',
    },
    {
      id: 'gondar',
      label: 'Yanet Multispecialty Center–Gondar',
      type: 'subsidiary-ldhs',
    },
    {
      id: 'dreamOrtho',
      label: 'DREAM Orthopedic & Trauma Specialty Center',
      type: 'subsidiary-ldhs',
    },
    { id: 'omcc', label: 'LIYANA-OMCC Oncology Center', type: 'pending' },
    {
      id: 'juba',
      label: 'Juba Kidney Hospital & Diagnostic Services',
      type: 'pending',
    },
    {
      id: 'gambella',
      label: 'Gambella Advanced Diagnostic Center',
      type: 'pending',
    },
    {
      id: 'pharmaImport',
      label: 'LIYANA Digital Pharmaceuticals & Medical Supplies Import',
      type: 'pending',
    },
    { id: 'insurance', label: 'Health & Life Insurance', type: 'pending' },
    {
      id: 'pharmaMfg',
      label: 'Pharmaceuticals Manufacturing (SI-Liyana)',
      type: 'pending',
    },
    { id: 'city', label: 'Healthcare City Project', type: 'pending' },
    {
      id: 'timeMch',
      label: 'TIME MCH & Surgery Specialty Center',
      type: 'subsidiary-ldhs',
    },
    {
      id: 'medSurgDiag',
      label: 'Medical, Surgical & Diagnostic Center',
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

// ─── Main Component ───
export default function LiyanaStructure({ data = DATA }: { data?: GraphData }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { tr, setTr, fit, onMouseDown, zoomAt, minScale } =
    useZoomPan(containerRef);
  const layout = useMemo(() => computeLayout(data), [data]);

  // Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial Fit
  useEffect(() => {
    if (!isMobile && layout)
      setTimeout(() => fit(layout.width, layout.height), 50);
  }, [layout, fit, isMobile]);

  const connectedIds = useMemo(() => {
    if (!activeId) return new Set();
    const ids = new Set([activeId]);
    data.edges.forEach((e) => {
      if (e.from === activeId) ids.add(e.to);
      if (e.to === activeId) ids.add(e.from);
    });
    return ids;
  }, [activeId, data]);

  const canDrag = tr.s > minScale + 0.001;

  // ─── Render: Mobile List View ───
  if (isMobile) {
    return (
      <section
        style={{
          width: '100%',
          height: '90vh',
          background: 'transparent',
          fontFamily: '"Inter", sans-serif',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '24px 20px',
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            Corporate Network
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Scroll to view all entities
          </p>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {data.nodes.map((n) => {
            const s = NS[n.type] || NS.root;
            return (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{
                  padding: '20px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  backgroundColor: `${s.border}15`,
                  borderLeft: `6px solid ${s.border}`,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: s.border,
                    marginBottom: 6,
                  }}
                >
                  {s.badge}
                </div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}
                >
                  {n.label}
                </div>
              </div>
            );
          })}
        </div>
        {selectedNode && (
          <Drawer node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </section>
    );
  }

  // ─── Render: Desktop Graph View ───
  return (
    <section
      style={{
        width: '100%',
        position: 'relative',
        fontFamily: '"Inter", system-ui, sans-serif',
        background: 'transparent',
        height: '90vh',
        overflow: 'hidden',
        // Change to flex column so header doesn't push canvas out of view
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Markers />

      {/* Header */}
      <div
        style={{ flexShrink: 0, padding: '30px 30px 10px 30px', zIndex: 10 }}
      >
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-4"
        >
          Liyana Corporate Network
        </SectionHeading>
        <p
          style={{
            margin: '0',
            fontSize: 14,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          {canDrag
            ? 'Mode: Interactive (Drag to pan)'
            : 'Mode: Overview (Zoom in to pan)'}
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        style={{
          flex: 1,
          width: '100%',
          cursor: canDrag ? 'grab' : 'default',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(${tr.x}px, ${tr.y}px) scale(${tr.s})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          {layout && (
            <div
              style={{
                width: layout.width,
                height: layout.height,
                position: 'relative',
              }}
            >
              <svg
                width={layout.width}
                height={layout.height}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  overflow: 'visible',
                }}
              >
                {layout.edges.map((e, i) => {
                  const isActive =
                    activeId &&
                    connectedIds.has(e.from) &&
                    connectedIds.has(e.to);
                  const isDimmed = activeId && !isActive;

                  // Control Points Calculation (Fix for Left-side Arrows)
                  const dx = Math.abs(e.x2 - e.x1) * 0.55;
                  const cp1x = e.toLeft ? e.x1 - dx : e.x1 + dx;
                  const cp2x = e.toLeft ? e.x2 + dx : e.x2 - dx;

                  const d = `M${e.x1},${e.y1} C${cp1x},${e.y1} ${cp2x},${e.y2} ${e.x2},${e.y2}`;

                  return (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke={EC[e.srcType]}
                      strokeWidth={isActive ? 3 : 1.5}
                      opacity={isDimmed ? 0.1 : 0.6}
                      markerEnd={`url(#arrow-${e.srcType})`}
                      style={{ transition: 'opacity 0.2s' }}
                    />
                  );
                })}
              </svg>

              {layout.nodes.map((n) => {
                const s = NS[n.type] || NS.root;
                const isDimmed = activeId && !connectedIds.has(n.id);
                const isSelected = selectedNode?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onMouseEnter={() => setActiveId(n.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(n);
                    }}
                    style={{
                      position: 'absolute',
                      left: n.x,
                      top: n.y,
                      width: CW,
                      height: CH,
                      backgroundColor: `${s.border}15`,
                      border: '1px solid #e2e8f0',
                      borderTop: `6px solid ${s.border}`,
                      borderRadius: '0 0 8px 8px',
                      boxShadow: isSelected
                        ? `0 0 0 3px ${s.border}44`
                        : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0 24px',
                      opacity: isDimmed ? 0.3 : 1,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: s.text,
                        lineHeight: 1.3,
                      }}
                    >
                      {n.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          onClick={() => zoomAt(0.25, 0, 0)}
          style={fabStyle}
          title="Zoom In"
        >
          ＋
        </button>
        <button
          onClick={() => zoomAt(-0.25, 0, 0)}
          style={fabStyle}
          title="Zoom Out"
          disabled={!canDrag}
        >
          −
        </button>
        <button
          onClick={() => layout && fit(layout.width, layout.height)}
          style={fabStyle}
          title="Reset View"
        >
          ⊞
        </button>
      </div>

      <Legend />
      {selectedNode && (
        <Drawer node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </section>
  );
}

const fabStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  fontSize: 18,
  color: '#334155',
  cursor: 'pointer',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
