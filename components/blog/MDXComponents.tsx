import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 text-lg font-medium text-text-primary">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-text-secondary">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-inside list-disc space-y-2 text-base text-text-secondary">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-inside list-decimal space-y-2 text-base text-text-secondary">{children}</ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs text-text-secondary">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-border-subtle text-left text-text-tertiary">{children}</thead>
    ),
    th: ({ children }) => <th className="pb-2 pr-4 font-medium">{children}</th>,
    td: ({ children }) => <td className="py-2 pr-4 text-text-secondary">{children}</td>,
    tr: ({ children }) => <tr className="border-b border-border-subtle/50">{children}</tr>,
    hr: () => <hr className="my-8 border-border-subtle" />,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-accent pl-4 text-text-secondary italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline-offset-2 hover:underline"
      >
        {children}
      </a>
    ),
    ...components,
  };
}
