'use client';

interface CitationRefProps {
  id: number;
}

export default function CitationRef({ id }: CitationRefProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(`ref-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <a
      href={`#ref-${id}`}
      onClick={handleClick}
      className="text-accent underline decoration-accent/40 decoration-dotted underline-offset-2 transition-colors hover:text-text-primary hover:decoration-accent"
      title={`Jump to reference ${id}`}
    >
      [{id}]
    </a>
  );
}
