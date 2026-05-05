'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2 } from 'lucide-react';
import { encodeDashboardForShare, type Dashboard } from '../../_lib/dashboard-grid';

interface ShareDashboardButtonProps {
  dashboard: Dashboard | null;
}

export default function ShareDashboardButton({ dashboard }: ShareDashboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    if (!dashboard) return;
    const encoded = encodeDashboardForShare(dashboard);
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}#d=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this share URL:', url);
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      disabled={!dashboard}
      className="relative flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary disabled:opacity-50"
      title="Copy share link"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-1.5"
            style={{ color: 'var(--themis-approved)' }}
          >
            <Check size={11} aria-hidden="true" />
            <span>Link copied</span>
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-1.5"
          >
            <Link2 size={11} aria-hidden="true" />
            <span>Share</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
