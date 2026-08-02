'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Position {
  id: string;
  label: string;
  rollup: string;
  count: number;
}

interface EventLog {
  type: string;
  from?: string;
  to?: string;
  employee: string;
}

const INITIAL_POSITIONS: Position[] = [
  { id: 'a1', label: 'Risk Analyst', rollup: 'Division A', count: 12 },
  { id: 'a2', label: 'Risk Manager', rollup: 'Division A', count: 5 },
  { id: 'b1', label: 'Ops Analyst', rollup: 'Division B', count: 8 },
  { id: 'b2', label: 'Ops Manager', rollup: 'Division B', count: 3 },
];

export default function EventModelAnimation() {
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const nextEmployeeId = useRef(1001);

  const rollups = ['Division A', 'Division B'];
  const rollupCounts = rollups.map((r) =>
    positions.filter((p) => p.rollup === r).reduce((s, p) => s + p.count, 0)
  );

  const handleClick = (posId: string) => {
    if (!selectedFrom) {
      setSelectedFrom(posId);
      return;
    }

    if (selectedFrom === posId) {
      setSelectedFrom(null);
      return;
    }

    const from = positions.find((p) => p.id === selectedFrom)!;
    const to = positions.find((p) => p.id === posId)!;

    if (from.count <= 0) {
      setSelectedFrom(null);
      return;
    }

    const isIntraRollup = from.rollup === to.rollup;
    const employee = `EMP-${nextEmployeeId.current}`;
    nextEmployeeId.current += 1;

    setPositions((prev) =>
      prev.map((p) => {
        if (p.id === selectedFrom) return { ...p, count: p.count - 1 };
        if (p.id === posId) return { ...p, count: p.count + 1 };
        return p;
      })
    );

    setEvents((prev) => [
      { type: 'Move Out', from: from.label, employee },
      { type: 'Move In', to: to.label, employee },
      ...(isIntraRollup ? [{ type: 'Net Zero', from: from.rollup, employee }] : []),
      ...prev,
    ].slice(0, 8));

    setSelectedFrom(null);
  };

  const reset = () => {
    setPositions(INITIAL_POSITIONS);
    setEvents([]);
    setSelectedFrom(null);
    nextEmployeeId.current = 1001;
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-xs text-text-tertiary">
        Select a source position, then select a target to transfer one illustrative employee.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {selectedFrom
          ? `${positions.find((position) => position.id === selectedFrom)?.label} selected as the source. Select a target position.`
          : 'No source selected.'}
      </p>

      {/* Org chart */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {rollups.map((rollup, ri) => (
          <div key={rollup} className="rounded-lg border border-border-subtle bg-surface/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">{rollup}</span>
              <motion.span
                key={rollupCounts[ri]}
                initial={false}
                animate={{ scale: 1, color: 'var(--color-text-tertiary)' }}
                className="font-mono text-sm font-bold"
              >
                HC: {rollupCounts[ri]}
              </motion.span>
            </div>
            <div className="space-y-2">
              {positions
                .filter((p) => p.rollup === rollup)
                .map((pos) => (
                  <motion.button
                    key={pos.id}
                    type="button"
                    onClick={() => handleClick(pos.id)}
                    aria-pressed={selectedFrom === pos.id}
                    aria-label={`${pos.label}, illustrative headcount ${pos.count}${selectedFrom === pos.id ? ', selected as transfer source' : ''}`}
                    className={`w-full rounded-md border p-2 text-left transition-colors ${
                      selectedFrom === pos.id
                        ? 'border-accent bg-accent-muted'
                        : 'border-border-subtle hover:bg-surface-hover'
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">{pos.label}</span>
                      <motion.span
                        key={pos.count}
                        initial={false}
                        animate={{ scale: 1 }}
                        className="font-mono text-xs font-bold text-text-primary"
                      >
                        {pos.count}
                      </motion.span>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Event log */}
      <div className="rounded-lg border border-border-subtle bg-surface/30 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-primary">Event Log</span>
          <button type="button" onClick={reset} className="text-[10px] text-accent hover:underline">Reset</button>
        </div>
        <div className="max-h-32 space-y-1 overflow-y-auto" role="log" aria-live="polite" aria-relevant="additions">
          <AnimatePresence>
            {events.length === 0 && (
              <p className="text-[10px] text-text-tertiary">No events yet</p>
            )}
            {events.map((ev, i) => (
              <motion.div
                key={`${i}-${ev.employee}-${ev.type}`}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[10px] font-mono ${
                  ev.type === 'Net Zero' ? 'text-green-400' :
                  ev.type === 'Move Out' ? 'text-red-400' : 'text-blue-400'
                }`}
              >
                [{ev.type}] {ev.employee}
                {ev.from && ` from ${ev.from}`}
                {ev.to && ` to ${ev.to}`}
                {ev.type === 'Net Zero' && ` — ${ev.from} ΔHC = 0`}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
