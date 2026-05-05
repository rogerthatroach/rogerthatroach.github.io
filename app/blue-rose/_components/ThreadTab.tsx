'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useThemis, useCurrentPersona, usePersonaMap } from '../_lib/store';
import MessageBubble from './MessageBubble';
import Composer from './Composer';
import { staggerContainer } from '@/lib/motion';

/**
 * ThreadTab — chat surface, relocated into the right pane as a tab.
 *
 * Renders the whole-submission thread: messages list + composer. The
 * action buttons (Approve / Reject / Request info) stay in the
 * SubmissionView header — the chat is purely conversational.
 */
export default function ThreadTab() {
  const {
    seed,
    selectedSubmissionId,
    messages,
    addMessage,
    markThreadRead,
  } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const scrollRef = useRef<HTMLDivElement>(null);

  const submission = useMemo(
    () => seed.submissions.find((s) => s.id === selectedSubmissionId) ?? null,
    [seed.submissions, selectedSubmissionId],
  );

  const threadMessages = useMemo(() => {
    if (!submission) return [];
    return messages
      .filter((m) => m.threadId === submission.threadId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [messages, submission]);

  useEffect(() => {
    if (submission) markThreadRead(submission.threadId);
  }, [submission, persona.id, markThreadRead]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [threadMessages.length, submission?.id]);

  if (!submission) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <MessageSquare size={20} className="text-text-tertiary" aria-hidden="true" />
        <p className="text-[12px] text-text-tertiary">
          Open a submission to see its thread.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {threadMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <MessageSquare size={20} className="text-text-tertiary" aria-hidden="true" />
            <p className="text-[12px] text-text-tertiary">
              No messages yet — start the conversation below.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-1"
          >
            {threadMessages.map((m) => {
              const author = personaMap.get(m.authorPersonaId);
              return (
                <MessageBubble
                  key={m.id}
                  message={m}
                  author={author}
                  personas={seed.personas}
                  isSelf={m.authorPersonaId === persona.id}
                />
              );
            })}
          </motion.div>
        )}
      </div>
      <div className="border-t border-border-subtle bg-background/40">
        <Composer
          personas={seed.personas}
          excludePersonaIds={[persona.id]}
          placeholder={`Reply as ${persona.displayName}… use @ to mention, # to tag`}
          onSubmit={(body, mentions, tags) => {
            addMessage(submission.threadId, body, mentions, tags);
          }}
        />
      </div>
    </div>
  );
}
