'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { HERO } from '@/data/hero';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 md:px-16">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-content">
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
          className="mb-6 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {HERO.name}
        </motion.h1>

        <motion.p
          custom={2}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mb-8 max-w-2xl text-lg text-zinc-400 sm:text-xl md:text-2xl"
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
          <a
            href={HERO.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-400 transition-colors hover:text-accent"
          >
            <Linkedin size={22} />
          </a>
          <a
            href={HERO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-zinc-400 transition-colors hover:text-accent"
          >
            <Github size={22} />
          </a>
          <a
            href={`mailto:${HERO.links.email}`}
            aria-label="Email"
            className="text-zinc-400 transition-colors hover:text-accent"
          >
            <Mail size={22} />
          </a>
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <MapPin size={14} />
            {HERO.location}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
