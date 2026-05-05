'use client';

import type { Message, Persona } from '@/data/themis/types';
import FloatingAvatar from './FloatingAvatar';
import { renderBody } from '../_lib/render';
import { relativeTime } from '../_lib/format';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, MessageCircleWarning, Send } from 'lucide-react';

const SYS_KIND_LABEL: Record<NonNullable<Message['systemKind']>, { label: string; icon: typeof Send; color: string }> = {
  submitted: { label: 'submitted', icon: Send, color: 'var(--themis-pending)' },
  approved: { label: 'approved', icon: CheckCircle2, color: 'var(--themis-approved)' },
  rejected: { label: 'rejected', icon: XCircle, color: 'var(--themis-rejected)' },
  changes_requested: { label: 'requested changes', icon: MessageCircleWarning, color: 'var(--themis-needs-info)' },
  reassigned: { label: 'reassigned', icon: Send, color: 'var(--themis-pending)' },
};

interface MessageBubbleProps {
  message: Message;
  author: Persona | undefined;
  personas: Persona[];
  isSelf: boolean;
}

export default function MessageBubble({ message, author, personas, isSelf }: MessageBubbleProps) {
  // System events render compact, centered, monochrome
  if (message.systemKind) {
    const meta = SYS_KIND_LABEL[message.systemKind];
    const Icon = meta.icon;
    return (
      <div className="my-2 flex items-center gap-2 px-3">
        <div className="h-px flex-1 bg-border-subtle/60" />
        <span
          className="flex items-center gap-1.5 rounded-full bg-surface-hover/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: meta.color }}
        >
          <Icon size={10} aria-hidden="true" />
          {author?.displayName ?? 'System'} {meta.label}
        </span>
        <div className="h-px flex-1 bg-border-subtle/60" />
      </div>
    );
  }

  const tint = author?.accentHex ?? 'var(--themis-primary)';

  return (
    <div className={cn('group flex items-start gap-3 px-4 py-2', isSelf && 'flex-row-reverse')}>
      <FloatingAvatar
        seed={author?.avatarSeed ?? message.authorPersonaId}
        size={30}
        ringColor={author?.accentHex}
        static
        className="mt-0.5"
      />
      <div className={cn('min-w-0 flex-1', isSelf ? 'text-right' : 'text-left')}>
        <div className={cn('mb-1 flex items-baseline gap-2', isSelf && 'flex-row-reverse')}>
          <span className="text-[12.5px] font-medium text-text-primary">
            {author?.displayName ?? 'Unknown'}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {relativeTime(message.createdAt)}
          </span>
          {author?.title && (
            <span className="hidden text-[11px] text-text-tertiary sm:inline">· {author.title}</span>
          )}
        </div>
        <div
          className={cn(
            'inline-block max-w-[640px] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed text-text-primary shadow-[0_1px_0_inset_rgba(255,255,255,0.04)]',
            isSelf ? 'rounded-tr-md' : 'rounded-tl-md',
          )}
          style={{
            background: `${tint}14`,
            borderLeft: isSelf ? undefined : `2px solid ${tint}`,
            borderRight: isSelf ? `2px solid ${tint}` : undefined,
          }}
        >
          <div className="whitespace-pre-wrap break-words text-left">
            {renderBody(message.body, personas)}
          </div>
        </div>
      </div>
    </div>
  );
}
