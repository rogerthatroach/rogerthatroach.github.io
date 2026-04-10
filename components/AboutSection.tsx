'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ABOUT } from '@/data/about';

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

        {/* Opener — the thesis */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-2xl text-xl font-semibold leading-snug text-text-primary sm:text-2xl"
        >
          {ABOUT.opener}
        </motion.p>

        {/* Hook paragraphs */}
        <div className="mt-6 max-w-2xl space-y-4">
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
        <ol className="mt-8 max-w-2xl space-y-6">
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
          className="mt-10 max-w-2xl text-sm leading-relaxed text-text-secondary"
        >
          {ABOUT.closer}
        </motion.p>
      </div>
    </section>
  );
}
