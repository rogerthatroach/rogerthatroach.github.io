'use client';

/**
 * PAR Assist architecture diagram — used on /projects/par-assist.
 *
 * Single source of truth: re-exports the "envelope" diagram built for
 * the blog post (`components/blog/diagrams/AgenticArchitecturePAR.tsx`).
 * The case study and the formal blog post render exactly the same
 * architecture visual — any drift is a bug, not a feature.
 */

export { default } from '@/components/blog/diagrams/AgenticArchitecturePAR';
