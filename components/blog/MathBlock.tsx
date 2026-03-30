'use client';

interface MathBlockProps {
  html: string;
  label?: string;
}

export default function MathBlock({ html, label }: MathBlockProps) {
  return (
    <div className="my-6 flex items-center gap-4">
      <div
        className="min-w-0 flex-1 overflow-x-auto py-4 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {label && (
        <span className="shrink-0 text-sm text-text-tertiary">{label}</span>
      )}
    </div>
  );
}
