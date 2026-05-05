'use client';

import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useThemis } from '../../../_lib/store';
import { buildResponse } from '../../../_lib/diane-canned';
import { DEFAULT_SCENARIO } from '../../../_lib/dashboard';
import type { WidgetProps } from './widget-shared';

/**
 * DianeNoteWidget — saved Q&A snippet. Renders the canned response
 * deterministically based on the *currently filtered* submissions, so
 * the answer stays accurate as the dashboard's filter widgets move.
 */
export default function DianeNoteWidget({ widget, submissions, audit }: WidgetProps) {
  if (widget.config.kind !== 'dianeNote') return null;
  const question = widget.config.question;
  const { seed } = useThemis();

  const reply = useMemo(
    () =>
      buildResponse(question, {
        submissions,
        audit,
        personas: seed.personas,
        scenario: DEFAULT_SCENARIO,
      }),
    [question, submissions, audit, seed.personas],
  );

  return (
    <div className="flex h-full gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center"
        style={{
          background: 'rgba(245, 158, 11, 0.14)',
          borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
          color: '#F59E0B',
        }}
      >
        <Sparkles size={12} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          Diane on: <span className="normal-case tracking-normal">{question}</span>
        </p>
        <p
          className="mt-1 inline-block rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed text-text-primary"
          style={{
            background: 'rgba(245, 158, 11, 0.10)',
            borderLeft: '2px solid #F59E0B',
          }}
        >
          {renderInline(reply.body)}
        </p>
      </div>
    </div>
  );
}

function renderInline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}
