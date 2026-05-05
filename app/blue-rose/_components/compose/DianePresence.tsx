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
import { CornerDownLeft, Paperclip, Sparkles } from 'lucide-react';
import {
  PAR_SECTIONS,
  isFieldFilled,
  nextHighPriorityFields,
  overallCoverage,
  type FieldSpec,
  type SectionSpec,
} from '../../_lib/par-schema';
import { cn } from '@/lib/utils';

type Author = 'user' | 'diane';

interface ChatTurn {
  id: string;
  author: Author;
  body: ReactNode;
  /** Optional structured chips below the turn body. */
  chips?: { label: string; intent: ChipIntent }[];
  createdAt: number;
}

type ChipIntent =
  | 'walk_remaining'
  | 'review_drafted'
  | 'preview'
  | 'attach'
  | 'jump_to_field';

interface DianePresenceProps {
  draftTitle: string;
  values: Record<string, string | number | boolean>;
  /** Field that Diane should focus on next. When set, shows a "walk-through" turn. */
  focusField: { section: SectionSpec; field: FieldSpec } | null;
  /** Caller sets the focus field (e.g. when user clicks a row in the ledger). */
  onClearFocus: () => void;
  /** Suggestion-chip handlers. */
  onChipPress?: (intent: ChipIntent) => void;
  /** When the user attaches a file (paperclip). */
  onAttachClick?: () => void;
}

/**
 * DianePresence — the centerpiece of /compose.
 *
 * Diane is large, ceremonial, italic. Concentric rings pulse around her
 * ✦ glyph as she speaks. Each turn fades in with a slight delay so the
 * conversation feels written, not pasted. Suggestion chips below her
 * speech let the user steer; the composer at the bottom is the free-
 * form alternative.
 *
 * The form is not visible here — it's the Ledger to the right. Diane
 * narrates what's drafted, what's missing, and what to do next.
 */
