'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CornerDownLeft, Paperclip, Sparkles, X } from 'lucide-react';
import { nextHighPriorityFields, overallCoverage } from '../../_lib/par-schema';
import { cn } from '@/lib/utils';

type Author = 'user' | 'diane';

interface ChatTurn {
  id: string;
  author: Author;
  body: ReactNode;
  createdAt: number;
}

interface DianeRibbonProps {
  values: Record<string, string | number | boolean>;
  /** Called when user submits a message. Phase C wires this to the drafting chain. */
  onUserMessage?: (body: string) => void;
}

/**
 * DianeRibbon — Diane as voice, not panel.
 *
 * Collapsed: a slim ribbon pinned bottom-right, with a pulsing concentric-
 * ring ✦ glyph + a single italic whisper ("Most critical to complete: 4
 * fields"). Click to expand.
 *
 * Expanded: a glass card rises from the ribbon, revealing the priority
 * list, recent turns, and a composer with paperclip + send. ESC or X to
 * collapse.
 *
 * Visual lineage: the lock screen's concentric rings + offset-echo owls
 * + "Spoken to Diane" italic. Diane appears, whispers, then withdraws.
 */
export default function DianeRibbon({ values, onUserMessage }: DianeRibbonProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [extraTurns, setExtraTurns] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const coverage = overallCoverage(values);
  const priorityFields = useMemo(
    () => nextHighPriorityFields(values, 4),
    [values],
  );
  const remainingCount = priorityFields.length;
  const percent = Math.round(coverage * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [open, extraTurns.length]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    setExtraTurns((prev) => [
      ...prev,
      { id: `u_${Date.now()}`, author: 'user', body, createdAt: Date.now() },
    ]);
    setInput('');
    onUserMessage?.(body);
    setTimeout(() => {
      setExtraTurns((prev) => [
        ...prev,
        {
          id: `d_${Date.now()}`,
          author: 'diane',
          createdAt: Date.now(),
          body: (
            <span>
              The drafting chain wires up in the next phase — for now I&apos;m
              just here to point you at the priority fields.
            </span>
          ),
        },
      ]);
    }, 600);
  };

  const whisper =
    remainingCount === 0
      ? 'Form is complete. Ready when you are.'
      : `${remainingCount} field${remainingCount === 1 ? '' : 's'} remain to be drafted`;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-30 flex max-w-md flex-col items-end gap-3">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.section
            key="expanded"
            role="dialog"
            aria-label="Diane"
            initial={{ y: 12, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="themis-glass-pop pointer-events-auto flex w-[420px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-border-subtle"
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-border-subtle/60 px-4 py-3">
              <DianeGlyph pulsing />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] font-medium leading-tight text-text-primary">
                  Diane
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                  {percent}% complete · whispering
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </header>

            <div ref={scrollRef} className="min-h-[160px] max-h-[420px] flex-1 overflow-y-auto px-4 py-3">
              {extraTurns.length === 0 ? (
                <PriorityIntro priorityFields={priorityFields} percent={percent} />
              ) : (
                <ul className="space-y-3">
                  <PriorityIntroAsTurn priorityFields={priorityFields} percent={percent} />
                  {extraTurns.map((t) => (
                    <TurnView key={t.id} turn={t} />
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={onSubmit} className="shrink-0 border-t border-border-subtle/60 px-3 py-2.5">
              <div className="flex items-end gap-2 rounded-xl border border-border-subtle bg-surface/70 px-2.5 py-1.5 focus-within:border-[var(--themis-primary)]">
                <button
                  type="button"
                  aria-label="Attach files"
                  title="Attach (Phase C wires the drafting chain)"
                  className="shrink-0 rounded-md p-0.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  <Paperclip size={12} aria-hidden="true" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Speak to Diane…"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(e as unknown as FormEvent);
                    }
                  }}
                  className="min-h-[18px] flex-1 resize-none bg-transparent font-display text-[13px] leading-relaxed text-text-primary outline-none placeholder:italic placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="shrink-0 rounded-md p-1 transition-colors disabled:opacity-40"
                  style={{
                    background: input.trim() ? 'var(--themis-primary)' : 'transparent',
                    color: input.trim() ? 'var(--color-bg)' : 'var(--text-tertiary)',
                  }}
                >
                  <CornerDownLeft size={11} aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.section>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface/85 py-2 pl-2 pr-4 backdrop-blur-md transition-all',
              'hover:border-[var(--themis-primary)]/50 hover:bg-surface/95',
            )}
            style={{
              boxShadow: '0 8px 24px -8px rgba(60, 50, 90, 0.18)',
            }}
            aria-label="Open Diane"
          >
            <DianeGlyph pulsing />
            <span className="font-display text-[13px] italic leading-tight text-text-primary">
              {whisper}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriorityIntro({
  priorityFields,
  percent,
}: {
  priorityFields: ReturnType<typeof nextHighPriorityFields>;
  percent: number;
}) {
  if (priorityFields.length === 0) {
    return (
      <p className="text-[13px] leading-relaxed text-text-primary">
        Every required field is filled. {percent}% complete. Open{' '}
        <em>Preview</em> on the manuscript when you&apos;re ready.
      </p>
    );
  }
  return (
    <div className="space-y-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        Most critical to complete
      </p>
      <p className="text-[13px] leading-relaxed text-text-primary">
        To strengthen this PAR for approval, focus on these{' '}
        <strong>high-priority fields</strong> first:
      </p>
      <ol className="space-y-1.5 pl-1">
        {priorityFields.map(({ section, field }, i) => (
          <li key={field.key} className="text-[12.5px] text-text-primary">
            <span className="font-mono text-text-tertiary">{i + 1}.</span>{' '}
            <strong>{field.label}</strong>
            <span className="text-text-secondary"> — {section.title.toLowerCase()}</span>
          </li>
        ))}
      </ol>
      <p className="text-[12.5px] italic leading-relaxed text-text-secondary">
        Speak one at a time, or describe several together.
      </p>
    </div>
  );
}

function PriorityIntroAsTurn({
  priorityFields,
  percent,
}: {
  priorityFields: ReturnType<typeof nextHighPriorityFields>;
  percent: number;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <DianeGlyph small />
      <div
        className="flex-1 rounded-2xl rounded-tl-md px-3 py-2"
        style={{
          background: 'var(--themis-sakura-bg)',
          borderLeft: `2px solid var(--themis-sakura-border)`,
        }}
      >
        <PriorityIntro priorityFields={priorityFields} percent={percent} />
      </div>
    </li>
  );
}

function TurnView({ turn }: { turn: ChatTurn }) {
  const isUser = turn.author === 'user';
  return (
    <li className={cn('flex items-start gap-2.5', isUser && 'flex-row-reverse')}>
      {isUser ? (
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-hover text-[10px] font-medium uppercase tracking-widest text-text-secondary"
        >
          You
        </span>
      ) : (
        <DianeGlyph small />
      )}
      <div
        className={cn(
          'flex-1 rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
          isUser
            ? 'rounded-tr-md bg-surface-hover text-text-primary'
            : 'rounded-tl-md text-text-primary',
        )}
        style={
          isUser
            ? undefined
            : {
                background: 'var(--themis-sakura-bg)',
                borderLeft: `2px solid var(--themis-sakura-border)`,
              }
        }
      >
        {turn.body}
      </div>
    </li>
  );
}

/**
 * DianeGlyph — concentric-rings ✦ symbol echoing the lock screen.
 * The core is a small ✦ sparkle; pulsing rings emanate outward.
 */
function DianeGlyph({ pulsing, small }: { pulsing?: boolean; small?: boolean }) {
  const size = small ? 22 : 28;
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {pulsing && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid var(--themis-sakura-border)' }}
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid var(--themis-sakura-border)' }}
            animate={{ scale: [1, 1.4, 1.4], opacity: [0.7, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
          />
        </>
      )}
      <span
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: small ? 18 : 22,
          height: small ? 18 : 22,
          background: 'var(--themis-sakura-bg)',
          color: 'var(--themis-sakura)',
        }}
      >
        <Sparkles size={small ? 10 : 12} aria-hidden="true" />
      </span>
    </span>
  );
}
