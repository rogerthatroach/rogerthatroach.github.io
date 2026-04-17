'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { AWARDS } from '@/data/awards';

export default function RecognitionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="recognition" className="px-6 py-14 md:px-16">
      <div className="mx-auto max-w-content">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          Recognition
        </motion.h2>

        <div className="flex flex-wrap gap-3">
          {AWARDS.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
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
      </div>
    </section>
  );
}
