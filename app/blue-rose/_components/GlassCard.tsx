'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassCard — soft frosted-glass surface for Themis chrome.
 *
 * Reads --themis-glass-* tokens from `_styles/themis.css`. Falls back to
 * --color-surface so the same component works without the Themis scope
 * (e.g. inside the lock-screen panel before the layout has applied
 * data-themis="true" on a child).
 */
export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function GlassCard({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'themis-glass rounded-2xl shadow-[0_1px_0_inset_rgba(255,255,255,0.06),0_18px_60px_-32px_rgba(0,0,0,0.3)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default GlassCard;
