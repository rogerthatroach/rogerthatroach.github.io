'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileBadge } from 'lucide-react';
import { HERO, HERO_SUMMARY } from '@/data/hero';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Intro"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-16 pt-24 md:pt-28"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-background/80" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 md:px-16 lg:gap-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-8">
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

          <div className="min-w-0">
            <p className="mb-2 font-mono text-[15px] font-bold uppercase tracking-[0.18em] text-accent sm:text-[16px]">
              <span className="mr-2 text-text-tertiary">§</span>
              {HERO.title}
            </p>

            <h1 className="mb-3 text-[28px] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[34px] md:text-[41px] lg:text-[53px] xl:whitespace-nowrap">
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

        {/* Primary case-study CTA plus secondary résumé action. Social
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
            className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-5 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
          >
            {HERO.actions.projects}
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/resume"
            className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
          >
            <FileBadge
              size={14}
              aria-hidden="true"
              className="text-text-tertiary transition-colors group-hover:text-accent"
            />
            {HERO.actions.resume}
          </Link>
        </motion.div>

        <motion.p
          custom={5}
          variants={FADE_UP}
          initial={false}
          animate="visible"
          className="mt-1 inline-flex items-center gap-2 text-xs text-text-tertiary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span>
            <span className="text-text-secondary">Based in {HERO.location}</span>
            <span className="mx-2 opacity-40"> · </span>
            <span>Open to conversations</span>
          </span>
        </motion.p>

        <ul
          aria-label="Career summary"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-wider text-text-tertiary"
        >
          {HERO_SUMMARY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
