'use client';

import katex from 'katex';

interface InlineEquationProps {
  tex: string;
}

export default function InlineEquation({ tex }: InlineEquationProps) {
  const html = katex.renderToString(tex, {
    displayMode: false,
    throwOnError: false,
    strict: false,
  });

  return (
    <span
      className="inline-block align-middle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
