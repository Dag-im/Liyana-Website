import { createPortal } from 'react-dom';
import type { LucideIcon } from 'lucide-react';
import { Search } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AppInput from '@/components/system/AppInput';
import { cn } from '@/lib/utils';

export type CommandItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type CommandPaletteProps = {
  commands: CommandItem[];
};

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export default function CommandPalette({ commands }: CommandPaletteProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [anchor, setAnchor] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const filteredCommands = useMemo(() => {
    const q = normalizeQuery(query);
    if (!q) return commands.slice(0, 8);
    return commands
      .filter((c) => c.label.toLowerCase().includes(q))
      .slice(0, 15);
  }, [commands, query]);

  useEffect(() => {
    if (!filteredCommands.length) setActiveIndex(0);
    else setActiveIndex((i) => Math.min(i, filteredCommands.length - 1));
  }, [filteredCommands.length]);

  const focusInput = () => {
    const el = document.getElementById(
      'command-palette-input'
    ) as HTMLInputElement | null;
    el?.focus();
  };

  const recomputeAnchor = () => {
    const el = document.getElementById('command-palette-input')
    if (!el) return
    const rect = el.getBoundingClientRect()
    setAnchor({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        focusInput();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const getNextEnabledIndex = (fromIndex: number, direction: 1 | -1) => {
    if (!filteredCommands.length) return 0;
    let next = fromIndex;
    for (let i = 0; i < filteredCommands.length; i += 1) {
      next = next + direction;
      if (next < 0) next = filteredCommands.length - 1;
      if (next >= filteredCommands.length) next = 0;
      if (!filteredCommands[next]?.disabled) return next;
    }
    return fromIndex;
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current?.contains(target)) return
      if (dropdownRef.current?.contains(target)) return
      setIsOpen(false)
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    recomputeAnchor();

    const onScrollOrResize = () => recomputeAnchor();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen]);

  const selectCommand = (index: number) => {
    const command = filteredCommands[index];
    if (!command || command.disabled) return;
    setIsOpen(false);
    setQuery('');
    navigate(command.path);
  };

  const currentPath = location.pathname;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-50" />
        <AppInput
          id="command-palette-input"
          className="pl-9"
          placeholder="Command palette"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => getNextEnabledIndex(i, 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => getNextEnabledIndex(i, -1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              selectCommand(activeIndex);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
              setQuery('');
            }
          }}
        />
      </div>

      {createPortal(
        isOpen ? (
          <div
            ref={dropdownRef}
            style={
              anchor
                ? {
                    position: 'fixed',
                    top: anchor.top,
                    left: anchor.left,
                    width: anchor.width,
                  }
                : undefined
            }
            className="z-50 rounded-xl border border-border/80 bg-white/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md"
            role="dialog"
            aria-label="Command palette results"
          >
              <div className="flex items-start justify-between gap-3 px-2 py-2">
                <div className="min-w-0">
                  <p className="aura-label text-slate-500">Quick navigation</p>
                  <p className="aura-body text-xs text-slate-500">
                    Type to search, hit Enter to open
                  </p>
                </div>
                <div className="shrink-0 rounded-lg border border-border/60 bg-white/70 px-2 py-1 text-[10px] text-slate-500">
                  Ctrl K
                </div>
              </div>

              <div className="border-t border-border/70" />

              {filteredCommands.length === 0 ? (
                <div className="px-3 py-3 text-sm text-slate-500">
                  No commands found.
                </div>
              ) : (
                <div className="max-h-72 overflow-auto p-1">
                  {filteredCommands.map((command, idx) => {
                    const Icon = command.icon;
                    const isActive = idx === activeIndex;
                    const isCurrent = currentPath === command.path;

                    return (
                      <button
                        key={command.path}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => selectCommand(idx)}
                        disabled={command.disabled}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          command.disabled
                            ? 'cursor-not-allowed text-slate-300'
                            : 'cursor-pointer text-slate-600 hover:bg-slate-100',
                          isActive && !command.disabled
                            ? 'bg-white shadow-sm ring-1 ring-border/60 text-slate-900'
                            : '',
                          isCurrent && !command.disabled ? 'font-medium' : ''
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            command.disabled
                              ? 'text-slate-300'
                              : isActive
                                ? 'text-[#009bd9]'
                                : 'text-slate-600'
                          )}
                        />
                        <span className="truncate">{command.label}</span>
                        {command.disabled ? (
                          <span className="ml-auto text-[10px] text-slate-400">
                            Soon
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        ) : null,
        document.body
      )}
    </div>
  );
}
