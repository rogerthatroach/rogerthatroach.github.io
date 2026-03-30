'use client';

type TheoremVariant = 'definition' | 'theorem' | 'proposition' | 'proof' | 'corollary' | 'remark';

interface TheoremBlockProps {
  variant: TheoremVariant;
  number?: number | string;
  title?: string;
  children: React.ReactNode;
}

const VARIANT_CONFIG: Record<TheoremVariant, { label: string; accent: string; bg: string }> = {
  definition: { label: 'Definition', accent: 'border-accent', bg: 'bg-accent-muted/30' },
  theorem: { label: 'Theorem', accent: 'border-accent', bg: 'bg-accent-muted/40' },
  proposition: { label: 'Proposition', accent: 'border-accent/70', bg: 'bg-accent-muted/20' },
  proof: { label: 'Proof', accent: 'border-text-tertiary/50', bg: 'bg-transparent' },
  corollary: { label: 'Corollary', accent: 'border-accent/50', bg: 'bg-accent-muted/15' },
  remark: { label: 'Remark', accent: 'border-text-tertiary/30', bg: 'bg-transparent' },
};

export default function TheoremBlock({ variant, number, title, children }: TheoremBlockProps) {
  const config = VARIANT_CONFIG[variant];
  const isProof = variant === 'proof';

  const headerParts: string[] = [];
  if (!isProof) {
    headerParts.push(`${config.label}${number != null ? ` ${number}` : ''}`);
    if (title) headerParts.push(`(${title})`);
  }

  return (
    <div className={`my-6 rounded-r-lg border-l-2 ${config.accent} ${config.bg} px-5 py-4`}>
      {isProof ? (
        <p className="mb-2 text-sm italic text-text-secondary">Proof.</p>
      ) : (
        <p className="mb-2 text-sm font-semibold text-text-primary">
          {headerParts[0]}
          {headerParts[1] && (
            <span className="ml-1 font-normal text-text-secondary">{headerParts[1]}</span>
          )}
          <span className="text-text-secondary">.</span>
        </p>
      )}
      <div className="text-base leading-relaxed text-text-secondary">{children}</div>
      {isProof && (
        <p className="mt-2 text-right text-text-tertiary">&#x25A0;</p>
      )}
    </div>
  );
}
