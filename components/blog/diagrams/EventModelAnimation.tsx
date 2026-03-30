'use client';

import { useState } from 'react';
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
    const employee = `EMP-${Math.floor(Math.random() * 9000 + 1000)}`;

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
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-xs text-text-tertiary">
        Click a source position, then a target to transfer an employee
      </p>

      {/* Org chart */}
      <div className="grid grid-cols-2 gap-6">
        {rollups.map((rollup, ri) => (
          <div key={rollup} className="rounded-lg border border-border-subtle bg-surface/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">{rollup}</span>
              <motion.span
                key={rollupCounts[ri]}
                initial={{ scale: 1.3, color: '#d4a0a7' }}
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
                    onClick={() => handleClick(pos.id)}
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
                        initial={{ scale: 1.4 }}
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
          <button onClick={reset} className="text-[10px] text-accent hover:underline">Reset</button>
        </div>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          <AnimatePresence>
            {events.length === 0 && (
              <p className="text-[10px] text-text-tertiary">No events yet</p>
            )}
            {events.map((ev, i) => (
              <motion.div
                key={`${i}-${ev.employee}-${ev.type}`}
                initial={{ opacity: 0, x: -8 }}
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
