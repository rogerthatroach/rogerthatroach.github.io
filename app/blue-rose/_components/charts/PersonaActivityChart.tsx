'use client';

import type { PersonaActivityPoint } from '../../_lib/dashboard';
import { usePersonaMap } from '../../_lib/store';
import FloatingAvatar from '../FloatingAvatar';

interface PersonaActivityChartProps {
  data: PersonaActivityPoint[];
}

/**
 * PersonaActivityChart — per-persona stacked bar (approved + in-flight)
 * with avatar + name on the left, counts on the right.
 */
export default function PersonaActivityChart({ data }: PersonaActivityChartProps) {
  const personaMap = usePersonaMap();
  const max = Math.max(1, ...data.map((d) => d.submitted));

  if (data.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        No persona activity to show.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {data.map((row) => {
        const persona = personaMap.get(row.personaId);
        const totalPct = (row.submitted / max) * 100;
        const approvedPct = (row.approved / row.submitted) * totalPct;
        const inFlightPct = (row.inFlight / row.submitted) * totalPct;
        return (
          <li key={row.personaId} className="flex items-center gap-3">
            <FloatingAvatar
              seed={persona?.avatarSeed ?? row.personaId}
              size={26}
              ringColor={persona?.accentHex}
              static
            />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-[12.5px] text-text-primary">
                  {persona?.displayName ?? row.personaId}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  {row.submitted} sub · {row.approved} appr · {row.inFlight} flight
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-surface-hover/60">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${totalPct}%`,
                    background: 'var(--themis-pending)',
                    opacity: 0.35,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${approvedPct}%`,
                    background: 'var(--themis-approved)',
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-full"
                  style={{
                    width: `${inFlightPct}%`,
                    left: `${approvedPct}%`,
                    background: 'var(--themis-in-review)',
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
