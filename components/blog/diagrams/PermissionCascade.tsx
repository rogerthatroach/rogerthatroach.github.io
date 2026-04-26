'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PERMISSION_SETS = [
  {
    label: 'Manager A',
    domains: ['Risk × NA × FY25', 'Risk × EU × FY25'],
    groups: ['Risk-NA-Mgrs', 'Risk-EU-Mgrs'],
    entities: 842,
    events: 1247,
    sql: "WHERE event_id IN (\n  SELECT event_id\n  FROM entitlements\n  WHERE user_id = 'mgr_a'\n  -- 2 domains → 2 groups → 842 entities → 1,247 events\n)",
  },
  {
    label: 'Director B',
    domains: ['Risk × NA × FY25', 'Risk × EU × FY25', 'Risk × APAC × FY25', 'Ops × NA × FY25'],
    groups: ['Risk-NA-Mgrs', 'Risk-EU-Mgrs', 'Risk-APAC-All', 'Ops-NA-Dir'],
    entities: 3214,
    events: 5891,
    sql: "WHERE event_id IN (\n  SELECT event_id\n  FROM entitlements\n  WHERE user_id = 'dir_b'\n  -- 4 domains → 4 groups → 3,214 entities → 5,891 events\n)",
  },
];

const STAGES = ['Domains', 'Access Groups', 'Entities', 'Events', 'SQL Filter'];

export default function PermissionCascade() {
  const [permIdx, setPermIdx] = useState(0);
  const perm = PERMISSION_SETS[permIdx];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Toggle */}
      <div className="flex gap-2">
        {PERMISSION_SETS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPermIdx(i)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              i === permIdx
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Pipeline */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {STAGES.map((stage, i) => {
          const counts = [
            perm.domains.length,
            perm.groups.length,
            perm.entities,
            perm.events,
            1,
          ];
          const stageLabels = ['α', 'β', 'γ', 'δ'];

          return (
            <div key={stage} className="flex flex-1 items-center gap-2">
              <motion.div
                layout
                className="flex-1 rounded-lg border border-border-subtle bg-surface/80 p-3"
              >
                <p className="text-xs font-semibold text-accent">{stage}</p>
                <motion.p
                  key={`${permIdx}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 font-mono text-lg font-bold text-text-primary"
                >
                  {i < 2 ? counts[i] : counts[i].toLocaleString()}
                </motion.p>
                {i < 2 && (
                  <div className="mt-1 space-y-0.5">
                    {(i === 0 ? perm.domains : perm.groups).map((item) => (
                      <p key={item} className="truncate text-[9px] text-text-tertiary">{item}</p>
                    ))}
                  </div>
                )}
              </motion.div>
              {i < STAGES.length - 1 && (
                <div className="hidden flex-col items-center sm:flex">
                  <span className="text-[9px] text-accent">{stageLabels[i]}</span>
                  <span className="text-text-tertiary">→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SQL Output */}
      <motion.pre
        key={permIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs text-text-secondary"
      >
        <code>{perm.sql}</code>
      </motion.pre>
    </div>
  );
}