export default function DianePresence({
  draftTitle,
  values,
  focusField,
  onClearFocus,
  onChipPress,
  onAttachClick,
}: DianePresenceProps) {
  const [input, setInput] = useState('');
  const [extraTurns, setExtraTurns] = useState<ChatTurn[]>([]);
  const [revealStep, setRevealStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const coverage = overallCoverage(values);
  const percent = Math.round(coverage * 100);
  const priorityFields = useMemo(
    () => nextHighPriorityFields(values, 4),
    [values],
  );
  const completedSections = useMemo(
    () =>
      PAR_SECTIONS.filter(
        (s) =>
          s.fields.length > 0 &&
          s.fields.filter((f) => isFieldFilled(values[f.key])).length ===
            s.fields.length,
      ).length,
    [values],
  );

  // Reveal Diane's intro lines progressively (one every ~600ms)
  useEffect(() => {
    if (extraTurns.length > 0) return; // pause reveal once user starts conversing
    if (revealStep >= 3) return;
    const t = setTimeout(() => setRevealStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [revealStep, extraTurns.length]);

  // Auto-scroll on new turn
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [extraTurns.length, focusField?.field.key]);

  // When a field gets focused (user clicked a ledger row), Diane asks about it
  useEffect(() => {
    if (!focusField) return;
    const turnId = `d_focus_${focusField.field.key}_${Date.now()}`;
    const turn: ChatTurn = {
      id: turnId,
      author: 'diane',
      createdAt: Date.now(),
      body: (
        <span>
          Tell me about{' '}
          <em className="not-italic font-medium" style={{ color: 'var(--themis-primary)' }}>
            {focusField.field.label}
          </em>
          {focusField.field.help ? <span> — {focusField.field.help}</span> : '.'}{' '}
          {focusField.field.kind === 'select' && focusField.field.options && (
            <span className="text-text-secondary">
              Options on the table:{' '}
              {focusField.field.options.slice(0, 3).join(', ')}
              {focusField.field.options.length > 3 ? ', or another' : ''}.
            </span>
          )}
        </span>
      ),
    };
    setExtraTurns((prev) => [...prev, turn]);
    onClearFocus();
  }, [focusField, onClearFocus]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    setExtraTurns((prev) => [
      ...prev,
      { id: `u_${Date.now()}`, author: 'user', body, createdAt: Date.now() },
    ]);
    setInput('');
    setTimeout(() => {
      setExtraTurns((prev) => [
        ...prev,
        {
          id: `d_${Date.now()}`,
          author: 'diane',
          createdAt: Date.now(),
          body: (
            <span>
              I&apos;ll capture that on the next pass. The drafting chain
              wires up in Phase C — for now I&apos;m mapping out where things
              land in the Ledger to the right.
            </span>
          ),
        },
      ]);
    }, 700);
  };

  return (
    <section
      aria-label="Diane"
      className="relative flex h-full min-h-0 flex-col"
    >
      {/* Top of column — Diane's avatar + draft title */}
      <header className="shrink-0 px-8 pt-10 pb-6 text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <DianeAvatar size="hero" pulsing />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
          Drafting
        </p>
        <h1 className="mt-1 font-display text-[26px] font-medium leading-tight tracking-tight text-text-primary">
          {draftTitle}
        </h1>
      </header>

      {/* Conversation transcript */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-8 pb-6">
        <div className="mx-auto max-w-prose space-y-5">
          {/* Intro turn — progressive reveal */}
          <DianeIntroTurn
            percent={percent}
            completedSections={completedSections}
            totalSections={PAR_SECTIONS.length}
            priorityFields={priorityFields}
            revealStep={revealStep}
            onChipPress={onChipPress}
            silenced={extraTurns.length > 0}
          />

          {extraTurns.map((t) => (
            <TurnView key={t.id} turn={t} onChipPress={onChipPress} />
          ))}
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 px-8 pb-6"
      >
        <div className="mx-auto flex max-w-prose items-end gap-3 border-b border-border-subtle/60 pb-2 transition-colors focus-within:border-[var(--themis-primary)]">
          <button
            type="button"
            onClick={onAttachClick}
            aria-label="Attach files"
            title="Attach a memo, policy, or vendor document"
            className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <Paperclip size={14} aria-hidden="true" />
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
            className="min-h-[22px] flex-1 resize-none bg-transparent font-display text-[14px] leading-relaxed text-text-primary outline-none placeholder:italic placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="shrink-0 rounded-md p-1 transition-colors disabled:opacity-40"
            style={{
              color: input.trim() ? 'var(--themis-primary)' : 'var(--text-tertiary)',
            }}
          >
            <CornerDownLeft size={13} aria-hidden="true" />
          </button>
        </div>
        <p className="mx-auto mt-1.5 max-w-prose font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          Speak through the gaps · attach a doc · or pick from the ledger
        </p>
      </form>
    </section>
  );
}

function DianeIntroTurn({
  percent,
  completedSections,
  totalSections,
  priorityFields,
  revealStep,
  onChipPress,
  silenced,
}: {
  percent: number;
  completedSections: number;
  totalSections: number;
  priorityFields: ReturnType<typeof nextHighPriorityFields>;
  revealStep: number;
  onChipPress?: (intent: ChipIntent) => void;
  silenced: boolean;
}) {
  const linesToShow = silenced ? 3 : revealStep;

  const lines: ReactNode[] = [
    <span key="line-1">
      I&apos;ve drafted what I could from the material you uploaded earlier.
      The request sits at <strong>{percent}%</strong> — {completedSections} of{' '}
      {totalSections} sections complete.
    </span>,
    priorityFields.length === 0 ? (
      <span key="line-2">
        Every required field is filled. Open <em>preview</em> to see the
        rendered document, or <em>submit</em> when you&apos;re ready to route
        it to approvers.
      </span>
    ) : (
      <span key="line-2">
        What remains:{' '}
        {priorityFields.slice(0, 3).map((p, i) => (
          <span key={p.field.key}>
            <em
              className="not-italic font-medium"
              style={{ color: 'var(--themis-primary)' }}
            >
              {p.field.label}
            </em>
            {i < Math.min(priorityFields.length, 3) - 1 ? ', ' : ''}
          </span>
        ))}
        {priorityFields.length > 3 ? ', and a few more' : ''}.
      </span>
    ),
    priorityFields.length === 0 ? (
      <span key="line-3">Where would you like to revise?</span>
    ) : (
      <span key="line-3">
        Where would you like to begin? You can{' '}
        <em>speak through the gaps</em> with me, or pick a section from the{' '}
        <em>Ledger</em>.
      </span>
    ),
  ];

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        <AnimatePresence>
          {lines.slice(0, linesToShow).map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-[16px] italic leading-relaxed text-text-primary"
            >
              {line}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Suggestion chips — only after the intro is fully revealed and not silenced */}
      {linesToShow >= 3 && !silenced && priorityFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2 pt-1"
        >
          <Chip
            label="Walk me through the rest"
            onClick={() => onChipPress?.('walk_remaining')}
          />
          <Chip
            label="Review what's drafted"
            onClick={() => onChipPress?.('review_drafted')}
          />
          <Chip
            label="Show me the preview"
            onClick={() => onChipPress?.('preview')}
          />
          <Chip
            label="Attach a memo"
            onClick={() => onChipPress?.('attach')}
            tone="sakura"
          />
        </motion.div>
      )}
    </div>
  );
}

function TurnView({
  turn,
  onChipPress,
}: {
  turn: ChatTurn;
  onChipPress?: (intent: ChipIntent) => void;
}) {
  const isUser = turn.author === 'user';
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-surface-hover px-3 py-2 text-[13px] leading-relaxed text-text-primary">
          {turn.body}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <p className="font-display text-[15px] italic leading-relaxed text-text-primary">
        {turn.body}
      </p>
      {turn.chips && turn.chips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {turn.chips.map((c) => (
            <Chip key={c.label} label={c.label} onClick={() => onChipPress?.(c.intent)} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Chip({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone?: 'sakura';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
        tone === 'sakura'
          ? 'border-[var(--themis-sakura-border)] text-[var(--themis-sakura)] hover:bg-[var(--themis-sakura-pill)]'
          : 'border-border-subtle text-text-secondary hover:border-[var(--themis-primary)]/50 hover:bg-[var(--themis-glass-tint)] hover:text-text-primary',
      )}
    >
      {label}
    </button>
  );
}

/**
 * DianeAvatar — concentric-rings ✦ glyph at 3 sizes (hero / regular /
 * small). Pulsing rings emanate outward when `pulsing`.
 */
export function DianeAvatar({
  size = 'regular',
  pulsing,
}: {
  size?: 'hero' | 'regular' | 'small';
  pulsing?: boolean;
}) {
  const dim = size === 'hero' ? 56 : size === 'small' ? 22 : 30;
  const innerDim = dim - 8;
  const iconSize = size === 'hero' ? 22 : size === 'small' ? 10 : 12;

  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      {pulsing && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid var(--themis-sakura-border)' }}
            animate={{ scale: [1, 1.7, 1.7], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid var(--themis-sakura-border)' }}
            animate={{ scale: [1, 1.45, 1.45], opacity: [0.7, 0, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.7,
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid var(--themis-sakura-border)' }}
            animate={{ scale: [1, 1.25, 1.25], opacity: [0.85, 0, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 1.4,
            }}
          />
        </>
      )}
      <span
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: innerDim,
          height: innerDim,
          background: 'var(--themis-sakura-bg)',
          color: 'var(--themis-sakura)',
          boxShadow: '0 0 0 1px var(--themis-sakura-border)',
        }}
      >
        <Sparkles size={iconSize} aria-hidden="true" />
      </span>
    </span>
  );
}
