'use client';

import { useState, useId, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Inline hover/focus-revealed popover for glossary terms.
 *
 * Portal-rendered. The popover lives in document.body so it escapes any
 * ancestor stacking context (sticky containers, backdrop-blur elements,
 * etc. that were hiding it behind adjacent columns in /resume/arc).
 *
 * Position is computed from the trigger's bounding box and updated on
 * scroll / resize so the popover tracks the term as the page moves.
 *
 * Accessibility:
 *   - Trigger is a focusable span with cursor-help
 *   - Escape dismisses + blurs the trigger
 *   - role="tooltip" + aria-describedby relationship
 *   - Works on mouse hover AND keyboard focus
 */

// useLayoutEffect warns in SSR; we gate with `mounted`, so effectively
// client-only — safe to use the synchronous variant once mounted.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function HoverTerm({
  detail,
  children,
}: {
  detail: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useIsoLayoutEffect(() => {
    if (!show || !triggerRef.current) return;
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportW = window.innerWidth;
      // Popover width: w-64 (256) on mobile, sm:w-72 (288) above 640, with
      // max-w-[calc(100vw-2rem)] acting as an upper cap on narrow screens.
      // We store the edge coordinate directly so we don't depend on a CSS
      // translate (which Framer overwrites during the enter animation).
      const baseWidth = viewportW >= 640 ? 288 : 256;
      const popoverWidth = Math.min(baseWidth, viewportW - 32);
      const halfWidth = popoverWidth / 2;
      const margin = 12;
      const center = rect.left + rect.width / 2;
      const clampedCenter = Math.max(
        halfWidth + margin,
        Math.min(viewportW - halfWidth - margin, center)
      );
      setPos({
        left: clampedCenter - halfWidth,
        top: rect.bottom + 6,
      });
    };
    update();
    // Track scroll + resize so the popover follows the term
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [show]);

  return (
    <>
      <span
        ref={triggerRef}
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
      {mounted &&
        createPortal(
          <AnimatePresence>
            {show && (
              <motion.span
                id={id}
                role="tooltip"
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'fixed',
                  left: pos.left,
                  top: pos.top,
                }}
                className="pointer-events-none z-[100] block w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-border-subtle bg-surface/95 p-3 text-xs font-normal not-italic leading-relaxed text-text-secondary shadow-xl backdrop-blur-md sm:w-72"
              >
                {detail}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
