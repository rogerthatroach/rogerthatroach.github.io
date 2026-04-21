'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Inline hover/focus-revealed popover for glossary terms.
 *
 * Accessibility:
 * - Trigger is a focusable <span> with cursor-help
 * - Escape dismisses an open popover
 * - Popover has role="tooltip" + aria-describedby relationship
 * - Works with mouse hover AND keyboard focus
 *
 * Used by Glossed.tsx which auto-wraps matching glossary terms in prose.
 */
export default function HoverTerm({
  detail,
  children,
}: {
  detail: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-block">
      <span
        tabIndex={0}
        aria-describedby={show ? id : undefined}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setShow(false);
            (e.currentTarget as HTMLSpanElement).blur();
          }
        }}
        className="cursor-help border-b border-dotted border-accent/50 font-medium text-text-primary transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:border-accent focus-visible:text-accent"
      >
        {children}
      </span>
      <AnimatePresence>
        {show && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 block w-64 -translate-x-1/2 rounded-lg border border-border-subtle bg-surface/95 p-3 text-xs font-normal not-italic leading-relaxed text-text-secondary shadow-xl backdrop-blur-md sm:w-72"
          >
            {detail}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
