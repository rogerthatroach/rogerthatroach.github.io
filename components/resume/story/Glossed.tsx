import { Fragment } from 'react';
import HoverTerm from './HoverTerm';
import { GLOSSARY } from '@/data/glossary';

/**
 * Auto-wraps glossary terms in a plaintext string with HoverTerm popovers.
 *
 * Usage: <Glossed>{someTextContainingTerms}</Glossed>
 *
 * Matching strategy: split on /(term1|term2|...)/ with longest terms
 * first (so "Maizuru 900MW" is tried before "Maizuru"). Terms that
 * resolve to a GLOSSARY entry render as HoverTerm; everything else
 * renders as a Fragment of plain text.
 *
 * Deterministic server-safe — no hooks, no state. Can render in SSR.
 */
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const GLOSSARY_PATTERN = new RegExp(
  `(${GLOSSARY_TERMS.map(escapeRegex).join('|')})`,
  'g'
);

export default function Glossed({ children }: { children: string }) {
  if (GLOSSARY_TERMS.length === 0) {
    return <>{children}</>;
  }

  const parts = children.split(GLOSSARY_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        const detail = GLOSSARY[part];
        if (detail) {
          return (
            <HoverTerm key={i} detail={detail}>
              {part}
            </HoverTerm>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
