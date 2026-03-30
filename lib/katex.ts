import katex from 'katex';

/**
 * Pre-render LaTeX to KaTeX HTML string.
 * Called at module scope (outside React components) to avoid
 * prop serialization across the client/server boundary.
 */
export function tex(latex: string, display = false): string {
  return katex.renderToString(latex, {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });
}
