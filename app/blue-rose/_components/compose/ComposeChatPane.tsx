'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, CornerDownLeft, Paperclip, Sparkles, ThumbsDown, ThumbsUp, Copy, User } from 'lucide-react';
import { useCurrentPersona } from '../../_lib/store';
import {
  PAR_SECTIONS,
  nextHighPriorityFields,
  overallCoverage,
} from '../../_lib/par-schema';
import { cn } from '@/lib/utils';

type Author = 'user' | 'diane' | 'system';

interface ChatTurn {
  id: string;
  author: Author;
  body: ReactNode;
  createdAt: number;
}

interface ComposeChatPaneProps {
  draftId: string;
  state: 'Drafting' | 'Assigning' | 'Ready' | 'Submitted';
  values: Record<string, string | number | boolean>;
  /** Called when the chat input asks to add to a specific field (T2 Phase C). */
  onUserMessage?: (body: string) => void;
}

/**
 * ComposeChatPane — left pane of /compose.
 *
 * Mirrors PAR Phase 1: top bar (back · draft id · state pill), scrollable
 * conversation, bottom composer with paperclip + send. Diane introduces
 * herself, then surfaces the "Most Critical to Complete" priority list
 * computed from the live PAR schema. As the user fills fields (manually
 * or via Diane drafting in Phase C), the list re-derives.
 *
 * T2 Phase A scope: layout + the priority-list intro turn + a static
 * placeholder for the chat input. Phase C wires the file-attach +
 * drafting chain.
 */
export default function ComposeChatPane({
  draftId,
  state,
  values,
  onUserMessage,
}: ComposeChatPaneProps) {
  const persona = useCurrentPersona();
  const [input, setInput] = useState('');
  const [extraTurns, setExtraTurns] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const coverage = overallCoverage(values);
  const priorityFields = useMemo(
    () => nextHighPriorityFields(values, 4),
    [values],
  );

  const introTurn = useMemo<ChatTurn>(
    () => ({
      id: 'd_intro',
      author: 'diane',
      createdAt: Date.now(),
      body: <PriorityIntro coverage={coverage} priorityFields={priorityFields} />,
    }),
    [coverage, priorityFields],
  );

  const turns = useMemo(() => [introTurn, ...extraTurns], [introTurn, extraTurns]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns.length]);

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
    // Phase A: stub Diane reply acknowledging the message.
    setTimeout(() => {
      setExtraTurns((prev) => [
        ...prev,
        {
          id: `d_${Date.now()}`,
          author: 'diane',
          createdAt: Date.now(),
          body: (
            <span>
              Got it. The drafting chain wires up in Phase C — for now I&apos;m
              showing you the form structure and priority-field guidance only.
            </span>
          ),
        },
      ]);
    }, 600);
  };

  return (
    <section
      aria-label="Diane chat"
      className="flex h-full min-h-0 flex-col border-r border-border-subtle bg-surface/40"
    >
      {/* Top bar — draft id + state */}
      <header className="flex shrink-0 items-center gap-2 border-b border-border-subtle/60 px-4 py-3">
        <button
          type="button"
          aria-label="Back"
          onClick={() => history.back()}
          className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <span className="font-mono text-[12px] text-text-primary">{draftId}</span>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ background: 'var(--themis-glass-tint)', color: 'var(--themis-primary)' }}
        >
          {state}
        </span>
      </header>

      {/* Scrollable transcript */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-4">
          {turns.map((t) => (
            <ChatTurnView key={t.id} turn={t} personaName={persona.displayName} />
          ))}
        </ul>
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-border-subtle/60 px-4 py-3"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border-subtle bg-surface/70 px-3 py-2 focus-within:border-[var(--themis-primary)] focus-within:ring-2 focus-within:ring-[var(--themis-primary)]/20">
          <button
            type="button"
            aria-label="Attach files"
            title="Attach (Phase C wires the drafting chain)"
            className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <Paperclip size={14} aria-hidden="true" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or describe what you need…"
            rows={1}
            className="min-h-[20px] flex-1 resize-none bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as unknown as FormEvent);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-40"
            style={{
              background: input.trim() ? 'var(--themis-primary)' : 'transparent',
              color: input.trim() ? 'var(--color-bg)' : 'var(--text-tertiary)',
            }}
          >
            <CornerDownLeft size={12} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          <span>{input.length} characters</span>
          <span className="text-text-tertiary/70">
            See our <a href="#terms" className="underline-offset-2 hover:underline">Terms and Conditions</a>
          </span>
        </p>
      </form>
    </section>
  );
}

function ChatTurnView({ turn, personaName }: { turn: ChatTurn; personaName: string }) {
  const isUser = turn.author === 'user';
  return (
    <li className={cn('flex items-start gap-2.5', isUser && 'flex-row-reverse')}>
      <span
        aria-hidden="true"
        className={cn('flex h-7 w-7 shrink-0 items-center justify-center')}
        style={
          isUser
            ? { background: 'var(--surface-hover)', borderRadius: '999px', color: 'var(--text-secondary)' }
            : {
                background: 'rgba(245, 158, 11, 0.14)',
                borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
                color: '#F59E0B',
              }
        }
      >
        {isUser ? <User size={12} /> : <Sparkles size={12} />}
      </span>
      <div className={cn('min-w-0 flex-1', isUser ? 'text-right' : 'text-left')}>
        <div className={cn('mb-0.5 flex items-baseline gap-2', isUser && 'flex-row-reverse')}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {isUser ? 'You' : 'Diane'}
          </span>
        </div>
        <div
          className={cn(
            'inline-block max-w-[520px] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
            isUser ? 'rounded-tr-md bg-surface-hover text-text-primary' : 'rounded-tl-md text-text-primary',
          )}
          style={
            isUser
              ? undefined
              : { background: 'rgba(245, 158, 11, 0.08)', borderLeft: '2px solid #F59E0B' }
          }
        >
          {turn.body}
        </div>
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Copy"
              className="rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
            >
              <Copy size={11} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Helpful"
              className="rounded p-0.5 text-text-tertiary transition-colors hover:text-[var(--themis-approved)]"
            >
              <ThumbsUp size={11} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Not helpful"
              className="rounded p-0.5 text-text-tertiary transition-colors hover:text-[var(--themis-rejected)]"
            >
              <ThumbsDown size={11} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function PriorityIntro({
  coverage,
  priorityFields,
}: {
  coverage: number;
  priorityFields: ReturnType<typeof nextHighPriorityFields>;
}) {
  const percent = Math.round(coverage * 100);
  if (priorityFields.length === 0) {
    return (
      <span>
        Looks like every required field is filled in. <strong>{percent}%</strong> of
        the form is complete. Open <em>Preview</em> on the right to see the
        rendered document, or hit Submit when you&apos;re ready.
      </span>
    );
  }
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        Most Critical to Complete:
      </p>
      <p>
        To strengthen your PAR for approval, I recommend focusing on these{' '}
        <strong>high-priority fields</strong> first:
      </p>
      <ol className="space-y-1.5 pl-1">
        {priorityFields.map(({ section, field }, i) => (
          <li key={field.key} className="text-text-primary">
            <span className="font-mono text-text-tertiary">{i + 1}.</span>{' '}
            <strong>{field.label}</strong>
            <span className="text-text-secondary">
              {' '}
              — {section.title.toLowerCase()}
            </span>
          </li>
        ))}
      </ol>
      <p>
        Which of these would you like to provide first? You can answer one at a
        time or share multiple details at once, and I&apos;ll update your form
        automatically.
      </p>
    </div>
  );
}
