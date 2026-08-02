'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PERMISSION_SETS = [
  {
    label: 'Manager A',
    domains: ['Risk × NA × FY25', 'Risk × EU × FY25'],
    groups: ['Risk-NA-Mgrs', 'Risk-EU-Mgrs'],
    entities: 842,
    costCentres: 1247,
    sql: "WHERE cost_centre_id IN (\n  SELECT cost_centre_id\n  FROM entitlements\n  WHERE user_id = 'mgr_a'\n  -- 2 domains → 2 groups → 842 entities → 1,247 cost centres\n)",
  },
  {
    label: 'Director B',
    domains: ['Risk × NA × FY25', 'Risk × EU × FY25', 'Risk × APAC × FY25', 'Ops × NA × FY25'],
    groups: ['Risk-NA-Mgrs', 'Risk-EU-Mgrs', 'Risk-APAC-All', 'Ops-NA-Dir'],
    entities: 3214,
    costCentres: 5891,
    sql: "WHERE cost_centre_id IN (\n  SELECT cost_centre_id\n  FROM entitlements\n  WHERE user_id = 'dir_b'\n  -- 4 domains → 4 groups → 3,214 entities → 5,891 cost centres\n)",
  },
];

const STAGES = ['Domains', 'Access Groups', 'Entities', 'Cost Centres', 'SQL Filter'];

export default function PermissionCascade() {
  const [permIdx, setPermIdx] = useState(0);
  const perm = PERMISSION_SETS[permIdx];

  return (
    <div className="flex flex-col gap-6 p-6">
      <p className="text-xs leading-relaxed text-text-tertiary">
        Illustrative synthetic example; identifiers and counts are not production data.
      </p>

      {/* Toggle */}
      <div className="flex gap-2" role="group" aria-label="Choose a synthetic permission example">
        {PERMISSION_SETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPermIdx(i)}
            aria-pressed={i === permIdx}
            aria-controls="permission-cascade-example"
            className={`min-h-11 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              i === permIdx
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-tertiary">
        Synthetic illustration: all names, domains, groups, identities, and counts below are fictional.
      </p>

      <div id="permission-cascade-example" className="space-y-3">
        {/* Pipeline */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {STAGES.map((stage, i) => {
            const counts = [
              perm.domains.length,
              perm.groups.length,
              perm.entities,
              perm.costCentres,
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
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 font-mono text-lg font-bold text-text-primary"
                  >
                    {i < 2 ? counts[i] : counts[i].toLocaleString()}
                  </motion.p>
                  {i < 2 && (
                    <div className="mt-1 space-y-0.5">
                      {(i === 0 ? perm.domains : perm.groups).map((item) => (
                        <p key={item} className="break-words text-[9px] text-text-tertiary">{item}</p>
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
          initial={false}
          animate={{ opacity: 1 }}
          className="overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs text-text-secondary"
        >
          <code>{perm.sql}</code>
        </motion.pre>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {perm.label}: {perm.domains.length} domains, {perm.groups.length} access groups,{' '}
        {perm.entities.toLocaleString()} entities, {perm.costCentres.toLocaleString()} cost centres,
        then one SQL filter.
      </p>

      <noscript>
        <div className="rounded-lg border border-border-subtle bg-surface/50 p-4">
          <p className="text-xs font-semibold text-text-primary">All synthetic permission examples</p>
          <ul className="mt-3 space-y-4">
            {PERMISSION_SETS.map((item) => (
              <li key={item.label}>
                <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {item.domains.length} domains → {item.groups.length} access groups →{' '}
                  {item.entities.toLocaleString()} entities → {item.costCentres.toLocaleString()} cost centres → SQL filter
                </p>
                <code className="mt-2 block overflow-x-auto whitespace-pre text-[10px] text-text-secondary">
                  {item.sql}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
