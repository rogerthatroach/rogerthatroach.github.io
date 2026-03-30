'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { ABOUT } from '@/data/about';
import { AWARDS } from '@/data/awards';

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="about" className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-content">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          About
        </motion.h2>

        {/* Bio */}
        <div className="max-w-2xl space-y-4">
          {ABOUT.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              className="text-sm leading-relaxed text-text-secondary"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* 70/30 Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 max-w-lg"
        >
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${ABOUT.split.handsOn.percent}%` } : {}}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-l-full bg-accent"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${ABOUT.split.leadership.percent}%` } : {}}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-r-full bg-text-tertiary/40"
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-text-tertiary">
            <span>{ABOUT.split.handsOn.percent}% {ABOUT.split.handsOn.label}</span>
            <span>{ABOUT.split.leadership.percent}% {ABOUT.split.leadership.label}</span>
          </div>
        </motion.div>

        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <h3 className="mb-4 font-mono text-xs font-semibold tracking-widest text-text-tertiary uppercase">
            Recognition
          </h3>
          <div className="flex flex-wrap gap-3">
            {AWARDS.map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.3 }}
                className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-3 py-2"
              >
                <Trophy size={12} className="shrink-0 text-accent" />
                <div>
                  <span className="text-xs font-medium text-text-primary">{award.title}</span>
                  <span className="ml-1.5 text-[10px] text-text-tertiary">
                    {award.org} · {award.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
