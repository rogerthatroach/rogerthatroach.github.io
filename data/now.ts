const UPDATED = 'November 2026';

export const NOW = {
  updated: UPDATED,
  heading: 'Current focus.',
  metaDescription: `Current production support, development, and evaluation work as of ${UPDATED}.`,
  bullets: [
    {
      heading: 'Operating',
      body: 'Supporting the AI/LLM drafting platform in production after its organization-wide launch in May 2026: reviewing user feedback, investigating observed behavior, and following changes through evaluation and release.',
    },
    {
      heading: 'Developing',
      body: 'A multi-agent successor is in development.',
    },
    {
      heading: 'Improving',
      body: 'Turning production feedback into clearer test cases, coverage checks, and follow-through without widening the reviewed application boundary.',
    },
  ],
} as const;
