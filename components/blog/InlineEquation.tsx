'use client';

interface InlineEquationProps {
  html: string;
}

/**
 * Inline KaTeX-rendered expression. Sits in line with text for short
 * equations; falls back to a horizontal-scroll inline-block when the
 * expression is wider than the parent (typical on mobile for set-
 * notation equations like `V = {v_intake, ..., v_respond}`).
 *
 * The `max-w-full` + `overflow-x-auto` combination is the safety net.
 * Short equations don't trigger either constraint and render exactly
 * as before; long equations clip to the parent width and become
 * horizontally swipe-able rather than blowing out the page width.
 */
export default function InlineEquation({ html }: InlineEquationProps) {
  return (
    <span
      className="inline-block max-w-full overflow-x-auto align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
