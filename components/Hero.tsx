'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';
import { NUMBER_SEQUENCE, HERO, HERO_SUMMARY, INDUSTRIES } from '@/data/hero';
import { COMPANIES } from '@/data/companies';

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-16">
      <ParticleField />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

      {/* Main identity — two-column on lg+ (portrait left, text right), stacked on mobile */}
      <div className="relative z-10 grid w-full max-w-content grid-cols-1 items-start gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:order-last"
        >
          <motion.p
            custom={0}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-4 font-mono text-sm tracking-widest text-accent"
          >
            {HERO.title}
          </motion.p>

          <motion.h1
            custom={1}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {HERO.name}
          </motion.h1>

          <motion.p
            custom={2}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-5 max-w-2xl text-lg text-text-secondary sm:text-xl md:text-2xl"
          >
            {HERO.tagline}
          </motion.p>

          <motion.p
            custom={3}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base"
          >
            {HERO.bio}
          </motion.p>

          {/* Industries — pattern-matching signal for business-audience skimmers */}
          <motion.p
            custom={4}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-8 font-mono text-[11px] uppercase tracking-widest text-text-tertiary"
          >
            {INDUSTRIES.join(' · ')}
          </motion.p>

          {/* Companies strip — text treatments, not raw logos (see data/companies.ts) */}
          <motion.div
            custom={5}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Experience
            </span>
            {COMPANIES.map((c) => (
              <a
                key={c.id}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${c.name} — ${c.role} (${c.period})`}
                className="group inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface/40 px-3 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all hover:bg-surface-hover"
                style={{ color: c.accent }}
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

          <motion.div
            custom={6}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6"
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
                className="rounded-lg border border-border-subtle bg-surface/50 p-3 text-text-secondary backdrop-blur-sm transition-all hover:border-accent/30 hover:text-accent hover:shadow-lg hover:shadow-accent/10"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Portrait — head-centered 4:5 crop, face-isolated brightness boost
            baked into the source (see /tmp/face-brighten.py). Embossed on the
            page: no border, no drop shadow. lg:mt-9 aligns the top with the name line. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative order-first mx-auto aspect-[4/5] w-48 overflow-hidden rounded-2xl sm:w-60 lg:mx-0 lg:mt-9 lg:w-72 xl:w-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portrait.webp"
            alt="Harmilap Singh Dhaliwal"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Number sequence — ambient strip at bottom of viewport */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
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

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: sequenceDone ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-text-tertiary">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-text-tertiary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
