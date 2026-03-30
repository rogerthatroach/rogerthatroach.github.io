'use client';

interface InlineEquationProps {
  html: string;
}

export default function InlineEquation({ html }: InlineEquationProps) {
  return (
    <span
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
