'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Linkedin, ArrowRight } from 'lucide-react';
import { ABOUT } from '@/data/about';
import { HERO } from '@/data/hero';

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="about" className="px-6 py-14 md:px-16">
      <div className="mx-auto max-w-content">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          About
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_auto] lg:gap-16">
          {/* Text column */}
          <div>
            {/* Opener — the thesis */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xl font-semibold leading-snug text-text-primary sm:text-2xl"
            >
              {ABOUT.opener}
            </motion.p>

            {/* Hook paragraphs */}
            <div className="mt-6 space-y-4">
              {ABOUT.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="text-sm leading-relaxed text-text-secondary"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Three beliefs */}
            <ol className="mt-8 space-y-6">
              {ABOUT.beliefs.map((belief, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="border-l-2 border-accent/40 pl-5"
                >
                  <p className="text-sm leading-relaxed text-text-secondary">
                    <span className="font-semibold text-text-primary">{belief.lead}</span>{' '}
                    {belief.body}
                  </p>
                </motion.li>
              ))}
            </ol>

            {/* Closer — CTA */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-10 text-sm leading-relaxed text-text-secondary"
            >
              {ABOUT.closer}
            </motion.p>
          </div>

          {/* Portrait + contact aside */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start lg:w-[280px]"
          >
            {/*
              PLACEHOLDER — when a real portrait is ready:
              1. Drop the file at public/images/portrait.jpg (or .webp)
              2. Replace the inner <div> with:
                 <img src="/images/portrait.jpg" alt="Harmilap Singh Dhaliwal" className="h-full w-full object-cover" />
              Keep the aspect ratio and rounded-2xl wrapper intact.
            */}
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface/50">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-5xl font-semibold tracking-tight text-text-tertiary">HSD</div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                    Portrait
                  </div>
                </div>
              </div>
            </div>

            <a
              href={HERO.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
            >
              <Linkedin size={16} />
              Let&rsquo;s connect on LinkedIn
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
