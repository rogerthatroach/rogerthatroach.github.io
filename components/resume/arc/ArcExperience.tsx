'use client';

import Link from 'next/link';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ChevronDown, Download, ArrowRight, LayoutList } from 'lucide-react';
import { TIMELINE } from '@/data/timeline';
import { HERO } from '@/data/hero';
import ArcProgress from './ArcProgress';
import EraChapter from './EraChapter';

/**
 * The scrollytelling resume experience at /resume/arc.
 *
 * Renders chronologically (TCS → Quantiphi → RBC Sr → RBC Lead) so the
 * ascending-abstraction arc (physical → cloud → financial → intelligent)
 * reads naturally as the reader scrolls.
 *
 * Top progress bar driven by useScroll. Right-side rail tracks which era
 * is currently centered via IntersectionObserver (inside ArcProgress).
 *
 * Respects prefers-reduced-motion — when set, scroll-driven transforms
 * become no-ops and content renders static.
 */
export default function ArcExperience() {
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const reduceMotion = useReducedMotion();

  // Descending — newest role first (resume convention). Reader starts
  // at the current substrate (agentic AI) and traces the pattern back
  // to where it was forged at 900MW. Outro names the through-line.
  const eras = TIMELINE;

  return (
    <>
      {/* Top progress bar — hairline, driven by total scroll */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduceMotion ? 1 : progressScaleX }}
        className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-accent"
      />

      {/* Right-side era progress rail */}
      <ArcProgress eras={eras} />

      <div className="relative">
        {/* Intro — the thesis */}
        <section className="px-6 pb-16 pt-28 md:px-16 md:pb-24 md:pt-32">
          <div className="mx-auto max-w-content">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Career Arc
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              Same pattern.
              <br />
              Four abstraction levels.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Every role runs the same loop:{' '}
              <strong className="text-text-primary">sense → model → optimize → act.</strong>{' '}
              Starting where I am now — enterprise agentic AI — and tracing the pattern
              back through financial services, cloud ML, and the industrial machine
              learning where it was forged. Scroll to trace the arc back.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs text-text-tertiary">
              <motion.span
                animate={reduceMotion ? {} : { y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <ChevronDown size={16} />
              </motion.span>
              Scroll to begin
            </div>
          </div>
        </section>

        {/* Era chapters, chronological */}
        {eras.map((era, i) => (
          <EraChapter key={era.id} era={era} index={i} total={eras.length} />
        ))}

        {/* Outro — pattern callout + CTA */}
        <section className="px-6 py-24 md:px-16">
          <div className="mx-auto max-w-content">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              The pattern, stated
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug text-text-primary sm:text-3xl md:text-4xl">
              Sense the state of the system. Model it. Optimize against a goal. Act —
              and close the loop.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              Across four substrates — physical plant, cloud document pipelines, enterprise
              finance, agentic AI — the engineering discipline rhymes. That&apos;s the arc.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/resume"
                className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
              >
                <LayoutList size={16} />
                Structured resume view
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Download size={16} />
                PDF
              </a>
              <a
                href={HERO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-tertiary hover:text-accent"
              >
                linkedin.com/in/harmilapsingh →
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
