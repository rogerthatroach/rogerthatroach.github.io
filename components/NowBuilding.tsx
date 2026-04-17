'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NOW_BUILDING } from '@/data/nowBuilding';

export default function NowBuilding() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="now" className="px-6 py-14 md:px-16">
      <div className="mx-auto max-w-content">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-widest text-text-tertiary"
        >
          What I&apos;m building now
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 max-w-2xl text-2xl font-bold text-text-primary sm:text-3xl"
        >
          Current work.
        </motion.h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {NOW_BUILDING.map((item, i) => (
            <motion.li
              key={item.lead}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="rounded-xl border border-border-subtle bg-surface/40 p-5"
            >
              <p className="text-sm font-semibold text-text-primary">{item.lead}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
