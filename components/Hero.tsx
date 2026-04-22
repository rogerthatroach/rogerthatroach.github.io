'use client';

import { useState, useEffect, useCallback } from 'react';
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
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Hero() {
  const [frame, setFrame] = useState(0);
  const [sequenceDone, setSequenceDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const advance = useCallback(() => {
    setFrame((prev) => {
      const next = prev + 1;
      if (next >= NUMBER_SEQUENCE.length) {
        setSequenceDone(true);
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setSequenceDone(true);
      return;
    }
    // Start number cycling after identity has landed
    const startDelay = setTimeout(() => {
      const timer = setInterval(advance, FRAME_DURATION);
      return () => clearInterval(timer);
    }, 2000);
    return () => clearTimeout(startDelay);
  }, [advance, prefersReducedMotion]);

  useEffect(() => {
    if (frame > 0 && !sequenceDone) {
      const timer = setInterval(advance, FRAME_DURATION);
      return () => clearInterval(timer);
    }
  }, [frame, advance, sequenceDone]);

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
      <ParticleField />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

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
            className="relative order-first mx-auto aspect-[4/5] w-[155px] overflow-hidden rounded-lg sm:w-[194px] lg:mx-0 lg:w-[228px] xl:w-[244px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait.webp"
              srcSet="/images/portrait-sm.webp 700w, /images/portrait.webp 1000w"
              sizes="(max-width: 1024px) 194px, 244px"
              alt="Harmilap Singh Dhaliwal"
              className="h-full w-full object-cover"
              {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
            />
          </motion.div>

          {/* Role eyebrow + name + tagline + bio — role now sits immediately
              above the name as the "who + where" frame. Tagline and bio
              bumped up in size so they carry real weight on desktop. */}
          <div>
            <motion.p
              custom={0}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mb-2 font-mono text-[15px] font-bold uppercase tracking-[0.18em] text-accent sm:text-[16px]"
            >
              <span className="mr-2 text-text-tertiary">§</span>
              {HERO.title}
            </motion.p>

            <motion.h1
              custom={1}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              // lg:whitespace-nowrap keeps the full name on one line at
              // desktop widths; mobile retains natural wrapping so it
              // doesn't overflow the column at 375px.
              className="mb-3 text-[28px] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[34px] md:text-[41px] lg:whitespace-nowrap lg:text-[53px]"
            >
              {HERO.name}
            </motion.h1>

            <motion.p
              custom={2}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mb-3 max-w-2xl font-display text-[21px] leading-[1.3] text-text-secondary sm:text-[23px] md:text-[26px]"
            >
              {HERO.tagline}
            </motion.p>

            <motion.p
              custom={3}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="max-w-2xl font-display text-[19px] leading-[1.55] text-text-tertiary sm:text-[21px]"
            >
              {HERO.bio}
            </motion.p>
          </div>
        </div>

        {/* === 3 · CTAs — primary "Read case studies" + secondary "Contact / CV".
            Middle ground between the audit's pitch-first hero and the prior
            identity-heavy context block: keeps the portrait + name + tagline
            + bio above (individuality), drops industries/experience/socials
            (clutter), adds two explicit next-steps. Social links live in
            the Footer. === */}
        <motion.div
          custom={4}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-5 pt-2"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-5 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
          >
            Read case studies
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/50 px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
          >
            <FileBadge
              size={14}
              aria-hidden="true"
              className="text-text-tertiary transition-colors group-hover:text-accent"
            />
            Contact / CV
          </Link>
        </motion.div>
      </div>

      {/* Number sequence — ambient strip at bottom of viewport.
          Hidden < sm: the absolute-positioned ticker otherwise overlaps the
          social icons on mobile (content + ticker + bottom-10 > min-h-screen). */}
      <div className="absolute bottom-10 left-0 right-0 z-10 hidden sm:block">
        <div className="mx-auto max-w-content px-6 md:px-16">
          <AnimatePresence mode="wait">
            {!sequenceDone && (
              <motion.div
                key={frame}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-baseline gap-3"
              >
                <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl">
                  {NUMBER_SEQUENCE[frame].value}
                </span>
                <span className="font-mono text-xs tracking-wider text-text-tertiary">
                  {NUMBER_SEQUENCE[frame].context}
                </span>
              </motion.div>
            )}

            {sequenceDone && (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
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
      </div>

    </section>
  );
}
