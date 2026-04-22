'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';
import { NUMBER_SEQUENCE, HERO, HERO_SUMMARY, INDUSTRIES } from '@/data/hero';
import { COMPANIES } from '@/data/companies';
import { companyTextStyle } from '@/lib/palette';

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

      {/* Three stacked blocks so the hero reads as distinct visual signals,
          not running paragraphs:
            1 · Role eyebrow — top band, full width.
            2 · Identity — portrait + (name + tagline + bio) side-by-side.
            3 · Context — industries / experience / socials, grouped tight. */}
      <div className="relative z-10 mx-auto flex w-full max-w-content flex-col gap-8 px-6 md:px-16 lg:gap-10">
        {/* === 1 · Role eyebrow — its own line, full width, ceremonial === */}
        <motion.p
          custom={0}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="font-mono text-sm font-bold tracking-[0.2em] text-accent sm:text-base"
        >
          <span className="mr-2 text-text-tertiary">§</span>
          {HERO.title}
        </motion.p>

        {/* === 2 · Portrait + identity block ===
            Portrait in the auto-width track; name / tagline / bio wrap
            alongside it. items-center vertically balances the two. */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-8">
          {/* Portrait — order-first on mobile (leads the stack). Lives in the
              first (auto) track on lg+. */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative order-first mx-auto aspect-[4/5] w-32 overflow-hidden rounded-lg sm:w-40 lg:mx-0 lg:w-[188px] xl:w-[202px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait.webp"
              srcSet="/images/portrait-sm.webp 700w, /images/portrait.webp 1000w"
              sizes="(max-width: 1024px) 160px, 202px"
              alt="Harmilap Singh Dhaliwal"
              className="h-full w-full object-cover"
              {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
            />
          </motion.div>

          {/* Name + tagline + bio — tight stack so the block reads as one
              identity card, not three paragraphs. */}
          <div>
            <motion.h1
              custom={1}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              // lg:whitespace-nowrap keeps the full name on one line at
              // desktop widths; mobile retains natural wrapping so it
              // doesn't overflow the column at 375px.
              className="mb-3 text-[23px] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[28px] md:text-[34px] lg:whitespace-nowrap lg:text-[46px] xl:text-[57px]"
            >
              {HERO.name}
            </motion.h1>

            <motion.p
              custom={2}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="mb-3 max-w-2xl font-display text-[15px] leading-[1.3] text-text-secondary sm:text-[17px] md:text-[19px]"
            >
              {HERO.tagline}
            </motion.p>

            <motion.p
              custom={3}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="max-w-2xl font-display text-[13px] leading-[1.55] text-text-tertiary sm:text-[15px]"
            >
              {HERO.bio}
            </motion.p>
          </div>
        </div>

        {/* === 3 · Context block — industries label + companies row + socials,
            grouped tight so they read as "where I've been / how to reach me,"
            clearly separate from the identity block above. === */}
        <div className="flex flex-col gap-5 border-t border-border-subtle pt-6 sm:gap-6">
          {/* Industries — tight to the companies row below. */}
          <motion.p
            custom={4}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary"
          >
            {INDUSTRIES.join(' · ')}
          </motion.p>

          {/* Experience companies row. */}
          <motion.div
            custom={5}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="block w-full font-mono text-[10px] uppercase tracking-widest text-text-tertiary sm:inline sm:w-auto">
              Experience
            </span>
            {COMPANIES.map((c) => (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${c.name} — ${c.role} (${c.period})`}
                className="palette-text group inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface/40 px-3 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all hover:bg-surface-hover"
                style={companyTextStyle(c)}
              >
                {c.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logo}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-auto max-w-[48px] shrink-0 object-contain"
                  />
                )}
                {c.shortName}
                <span className="font-mono text-[10px] font-normal text-text-tertiary transition-colors group-hover:text-text-secondary">
                  {c.period}
                </span>
              </a>
            ))}
          </motion.div>

          {/* Socials — smaller than before since they now share a grouped
              block with industries + experience. */}
          <motion.div
            custom={6}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 pt-1"
          >
            {[
              { href: HERO.links.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: HERO.links.github, icon: Github, label: 'GitHub' },
              { href: `mailto:${HERO.links.email}`, icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="rounded-lg border border-border-subtle bg-surface/50 p-2.5 text-text-secondary backdrop-blur-sm transition-all hover:border-accent/30 hover:text-accent hover:shadow-lg hover:shadow-accent/10"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>
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
