// Ambient type for MDX imports. @types/mdx ships this declaration too, but
// TS 6 stopped auto-resolving it from node_modules/@types, so declare it
// locally (it's covered by the tsconfig `**/*.ts` include). This types the
// dynamic post imports in components/blog/BlogPostShell.tsx. Ambient
// `declare module '*.mdx'` blocks merge, so this augments rather than conflicts.
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
