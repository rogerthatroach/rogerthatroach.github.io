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
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          Recognition
        </motion.h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AWARDS.map((award, i) => (
            <motion.li
              key={`${award.title}-${award.year}`}
              initial={false}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="flex gap-4 rounded-xl border border-border-subtle bg-surface/50 p-4"
            >
              {/* Optional award image; the icon is the public fallback. */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-accent-muted">
                {award.imagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={award.imagePath}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Trophy size={22} className="text-accent" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold leading-snug text-text-primary">
                  {award.title}
                </h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  {award.org} · {award.year}
                </p>
                {award.detail && (
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {award.detail}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
