'use client';

import {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, CornerDownLeft, Tag } from 'lucide-react';
import type { Persona } from '@/data/themis/types';
import FloatingAvatar from './FloatingAvatar';
import { cn } from '@/lib/utils';

interface ComposerProps {
  personas: Persona[];
  /** Hide a persona from autocomplete (typically the current viewer). */
  excludePersonaIds?: string[];
  placeholder?: string;
  /** Called when user submits. Body has @Name + #tag tokens preserved. */
  onSubmit: (body: string, mentions: string[], tags: string[]) => void;
  /** Compact variant for floating field threads. */
  compact?: boolean;
  autoFocus?: boolean;
}

/**
 * Composer — textarea + @mention autocomplete + #tag autocomplete.
 *
 * Mention tokens: type `@`, see a persona dropdown. Arrow keys navigate,
 * Enter selects (inserts `@displayName ` into the body and records the
 * persona id in `mentions`). Tag tokens: type `#`, see suggestions. Esc
 * dismisses any open menu.
 *
 * Submit: Enter (without shift). Shift+Enter adds a newline.
 */
export default function Composer({
  personas,
  excludePersonaIds = [],
  placeholder = 'Reply to thread… use @ to mention',
  onSubmit,
  compact = false,
  autoFocus = false,
}: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState('');
  const [menu, setMenu] = useState<{ kind: 'mention' | 'tag'; query: string; from: number } | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  // mention persona ids accumulated from picks (re-resolved on submit too)
  const [pickedMentionIds, setPickedMentionIds] = useState<string[]>([]);

  const candidates = useMemo(() => {
    if (!menu) return [];
    if (menu.kind === 'mention') {
      const q = menu.query.toLowerCase();
      return personas
        .filter((p) => !excludePersonaIds.includes(p.id))
        .filter((p) => !q || p.displayName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
        .slice(0, 6);
    }
    // simple tag suggestions — pulled from existing distinct tags would be nicer; static for now
    const SUGGEST = ['urgent', 'data-residency', 'cyber', 'ai', 'regulatory', 'leaver', 'var', 'fx', 'limits'];
    const q = menu.query.toLowerCase();
    return SUGGEST.filter((t) => !q || t.includes(q))
      .slice(0, 6)
      .map((t) => ({ id: t, displayName: t, avatarSeed: t, email: '', accentHex: '#7e6aa8', role: 'submitter' as Persona['role'] }));
  }, [menu, personas, excludePersonaIds]);

  // Auto-focus once mounted (e.g. when ThreadView opens)
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const updateMenuFromCaret = (value: string, caret: number) => {
    // Look back from caret for `@xxx` or `#xxx` not followed by whitespace
    let i = caret - 1;
    let token = '';
    while (i >= 0) {
      const ch = value[i];
      if (ch === '@' || ch === '#') {
        // Ensure it's at start of word (preceded by start-of-string or whitespace)
        const prev = value[i - 1];
        if (i === 0 || prev === ' ' || prev === '\n' || prev === '\t') {
          setMenu({ kind: ch === '@' ? 'mention' : 'tag', query: token, from: i });
          setActiveIdx(0);
          return;
        }
      }
      if (/\s/.test(ch)) break;
      token = ch + token;
      i--;
    }
    setMenu(null);
  };

  const onChange = (value: string, caret: number) => {
    setBody(value);
    updateMenuFromCaret(value, caret);
  };

  const insertCandidate = (c: { id: string; displayName: string }) => {
    if (!menu || !ref.current) return;
    const caret = ref.current.selectionStart ?? body.length;
    const before = body.slice(0, menu.from);
    const after = body.slice(caret);
    const sigil = menu.kind === 'mention' ? '@' : '#';
    const inserted = `${sigil}${c.displayName} `;
    const next = `${before}${inserted}${after}`;
    setBody(next);
    setMenu(null);
    if (menu.kind === 'mention') {
      setPickedMentionIds((ids) => Array.from(new Set([...ids, c.id])));
    }
    // restore caret position right after the inserted token
    requestAnimationFrame(() => {
      const pos = (before + inserted).length;
      ref.current?.setSelectionRange(pos, pos);
      ref.current?.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (menu && candidates.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % candidates.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + candidates.length) % candidates.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertCandidate(candidates[activeIdx]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenu(null);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    // Re-resolve mentions: walk picked list and verify the displayName still appears in body.
    const personaByName = new Map(personas.map((p) => [p.displayName, p.id]));
    const mentions = new Set<string>();
    // 1) ids already picked through autocomplete (most reliable)
    for (const id of pickedMentionIds) {
      const p = personas.find((x) => x.id === id);
      if (p && trimmed.includes(`@${p.displayName}`)) mentions.add(id);
    }
    // 2) fall back to scanning the text for any persona names prefixed with @
    for (const [name, id] of personaByName) {
      if (trimmed.includes(`@${name}`)) mentions.add(id);
    }
    // tags = #word tokens
    const tags = Array.from(
      new Set((trimmed.match(/#([\w-]+)/g) ?? []).map((t) => t.slice(1).toLowerCase())),
    );
    onSubmit(trimmed, Array.from(mentions), tags);
    setBody('');
    setPickedMentionIds([]);
    setMenu(null);
  };

  return (
    <div className={cn('relative', compact ? 'p-2' : 'p-3')}>
      <div className="relative rounded-xl border border-border-subtle bg-surface/70 shadow-[0_1px_0_inset_rgba(255,255,255,0.04)] focus-within:border-[var(--themis-primary)] focus-within:ring-2 focus-within:ring-[var(--themis-primary)]/20">
        <textarea
          ref={ref}
          value={body}
          onChange={(e) => onChange(e.target.value, e.target.selectionStart)}
          onKeyDown={onKeyDown}
          onClick={(e) => updateMenuFromCaret(e.currentTarget.value, e.currentTarget.selectionStart)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className={cn(
            'block w-full resize-none bg-transparent text-text-primary outline-none placeholder:text-text-tertiary',
            compact ? 'px-3 py-2 text-[12.5px]' : 'px-4 py-3 text-[13.5px]',
          )}
        />
        <div
          className={cn(
            'flex items-center justify-between border-t border-border-subtle/60 bg-surface/40',
            compact ? 'px-2 py-1' : 'px-3 py-1.5',
          )}
        >
          <div className="flex items-center gap-1.5 text-text-tertiary">
            <AtSign size={12} aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider">mention</span>
            <span className="mx-1 text-text-tertiary/40">·</span>
            <Tag size={12} aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider">tag</span>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!body.trim()}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-40"
            style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
          >
            <span>Send</span>
            <CornerDownLeft size={11} aria-hidden="true" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && candidates.length > 0 && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-[calc(100%-4px)] left-3 z-50 w-72 overflow-hidden rounded-lg border border-border-subtle bg-surface shadow-xl"
          >
            {candidates.map((c, i) => {
              const isPersona = menu.kind === 'mention';
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertCandidate(c);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-[12px] transition-colors',
                      i === activeIdx ? 'bg-surface-hover' : 'hover:bg-surface-hover/60',
                    )}
                  >
                    {isPersona ? (
                      <FloatingAvatar
                        seed={(c as Persona).avatarSeed}
                        size={22}
                        ringColor={(c as Persona).accentHex}
                        static
                      />
                    ) : (
                      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-surface-hover">
                        <Tag size={11} className="text-text-tertiary" aria-hidden="true" />
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate font-medium text-text-primary">
                        {isPersona ? '' : '#'}
                        {c.displayName}
                      </span>
                      {isPersona && (c as Persona).title && (
                        <span className="truncate text-[10px] text-text-tertiary">
                          {(c as Persona).title}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                      ↵
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
