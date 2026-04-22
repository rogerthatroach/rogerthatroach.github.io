'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import type { LeveledNodeData } from '@/data/playgroundDiagrams';

/**
 * Slide-in detail panel shown when a leaf node (no drillTo) is clicked.
 * Sits absolutely over the right side of the diagram canvas. Esc or X
 * closes. Keyboard-operable via the close button; no focus-trapping for
 * this lighter disclosure surface.
 */
export default function NodeDetailPanel({
  node,
  onClose,
}: {
  node: LeveledNodeData;
  onClose: () => void;
}) {
  const detail = node.detail;
  if (!detail) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="absolute right-3 top-3 z-20 w-[min(22rem,calc(100%-1.5rem))] max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-xl border border-border-subtle bg-surface/95 p-4 shadow-xl backdrop-blur-md md:p-5"
    >
      <div className="flex items-start justify-between gap-3 pb-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {node.label}
          </p>
          <h4 className="mt-0.5 font-display text-base font-bold tracking-tight text-text-primary">
            {detail.heading}
          </h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="border-t border-border-subtle pt-3">
        <p className="text-xs leading-relaxed text-text-secondary">{detail.body}</p>

        {detail.code && (
          <pre className="mt-3 overflow-x-auto rounded-md border border-border-subtle bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-text-primary">
            {detail.code}
          </pre>
        )}

        {detail.links && detail.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {detail.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-accent transition-colors hover:underline"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
