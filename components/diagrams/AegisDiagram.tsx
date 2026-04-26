'use client';

/**
 * Aegis architecture diagram — used on /projects/aegis.
 *
 * Single source of truth: re-exports the "Cascade" diagram built for
 * the formal blog post (`components/blog/diagrams/AegisCascade.tsx`).
 * The case study and the blog post render exactly the same architecture
 * visual — any drift is a bug, not a feature. Matches the Astraeus +
 * Prometheus pattern.
 */

export { default } from '@/components/blog/diagrams/AegisCascade';
