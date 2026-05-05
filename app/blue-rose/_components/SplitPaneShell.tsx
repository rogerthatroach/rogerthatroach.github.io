'use client';

import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneShellProps {
  /** Width ratio of the left pane (0..1). */
  ratio: number;
  onRatioChange: (ratio: number) => void;
  /** Min ratio for either pane (default 0.25). */
  minRatio?: number;
  /** Max ratio for either pane (default 0.75). */
  maxRatio?: number;
  /** [leftPane, rightPane] children. */
  children: [ReactNode, ReactNode];
  className?: string;
}

/**
 * SplitPaneShell — horizontal two-pane layout with a draggable splitter.
 *
 * Pointer-event-driven (works with mouse, touch, pen). Pointer capture
 * is set on the handle so drags continue even if the pointer moves
 * outside it. Ratio is clamped to [minRatio, maxRatio]; the onRatioChange
 * callback fires on every move (parent decides whether to throttle or
 * persist).
 *
 * Visual: a 4px-wide column between the panes — invisible by default,
 * showing the standard Themis amethyst on hover and during drag. A wider
 * invisible hit area extends ±6px outward so the user doesn't have to
 * pixel-hunt to grab the handle.
 */
export default function SplitPaneShell({
  ratio,
  onRatioChange,
  minRatio = 0.25,
  maxRatio = 0.75,
  children,
  className,
}: SplitPaneShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const r = Math.max(minRatio, Math.min(maxRatio, x / rect.width));
      onRatioChange(r);
    },
    [dragging, onRatioChange, minRatio, maxRatio],
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex h-full w-full', dragging && 'select-none', className)}
    >
      <div className="h-full overflow-hidden" style={{ width: `${ratio * 100}%` }}>
        {children[0]}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={Math.round(minRatio * 100)}
        aria-valuemax={Math.round(maxRatio * 100)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          'group relative flex w-1 shrink-0 cursor-col-resize select-none items-center justify-center transition-colors',
          dragging
            ? 'bg-[var(--themis-primary)]/50'
            : 'bg-border-subtle/40 hover:bg-[var(--themis-primary)]/40',
        )}
      >
        {/* Wider invisible hit area for easier grabbing */}
        <span
          aria-hidden="true"
          className="absolute -inset-x-1.5 inset-y-0"
          style={{ touchAction: 'none' }}
        />
        {/* Visible handle indicator — vertical pill */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute h-12 w-[2px] rounded-full transition-all',
            dragging || 'opacity-50',
            dragging ? 'bg-[var(--themis-primary)] opacity-100' : 'bg-text-tertiary group-hover:bg-[var(--themis-primary)] group-hover:opacity-100',
          )}
        />
      </div>
      <div className="h-full overflow-hidden" style={{ width: `${(1 - ratio) * 100}%` }}>
        {children[1]}
      </div>
    </div>
  );
}
