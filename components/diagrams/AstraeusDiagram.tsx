'use client';

/**
 * Astraeus architecture diagram — used on /projects/astraeus.
 *
 * Single source of truth: re-exports the "Cascade" diagram built for
 * the formal blog post (`components/blog/diagrams/AstraeusCascade.tsx`).
 * The case study and the blog post render exactly the same architecture
 * visual — any drift is a bug, not a feature. Matches the PAR pattern
 * where PARAssistDiagram re-exports AgenticArchitecturePAR.
 */

export { default } from '@/components/blog/diagrams/AstraeusCascade';
