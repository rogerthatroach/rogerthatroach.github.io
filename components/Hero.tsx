'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileBadge } from 'lucide-react';
import dynamic from 'next/dynamic';
import { NUMBER_SEQUENCE, HERO, HERO_SUMMARY } from '@/data/hero';

const ParticleField = dynamic(() => import('@/components/ParticleField'), {
  ssr: false,
});

const FRAME_DURATION = 2800;

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Hero() {
  const [frame, setFrame] = useState(0);
  const [sequenceDone, setSequenceDone] = useState(false);
  // Defer the decorative Three.js field until the main thread is idle so its
  // bundle does not compete with primary content during initial rendering.
  const [showParticles, setShowParticles] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setSequenceDone(true);
      return;
    }
    if (sequenceDone) return;

    // Keep one cleanup-owned timer per frame. The previous nested interval's
    // cleanup was returned from inside setTimeout (and therefore ignored),
    // while a second effect started an overlapping interval after frame one.
    // The first frame retains the original 2 s landing delay plus its normal
    // display duration; subsequent frames each remain for FRAME_DURATION.
    const delay = frame === 0 ? 2000 + FRAME_DURATION : FRAME_DURATION;
    const timer = setTimeout(() => {
      const next = frame + 1;
      if (next >= NUMBER_SEQUENCE.length) {
        setSequenceDone(true);
      } else {
        setFrame(next);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [frame, prefersReducedMotion, sequenceDone]);

  useEffect(() => {
    if (prefersReducedMotion) return; // reduced-motion: never load the particle bundle
    type IdleHandle = number;
    let idleHandle: IdleHandle | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => IdleHandle;
      cancelIdleCallback?: (h: IdleHandle) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      idleHandle = w.requestIdleCallback(() => setShowParticles(true), { timeout: 2500 });
    } else {
      timeoutHandle = setTimeout(() => setShowParticles(true), 1500);
    }
    return () => {
      if (idleHandle !== null && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      aria-label="Intro"
      // Section handles min-height, nav clearance (pt-24 mobile), and the
      // full-bleed ParticleField + gradients. Horizontal padding moves to
      // the inner container so its left/right edges match Nav's (both use
      // mx-auto max-w-content + px-6 md:px-16, so HSD left-aligns with
      // the hero's content and the theme toggle right-aligns with it).
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-16 pt-24 md:pb-12 md:pt-0"
    >
      {showParticles && <ParticleField />}

      {/* Per-theme ambient accent haze — color follows the live theme accent,
          so switching themes visibly shifts the hero's atmosphere. Sits behind
          the z-10 content; the vignette gradients below fade it at the edges. */}
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-background/80" />

      {/* Two stacked blocks:
            1 · Identity — portrait + [role eyebrow, name, tagline, bio].
            2 · CTAs — Read case studies, Contact / CV. */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 md:px-16 lg:gap-10">
        {/* === 1 · Portrait + identity block ===
            Portrait in the auto-width track; name / tagline / bio wrap
            alongside it. items-center vertically balances the two. */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-8">
          {/* Portrait — order-first on mobile (leads the stack). Lives in the
              first (auto) track on lg+. */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative order-first mx-auto aspect-4/5 w-[155px] overflow-hidden rounded-lg sm:w-[194px] lg:mx-0 lg:w-[228px] xl:w-[244px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait.webp"
              srcSet="/images/portrait-sm.webp 700w, /images/portrait.webp 1000w"
              sizes="(max-width: 1024px) 194px, 244px"
              alt="Harmilap Singh Dhaliwal"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </motion.div>

          {/* Role eyebrow + name + tagline + bio — role now sits immediately
              above the name as the "who + where" frame. Tagline and bio
              bumped up in size so they carry real weight on desktop. */}
          <div>
            {/* Identity text — eyebrow, name, tagline, bio — renders at
                final state immediately (no entrance delay). Bio is the LCP
                candidate on mobile (largest rendered element below the
                portrait), so the prior FADE_UP cascade pushed LCP past 4 s.
                The CTA row + status pill below still animate for the
                "living page" feel; the content itself lands instantly. */}
            <p className="mb-2 font-mono text-[15px] font-bold uppercase tracking-[0.18em] text-accent sm:text-[16px]">
              <span className="mr-2 text-text-tertiary">§</span>
              {HERO.title}
            </p>

            <h1
              // lg:whitespace-nowrap keeps the full name on one line at
              // desktop widths; mobile retains natural wrapping so it
              // doesn't overflow the column at 375px.
              className="mb-3 text-[28px] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[34px] md:text-[41px] lg:whitespace-nowrap lg:text-[53px]"
            >
              {HERO.name}
            </h1>

            <p className="mb-3 max-w-2xl font-display text-[21px] leading-[1.3] text-text-secondary sm:text-[23px] md:text-[26px]">
              {HERO.tagline}
            </p>

            <p className="max-w-2xl font-display text-[19px] leading-[1.55] text-text-tertiary sm:text-[21px]">
              {HERO.bio}
            </p>
          </div>
        </div>

        {/* Primary case-study CTA plus secondary contact/CV actions. Social
            links remain in the footer to keep the hero focused. */}
        <motion.div
          custom={4}
          variants={FADE_UP}
          initial={false}
          animate="visible"
          className="flex flex-wrap items-center gap-5 pt-2"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-5 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
          >
            Read case studies
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
          >
            <FileBadge
              size={14}
              aria-hidden="true"
              className="text-text-tertiary transition-colors group-hover:text-accent"
            />
            Contact / CV
          </Link>
        </motion.div>

        {/* Availability signal — recruiters filter for location + openness.
            Single-line status pill makes both visible above the fold without
            duplicating footer content. */}
        <motion.p
          custom={5}
          variants={FADE_UP}
          initial={false}
          animate="visible"
          className="mt-1 inline-flex items-center gap-2 text-xs text-text-tertiary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span>
            <span className="text-text-secondary">Based in {HERO.location}</span>
            <span className="mx-2 opacity-40"> · </span>
            <span>Open to conversations</span>
          </span>
        </motion.p>

        <noscript>
          <p className="mt-4 font-mono text-xs tracking-wider text-text-tertiary sm:hidden">
            {HERO_SUMMARY.join(' · ')}
          </p>
        </noscript>
      </div>

      {/* Number sequence — ambient strip at bottom of viewport.
          Hidden < sm: the absolute-positioned ticker otherwise overlaps the
          social icons on mobile (content + ticker + bottom-10 > min-h-screen). */}
      <div className="absolute bottom-10 left-0 right-0 z-10 hidden sm:block">
        <div className="mx-auto max-w-content px-6 md:px-16">
          <div className="js-number-sequence">
            <AnimatePresence mode="wait">
            {!sequenceDone && (
              <motion.div
                key={frame}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="flex items-baseline gap-3"
              >
                <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl">
                  {NUMBER_SEQUENCE[frame].value}
                </span>
                <span className="sr-only"> — </span>
                <span className="font-mono text-xs tracking-wider text-text-tertiary">
                  {NUMBER_SEQUENCE[frame].context}
                </span>
              </motion.div>
            )}

            {sequenceDone && (
              <motion.div
                key="summary"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-6 font-mono text-xs tracking-wider text-text-tertiary"
              >
                {HERO_SUMMARY.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className="mr-6 inline-block h-3 w-px bg-border-subtle" />}
                    {item}
                  </span>
                ))}
              </motion.div>
            )}
            </AnimatePresence>

            {/* Progress dots */}
            {!sequenceDone && (
              <div className="mt-3 flex gap-1.5">
                {NUMBER_SEQUENCE.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-0.5 rounded-2xl"
                    animate={{
                      width: i === frame ? 24 : 6,
                      backgroundColor: i === frame ? 'var(--color-accent)' : 'var(--color-border)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            )}
          </div>

          <noscript>
            <style>{'.js-number-sequence{display:none!important}'}</style>
            <p className="font-mono text-xs tracking-wider text-text-tertiary">
              {HERO_SUMMARY.join(' · ')}
            </p>
          </noscript>
        </div>
      </div>

    </section>
  );
}
