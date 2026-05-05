'use client';

import type { ReactNode } from 'react';
import type { Persona } from '@/data/themis/types';

/**
 * Render a message body into React nodes, highlighting @mentions and
 * #tags as styled chips. Mentions are matched against known personas
 * (longest-first so "@Alex Chen" beats "@Alex"). Anything else is plain
 * text. Newlines preserved.
 */
export function renderBody(body: string, personas: Persona[]): ReactNode[] {
  // Sort personas by display-name length (longest first) so multi-word
  // names match before single-word prefixes.
  const sorted = [...personas].sort((a, b) => b.displayName.length - a.displayName.length);
  const tokens: ReactNode[] = [];
  let i = 0;
  let buf = '';
  const flush = () => {
    if (buf) {
      tokens.push(buf);
      buf = '';
    }
  };
  while (i < body.length) {
    const ch = body[i];
    if (ch === '@') {
      const matched = sorted.find((p) => body.startsWith(`@${p.displayName}`, i));
      if (matched) {
        flush();
        tokens.push(
          <span
            key={`m-${i}`}
            className="rounded-md px-1 py-0.5 font-medium"
            style={{
              color: matched.accentHex,
              background: `${matched.accentHex}1a`,
            }}
          >
            @{matched.displayName}
          </span>,
        );
        i += 1 + matched.displayName.length;
        continue;
      }
    }
    if (ch === '#') {
      // Match #word
      const m = /^#([\w-]+)/.exec(body.slice(i));
      if (m) {
        flush();
        tokens.push(
          <span
            key={`t-${i}`}
            className="rounded-md bg-surface-hover px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-text-secondary"
          >
            #{m[1]}
          </span>,
        );
        i += m[0].length;
        continue;
      }
    }
    if (ch === '\n') {
      flush();
      tokens.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  // Wrap text fragments so spaces between chips render correctly
  return tokens.map((t, idx) =>
    typeof t === 'string' ? <span key={`s-${idx}`}>{t}</span> : t,
  );
}
