'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { HERO } from '@/data/hero';

const ParticleField = dynamic(() => import('@/components/ParticleField'), {
  ssr: false,
});

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-16">
      <ParticleField />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

      <div className="relative z-10 max-w-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
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
            className="mb-10 max-w-2xl text-lg text-text-secondary sm:text-xl md:text-2xl"
          >
            {HERO.tagline}
          </motion.p>

          <motion.div
            custom={3}
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
            <span className="flex items-center gap-1.5 text-sm text-text-tertiary">
              <MapPin size={14} />
              {HERO.location}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      </div>
    </section>
  );
}
