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
import { CornerDownLeft, Sparkles, User } from 'lucide-react';
import { useThemis, useCurrentPersona } from '../_lib/store';
import {
  buildResponse,
  DIANE_INTENTS,
  type DianeIntent,
} from '../_lib/diane-canned';
import { type ScenarioOverrides } from '../_lib/dashboard';
import { cn } from '@/lib/utils';

interface DianeChatProps {
  scenario: ScenarioOverrides;
  onFocus?: (focus: DianeIntent['focus']) => void;
}

interface ChatMessage {
  id: string;
  author: 'user' | 'diane';
  body: string;
  confidence?: 'low' | 'medium' | 'high';
  intentId?: string;
  createdAt: number;
}

const SUGGESTED_QUESTIONS = [
  'What\'s our approval rate?',
  'Any anomalies in range?',
  'Who carries the highest spend?',
  'What if we tightened the threshold to $25M?',
];

/**
 * DianeChat — canned-response chat surface for the Insights page.
 *
 * Mocked agent: keyword-bag intent matching against pre-authored Q&A
 * pairs in `_lib/diane-canned.ts`. The agent name + amber accent +
 * squircle indicator + ✦ glyph are the standard layered cues.
 *
 * Token substitution from live dashboard state means the answers stay
 * accurate as filters move. "Diane is composing…" pulse before each
 * reply (~600–1000ms) sells the AI feel without a live model.
 */
export default function DianeChat({ scenario, onFocus }: DianeChatProps) {
  const { seed } = useThemis();
  const persona = useCurrentPersona();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'd_intro',
      author: 'diane',
      body:
        'Ask me anything about what\'s in front of you — approvals, anomalies, who\'s carrying weight, or *what if* we tightened a threshold.',
      confidence: 'high',
      intentId: 'intro',
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [composing, setComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, composing]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || composing) return;
    const now = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: `u_${now}`, author: 'user', body: trimmed, createdAt: now },
    ]);
    setInput('');
    setComposing(true);

    // Simulate a brief composing delay so the AI register lands
    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      const reply = buildResponse(trimmed, {
        submissions: seed.submissions,
        audit: seed.audit,
        personas: seed.personas,
        scenario,
      });
      const replyId = `d_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: replyId,
          author: 'diane',
          body: reply.body,
          confidence: reply.intent.confidence,
          intentId: reply.intent.id,
          createdAt: Date.now(),
        },
      ]);
      setComposing(false);
      if (reply.intent.focus && onFocus) onFocus(reply.intent.focus);
    }, delay);
  };

  const onSuggestedClick = (q: string) => {
    setInput(q);
    // Submit with a tiny delay so the user sees what was typed
    requestAnimationFrame(() => {
      const form = document.querySelector<HTMLFormElement>(
        '#diane-chat-form',
      );
      form?.requestSubmit();
    });
  };

  const showSuggested = messages.length <= 1;

  return (
    <section
      aria-label="Diane chat"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface/40"
    >
      <header className="flex shrink-0 items-center gap-2.5 border-b border-border-subtle/60 px-4 py-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center"
          style={{
            background: 'rgba(245, 158, 11, 0.14)',
            borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
            color: '#F59E0B',
          }}
        >
          <Sparkles size={14} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text-primary">Diane</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
            AI agent · canned responses · scoped to filters
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <ul className="space-y-3">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          <AnimatePresence>
            {composing && (
              <motion.li
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-2 py-1"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center"
                  style={{
                    background: 'rgba(245, 158, 11, 0.14)',
                    borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
                    color: '#F59E0B',
                  }}
                >
                  <Sparkles size={10} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                  Diane is composing
                </span>
                <ComposingDots />
              </motion.li>
            )}
          </AnimatePresence>
        </ul>

        {showSuggested && (
          <div className="mt-4 space-y-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
              Try asking
            </p>
            <ul className="flex flex-col gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => onSuggestedClick(q)}
                    className="rounded-lg border border-border-subtle bg-surface/60 px-2.5 py-1.5 text-left text-[12px] text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:bg-[var(--themis-glass-tint)] hover:text-text-primary"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form
        id="diane-chat-form"
        onSubmit={submit}
        className="shrink-0 border-t border-border-subtle/60 p-2"
      >
        <div className="flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface/70 px-2.5 py-1.5 focus-within:border-[var(--themis-primary)] focus-within:ring-2 focus-within:ring-[var(--themis-primary)]/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Diane…"
            disabled={composing}
            className="flex-1 bg-transparent text-[12.5px] text-text-primary outline-none placeholder:text-text-tertiary disabled:opacity-60"
            aria-label="Message Diane"
          />
          <button
            type="submit"
            disabled={composing || !input.trim()}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-40"
            style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
          >
            <span>Ask</span>
            <CornerDownLeft size={10} aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.author === 'user';
  return (
    <li className={cn('flex items-start gap-2.5', isUser && 'flex-row-reverse')}>
      <span
        aria-hidden="true"
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center',
          isUser
            ? 'rounded-full bg-surface-hover text-text-secondary'
            : '',
        )}
        style={
          isUser
            ? undefined
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
        <div
          className={cn(
            'mb-0.5 flex items-baseline gap-2',
            isUser && 'flex-row-reverse',
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            {isUser ? 'You' : 'Diane replied'}
          </span>
          {message.confidence && !isUser && (
            <span
              className="font-mono text-[9px] uppercase tracking-widest"
              style={{
                color:
                  message.confidence === 'high'
                    ? 'var(--themis-approved)'
                    : message.confidence === 'medium'
                      ? 'var(--themis-in-review)'
                      : 'var(--themis-needs-info)',
              }}
            >
              · {message.confidence} confidence
            </span>
          )}
        </div>
        <div
          className={cn(
            'inline-block max-w-[420px] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
            isUser
              ? 'rounded-tr-md bg-surface-hover text-text-primary'
              : 'rounded-tl-md text-text-primary',
          )}
          style={
            isUser
              ? undefined
              : {
                  background: 'rgba(245, 158, 11, 0.10)',
                  borderLeft: '2px solid #F59E0B',
                }
          }
        >
          <RenderMd body={message.body} />
        </div>
      </div>
    </li>
  );
}

function ComposingDots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1 w-1 rounded-full"
          style={{ background: '#F59E0B' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}

/**
 * Tiny markdown renderer — bold + italic. Keeps the formatting clean
 * without pulling in a markdown lib.
 */
function RenderMd({ body }: { body: string }): ReactNode {
  const tokens = useMemo(() => parseMd(body), [body]);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'bold') return <strong key={i}>{t.text}</strong>;
        if (t.kind === 'italic') return <em key={i}>{t.text}</em>;
        return <span key={i}>{t.text}</span>;
      })}
    </>
  );
}

interface MdToken {
  kind: 'text' | 'bold' | 'italic';
  text: string;
}

function parseMd(s: string): MdToken[] {
  const out: MdToken[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ kind: 'text', text: s.slice(last, m.index) });
    if (m[2]) out.push({ kind: 'bold', text: m[2] });
    else if (m[3]) out.push({ kind: 'italic', text: m[3] });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ kind: 'text', text: s.slice(last) });
  return out;
}

// Suppress an unused import — DIANE_INTENTS is exported in case the
// builder dashboard wants to surface the intent catalog.
void DIANE_INTENTS;
